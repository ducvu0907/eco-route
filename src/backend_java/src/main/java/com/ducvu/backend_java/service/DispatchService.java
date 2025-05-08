package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.DispatchResponse;
import com.ducvu.backend_java.repository.DispatchRepository;
import com.ducvu.backend_java.util.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatchService {
  private final DispatchRepository dispatchRepository;
  private final Mapper mapper;

  public List<DispatchResponse> getDispatches() {
    return dispatchRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

}
