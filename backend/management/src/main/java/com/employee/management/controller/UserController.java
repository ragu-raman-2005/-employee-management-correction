
package com.employee.management.controller;

import com.employee.management.dto.ChangePasswordRequest;
import com.employee.management.model.User;
import com.employee.management.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile(
            Authentication authentication) {

        User user = userService.getProfile(authentication.getName());

        Map<String, String> profile = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
        );

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(
                authentication.getName(), request);

        return ResponseEntity.ok(
                Map.of("message", "Password changed successfully"));
    }
}
