
package com.employee.management.service;

import com.employee.management.dto.AuthResponse;
import com.employee.management.dto.LoginRequest;
import com.employee.management.dto.RegisterRequest;
import com.employee.management.model.User;
import com.employee.management.repository.UserRepository;
import com.employee.management.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8) {
            throw new RuntimeException(
                    "Name, valid email and password of at least 8 characters are required");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword())
        );

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return createResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail() == null
                ? "" : request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return createResponse(token, user);
    }

    private AuthResponse createResponse(String token, User user) {

        AuthResponse.UserInfo userInfo =
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        return new AuthResponse(token, userInfo);
    }
}
