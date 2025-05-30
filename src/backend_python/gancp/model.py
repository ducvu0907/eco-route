# gancp implementation
import numpy as np
import random
import torch
import torch.nn as nn
import dgl
import dgl.nn.pytorch.utils
from dgl.nn.functional import edge_softmax
from torch.utils.data import Dataset, DataLoader
from torch_scatter import scatter_add, scatter_softmax


class MultiHeadAttention(nn.Module):
  def __init__(self, d_model: int = 128, d_head: int = 128, num_heads: int = 8, d_ff: int = 512, logit_clamp: float = 5.0):
    super(MultiHeadAttention, self).__init__()
    self.d_model = d_model
    self.num_heads = num_heads
    self.d_head = d_head
    self.d_ff = d_ff
    self.proj_q = nn.Linear(d_model, num_heads * d_head, bias=False)
    self.proj_k = nn.Linear(d_model, num_heads * d_head, bias=False)
    self.proj_v = nn.Linear(d_model, num_heads * d_head, bias=False)
    self.proj_o = nn.Linear(num_heads * d_head, d_model, bias=False)

    self.norm1 = nn.LayerNorm(d_model)

    self.ffn = nn.Sequential(
      nn.Linear(d_model, d_ff),
      nn.ReLU(),
      nn.Linear(d_ff, d_model)
    )

    self.norm2 = nn.LayerNorm(d_model)
    self.logit_clamp = logit_clamp

  def forward(self, g: dgl.DGLGraph, feat: torch.Tensor):
    with g.local_scope():
      # MHA part
      g.ndata['h'] = feat
      g.apply_edges(self.update_edges)
      g.edata['av'] = edge_softmax(g, g.edata['u']) * g.edata['v']
      g.update_all(dgl.function.copy_e('av', 'av'), self.reduce_func)

      # Normalization and FFN
      uh = self.norm1(feat + g.ndata['uh'])
      ffn_uh = self.ffn(uh)
      uh = self.norm2(uh + ffn_uh)
      return uh

  def update_edges(self, edges):
    q = self.proj_q(edges.dst['h'])
    k = self.proj_k(edges.src['h'])
    u = (q * k).reshape(-1, self.num_heads, self.d_head)  # [#. edges x num_heads x d_head]
    u = u.sum(dim=-1, keepdim=True) / np.sqrt(self.d_head)  # [#. edges x num_heads x 1]
    u = u.clamp(min=-self.logit_clamp, max=self.logit_clamp)
    v = self.proj_v(edges.src['h']).reshape(-1, self.num_heads, self.d_head)  # [#. edges x num_heads x d_head]
    return {'u': u, 'v': v}

  def reduce_func(self, nodes):
    sum_av = nodes.mailbox['av'].sum(dim=1)  # [#. nodes x num_heads x d_head]
    sum_av = sum_av.flatten(start_dim=1)  # [#. nodes x (num_heads x d_head)]
    uh = self.proj_o(sum_av)
    return {'uh': uh}



class BasicReadout(nn.Module):
  def __init__(self, op):
    super(BasicReadout, self).__init__()
    self.op = op

  def forward(self, g, x):
    with g.local_scope():
      g.ndata['feat'] = x
      rd = dgl.readout_nodes(g, 'feat', op=self.op)
      return rd



