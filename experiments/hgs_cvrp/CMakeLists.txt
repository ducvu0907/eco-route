cmake_minimum_required(VERSION 3.2)

set(
  geneticSources
  Genetic.cpp
)

set(
  populationSources
  Population.cpp
)

set(
  individualSources
  Individual.cpp
)

set(
  paramsSources
  Params.cpp
)

set(
  localSearchSources
  LocalSearch.cpp
)

set(
  splitSources
  Split.cpp
)

set(
  instanceCVRPLIBSources
  InstanceCVRPLIB.cpp
)

add_library(
  hgs
  $(geneticSources)
  $(populationSources)
  $(individualSources)
  $(paramsSources)
  $(localSearchSources)
  $(splitSources)
  $(instanceCVRPLIBSources)
)


include(FetchContent)
FetchContent_Declare(
  pybind11
  GIT_REPOSITORY https://github.com/pybind/pybind11.git
  GIT_TAG        v2.10.4
)
FetchContent_MakeAvailable(pybind11)

add_executable(genvrp main.cpp)
target_link_directories(genvrp PRIVATE hgs)

pybind11_add_module(hgspy bindings.cpp)
target_link_libraries(hgspy PRIVATE hgs)