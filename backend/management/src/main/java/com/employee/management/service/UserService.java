
package com.employee.management.service;

import com.employee.management.dto.ChangePasswordRequest;
import com.employee.management.model.User;
import com.employee.management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    public void changePassword(
            String email, ChangePasswordRequest request) {

        User user = getProfile(email);

        if (request.getCurrentPassword() == null
                || !passwordEncoder.matches(
                        request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 8) {
            throw new RuntimeException(
                    "New password must contain at least 8 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
