#include <pybind11/pybind11.h>
#include <iostream>

namespace py = pybind11;

int add(int i, int j) {
  return i + j;
}

PYBIND11_MODULE(example, m) {
  m.doc() = "pybind11 example plugin";
  m.def("add", &add, "A function that adds two numbers");
}

