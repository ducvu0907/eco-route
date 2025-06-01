from setuptools import setup, Extension
import pybind11
import sys
import os

# Define all your C++ sources
sources = [
    "bindings.cpp",
    "Genetic.cpp",
    "Population.cpp",
    "Individual.cpp",
    "Params.cpp",
    "LocalSearch.cpp",
    "Split.cpp",
    "InstanceCVRPLIB.cpp"
]

ext_modules = [
    Extension(
        "hgspy",  # Module name
        sources=sources,
        include_dirs=[
            pybind11.get_include(),
            pybind11.get_include(user=True),
            ".",  # Include current directory for headers like Genetic.h
        ],
        language="c++",
        extra_compile_args=["-std=c++17"]
    )
]

setup(
    name="hgspy",
    version="0.1",
    description="Python bindings for HGS CVRP",
    ext_modules=ext_modules,
    zip_safe=False,
)
