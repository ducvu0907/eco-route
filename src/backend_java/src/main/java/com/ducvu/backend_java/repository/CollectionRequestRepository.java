package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.CollectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionRequestRepository extends JpaRepository<CollectionRequest, String> {

}
