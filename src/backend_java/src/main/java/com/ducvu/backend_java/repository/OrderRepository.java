package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
  List<Order> findByUserId(String userId);
}