class GeneralizedReadout(torch.nn.Module):
  def __init__(self, family="softmax", p=1.0, beta=1.0,
               trainable_p=False, trainable_beta=False):
    super(GeneralizedReadout, self).__init__()

    self.family = family
    self.base_p = p
    self.base_beta = beta
    self.trainable_p = trainable_p
    self.trainable_beta = trainable_beta

    # define params
    self.p = torch.nn.Parameter(torch.tensor([p]), requires_grad=trainable_p)
    self.beta = torch.nn.Parameter(torch.tensor([beta]), requires_grad=trainable_beta)

  def forward(self, graph, x, bsize=None):
    batch = torch.repeat_interleave(torch.arange(graph.batch_size, device=x.device),
                                    graph.batch_num_nodes())
    bsize = int(batch.max().item() + 1) if bsize is None else bsize
    n_nodes = graph.batch_num_nodes()

    if self.family == "softmax":
      out = scatter_softmax(self.p * x.detach(), batch, dim=0)
      return scatter_add(x * out,
                         batch, dim=0, dim_size=bsize) * n_nodes.view(-1, 1) / (1 + self.beta * (n_nodes - 1)).view(-1, 1)

    elif self.family == "power":
      # numerical stability - avoid powers of large numbers or negative ones
      min_x, max_x = 1e-7, 1e+3
      torch.clamp_(x, min_x, max_x)
      out = scatter_add(torch.pow(x, self.p),
                        batch, dim=0, dim_size=bsize) / (1 + self.beta * (n_nodes - 1))
      torch.clamp_(out, min_x, max_x)
      return torch.pow(out, 1 / self.p)

  def reset_parameters(self):
    if self.p and torch.is_tensor(self.p):
      self.p.data.fill_(self.base_p)
    if self.beta and torch.is_tensor(self.beta):
      self.beta.data.fill_(self.base_beta)

  def __repr__(self):
    return "Generalized Aggr-Mean-Max global pooling layer with params:" + \
           str({"family": self.family,
                "base_p": self.base_p,
                "base_beta": self.base_beta,
                "trainable_p": self.trainable_p,
                "trainable_beta": self.trainable_beta})


class GraphDataset(Dataset):
  def __init__(self, g_list, *tensors, transform=None):
    assert all(len(g_list) == t.shape[0] for t in tensors), "Size mismatch between inputs"
    self.g_list = g_list
    self.tensors = tensors
    self.len = len(g_list)
    self.transform = transform

  def __getitem__(self, index):
    ret = (self.g_list[index],) + tuple(t[index] for t in self.tensors)
    if self.transform:
        ret = self.transform(ret)
    return ret

  def __len__(self):
    return self.len


class GraphDataLoader(DataLoader):
  def __init__(self, *args, **kwargs):
    kwargs['collate_fn'] = self.collate_fn
    super(GraphDataLoader, self).__init__(*args, **kwargs)

  def collate_fn(self, batch):
    out = tuple(map(list, zip(*batch)))
    gs = dgl.batch(out[0])
    tensors = tuple([torch.stack(o) for o in out[1:]])
    return (gs,) + tensors


class Transformer(nn.Module):
  def __init__(self, 
               in_dim: int, 
               latent_dim: int, 
               n_layers: int, 
               readout: str = "mean", 
               layer_share: bool = False,   
               mha_params: dict = {}):
    super(Transformer, self).__init__()

    self.encoder = nn.Linear(in_dim, latent_dim)

    self.layer_share = layer_share

    if self.layer_share:
      self.mha = MultiHeadAttention(d_model=latent_dim, **mha_params)
    else:
      self.mha = dgl.nn.pytorch.utils.Sequential(
        *tuple([MultiHeadAttention(d_model=latent_dim, **mha_params) for _ in range(n_layers)])
      )

    self.decoder = nn.Linear(latent_dim, 1)
    self.readout_method = readout
    if readout == "generalized":
      self.readout = GeneralizedReadout()
    else:
      self.readout = BasicReadout(readout)
    
    self.n_layers = n_layers
  
  def forward(self, graph: dgl.graph, nf: torch.tensor) -> torch.tensor:
      unf = self.encoder(nf)

      if self.layer_share:
        for _ in range(self.n_layers):
          unf = self.mha(graph, unf)
      else:
        unf = self.mha(graph, unf)

      if self.readout_method == 'generalized':
        unf = self.readout(graph, unf)
        pred = self.decoder(unf)
      else:
        unf = self.decoder(unf)
        pred = self.readout(graph, unf)
      return pred

def compute_dists(edges):
  src_coord, dst_coord = edges.src['coord'], edges.dst['coord']
  src_normed_coord, dst_normed_coord = edges.src['normed_coord'], edges.dst['normed_coord']
  dist = ((src_coord - dst_coord) ** 2).sum(dim=-1, keepdim=True).sqrt()
  normed_dist = ((src_normed_coord - dst_normed_coord) ** 2).sum(dim=-1, keepdim=True).sqrt()
  return {'dist': dist, 'normed_dist': normed_dist}

