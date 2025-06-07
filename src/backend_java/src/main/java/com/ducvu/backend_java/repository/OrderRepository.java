package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
  @NativeQuery("SELECT * FROM orders o WHERE o.user_id = :user_id ORDER BY o.created_at ASC")
  List<Order> findByUserId(@Param("user_id") String userId);

  @NativeQuery("SELECT * FROM orders o WHERE o.status = 'IN_PROGRESS' ORDER BY o.created_at ASC")
  List<Order> findAllInProgressOrdersSorted();

  @NativeQuery("SELECT * FROM orders o WHERE o.status = 'PENDING' ORDER BY o.created_at ASC")
  List<Order> findAllPendingOrdersSorted();

  @NativeQuery("SELECT * FROM orders o ORDER BY o.created_at ASC")
  List<Order> findAllOrdersSorted();

  @NativeQuery("SELECT * FROM orders o WHERE o.status = 'PENDING' OR o.status = 'REASSIGNMENT_PENDING' ORDER BY o.created_at ASC")
  List<Order> findAllPendingOrdersAndReassignmentPendingSorted();
}
