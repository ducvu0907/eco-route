package com.ducvu.backend_java.controller;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
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
  private final FirebaseDatabase firebaseDatabase;

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
    final DatabaseReference db = firebaseDatabase.getReference();
    db.child("test").updateChildrenAsync(Collections.singletonMap("message", message));
    return "firebase";
  }

}
