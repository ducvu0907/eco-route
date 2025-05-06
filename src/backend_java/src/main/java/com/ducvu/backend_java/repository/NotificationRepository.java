package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
  List<Notification> findByUserId(String userId);
}
