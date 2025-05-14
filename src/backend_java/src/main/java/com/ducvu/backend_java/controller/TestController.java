package com.ducvu.backend_java.controller;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/test")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class TestController {
  private final DatabaseReference db;
  private final FirebaseMessaging messaging;

  @GetMapping("/driver")
  @PreAuthorize("hasRole('ROLE_DRIVER')")
  public String testDriver() {
    return "hello driver";
  }
  @GetMapping("/customer")
  @PreAuthorize("hasRole('ROLE_CUSTOMER')")
  public String testCustomer() {
    return "hello customer";
  }

  @PostMapping("/firebase")
  public String testFirebase(@RequestBody String message) {
    db.child("test").updateChildrenAsync(Collections.singletonMap("message", message));
    return "firebase";
  }


  @PostMapping("/messaging")
  public String testMessaging(@RequestBody String token) throws FirebaseMessagingException {
    Notification notification = Notification.builder()
        .setTitle("test")
        .setBody("test messaging")
        .build();

    Message message = Message.builder()
        .setToken(token)
        .setNotification(notification)
        .build();

    messaging.sendAsync(message);
    return "firebase";
  }

}
