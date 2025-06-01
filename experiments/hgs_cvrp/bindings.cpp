#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

#include "Genetic.h"
#include "Params.h"
#include "Individual.h"
#include "CircleSector.h"
#include "Population.h"
#include "LocalSearch.h"
#include "Individual.h"
#include "Split.h"
#include "InstanceCVRPLIB.h"

namespace py = pybind11;

int add(int a, int b) {
  return a + b;
}

PYBIND11_MODULE(hgspy, m) {
  
}
