package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, String> {

}
