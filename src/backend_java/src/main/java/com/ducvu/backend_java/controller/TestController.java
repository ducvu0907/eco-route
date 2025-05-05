package com.ducvu.backend_java.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@SecurityRequirement(name = "bearerAuth")
public class TestController {

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

}
