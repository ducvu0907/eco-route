package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {

}
