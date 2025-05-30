package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Depot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepotRepository extends JpaRepository<Depot, String> {

}
