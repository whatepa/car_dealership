package com.cd.car_dealership.service;

import com.cd.car_dealership.dto.LoginRequest;
import com.cd.car_dealership.dto.LoginResponse;
import com.cd.car_dealership.model.User;
import com.cd.car_dealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    
    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                String token = jwtService.generateToken(
                        user.getUsername(),
                        java.util.Map.of("role", user.getRole())
                );
                return LoginResponse.builder()
                        .token(token)
                        .username(user.getUsername())
                        .role(user.getRole())
                        .build();
            }
        }
        
        return LoginResponse.builder()
                .message("Invalid username or password")
                .build();
    }
    
    public boolean isValidToken(String token) {
        return jwtService.isTokenValid(token);
    }
    
    public String getUsernameFromToken(String token) {
        return jwtService.extractUsername(token);
    }
    
    public boolean isAdmin(String token) {
        String role = jwtService.extractRole(token);
        return "ADMIN".equals(role);
    }
    
    public void logout(String token) {
        // With JWT, logout is stateless. No server-side action needed.
    }
} 