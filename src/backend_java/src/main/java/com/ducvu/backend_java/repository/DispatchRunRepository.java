package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.DispatchRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchRunRepository extends JpaRepository<DispatchRun, String> {

}
