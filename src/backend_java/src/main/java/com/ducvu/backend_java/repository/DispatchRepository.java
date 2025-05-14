package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, String> {
  @NativeQuery("SELECT * FROM dispatches WHERE status = 'IN_PROGRESS' LIMIT 1")
  Optional<Dispatch> findActiveDispatch();
}
