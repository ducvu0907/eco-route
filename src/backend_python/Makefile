CXX = g++
CXXFLAGS = -std=c++17 -O3 -Wall
INCLUDES = -Ihgs_cvrp
BIN_DIR = bin
SRC_DIR = hgs_cvrp

SRC_FILES = \
    $(SRC_DIR)/main.cpp \
    $(SRC_DIR)/Genetic.cpp \
    $(SRC_DIR)/Individual.cpp \
    $(SRC_DIR)/LocalSearch.cpp \
    $(SRC_DIR)/Params.cpp \
    $(SRC_DIR)/Population.cpp \
    $(SRC_DIR)/Split.cpp \
    $(SRC_DIR)/InstanceCVRPLIB.cpp \
    $(SRC_DIR)/AlgorithmParameters.cpp

EXEC = $(BIN_DIR)/hgs

.PHONY: all clean

all: $(EXEC)

$(EXEC): $(SRC_FILES)
	mkdir -p $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) $^ -o $@

clean:
	rm -rf $(BIN_DIR)