def compute_haversine_dists(edges):
  src_lat = torch.deg2rad(edges.src['coord'][:, 0])
  src_lon = torch.deg2rad(edges.src['coord'][:, 1])
  dst_lat = torch.deg2rad(edges.dst['coord'][:, 0])
  dst_lon = torch.deg2rad(edges.dst['coord'][:, 1])
  dist = haversine_dist(src_lat, src_lon, dst_lat, dst_lon).unsqueeze(-1)  # shape [num_edges, 1]
  normed_dist = dist
  return {'dist': dist, 'normed_dist': normed_dist}

def haversine_dist(lat1, lon1, lat2, lon2):
  R = 6371.0
  dlat = lat2 - lat1
  dlon = lon2 - lon1
  
  a = torch.sin(dlat / 2)**2 + torch.cos(lat1) * torch.cos(lat2) * torch.sin(dlon / 2)**2
  c = 2 * torch.atan2(torch.sqrt(a), torch.sqrt(1 - a))
  d = R * c
  return d

def get_knn_graph(coord=None, demand=None, q=None, cost=None,
                  k: int = 5,
                  depot_center: bool = True): 

  # if instance_path is not None:
  #   coord, demand, q, problem = parse_vrp_file(instance_path)
  #   _, cost, _ = parse_sol_file(instance_path)

  if coord.shape[0] != demand.shape[0]:
    # append virtual depot demand as 0
    demand = np.concatenate([np.array([0]), demand])

  normed_x, normed_y, metadata = get_normed_xy_and_scaler(coord, depot_center)
  scaler = metadata['scaler']
  normed_demand = demand / q

  # generate graph
  n = coord.shape[0]
  g = dgl.knn_graph(torch.tensor(coord), k=k)

  # meta data
  g.ndata['coord'] = torch.tensor(coord).view(-1, 2)
  g.ndata['normed_coord'] = torch.cat([torch.tensor(normed_x).view(-1, 1),
                                        torch.tensor(normed_y).view(-1, 1)],
                                      dim=-1).float()

  g.ndata['demand'] = torch.tensor(demand).view(-1, 1)
  g.ndata['q'] = q * torch.ones(n, 1)
  # g.ndata['normed_demand'] = g.ndata['demand'] / g.ndata['q']
  g.ndata['scaler'] = scaler * torch.ones(n, 1)

  g.apply_edges(compute_haversine_dists)  # compute distances

  # depot masking
  is_depot = torch.zeros(n, 1)
  is_depot[0, :] = 1.0
  g.ndata['is_depot'] = is_depot

  # prepare node features
  # normed_x, normed_y, normed_demand, depot_mask
  node_feat = [torch.tensor(normed_x).view(-1, 1),
                torch.tensor(normed_y).view(-1, 1),
                torch.tensor(normed_demand).view(-1, 1),
                is_depot]
  g.ndata['feat'] = torch.cat(node_feat, dim=-1).float()

  g.ndata['invariant_feat'] = torch.cat([torch.tensor(normed_demand).view(-1, 1),
                                          is_depot], dim=-1)

  cost_scaler = scaler * n
  metadata['cost_scaler'] = cost_scaler

  if cost is not None:
    g.ndata['cost'] = cost * torch.ones(n, 1)  # original cost
    g.ndata['label'] = cost / (scaler * n) * torch.ones(n, 1)  # normalized cost
    normed_cost = cost / cost_scaler
    metadata['normed_cost'] = normed_cost
    metadata['cost'] = cost

  return g, metadata

def get_normed_xy_and_scaler(coords, depot_center: bool = False):
    x, y = coords[:, 0], coords[:, 1]
    bot, left = min(y), min(x)

    if left < 0:
      x += left

    if bot < 0:  
      y += bot

    top, right = max(y), max(x)
    scaler = np.sqrt(top ** 2 + right ** 2)
    normed_x, normed_y = x / right, y / top

    if depot_center:
      normed_x -= normed_x[0]
      normed_y -= normed_y[0]

    metadata = {
      'right': right,
      'top': top,
      'depot': coords[0],
      'scaler': scaler,
    }

    return normed_x, normed_y, metadata


def set_seed(seed: int, use_cuda: bool):
    random.seed(seed)
    np.random.seed(seed)
    torch.random.manual_seed(seed)
    if use_cuda:
      torch.cuda.manual_seed(seed)
      torch.cuda.manual_seed_all(seed)
    dgl.seed(seed)
