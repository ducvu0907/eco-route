package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<Node, String> {

}
