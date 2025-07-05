package com.cd.car_dealership.service;

import com.cd.car_dealership.dto.LoginRequest;
import com.cd.car_dealership.dto.LoginResponse;
import com.cd.car_dealership.model.User;
import com.cd.car_dealership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Simple in-memory token storage (in production use Redis or JWT)
    private static final Map<String, String> tokenToUsername = new HashMap<>();
    private static final Map<String, String> usernameToToken = new HashMap<>();
    
    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                // Generate token
                String token = UUID.randomUUID().toString();
                
                // Store token mappings
                tokenToUsername.put(token, user.getUsername());
                usernameToToken.put(user.getUsername(), token);
                
                return new LoginResponse(token, user.getUsername(), user.getRole());
            }
        }
        
        return new LoginResponse("Invalid username or password");
    }
    
    public boolean isValidToken(String token) {
        return tokenToUsername.containsKey(token);
    }
    
    public String getUsernameFromToken(String token) {
        return tokenToUsername.get(token);
    }
    
    public boolean isAdmin(String token) {
        String username = getUsernameFromToken(token);
        if (username != null) {
            Optional<User> user = userRepository.findByUsername(username);
            return user.isPresent() && "ADMIN".equals(user.get().getRole());
        }
        return false;
    }
    
    public void logout(String token) {
        String username = tokenToUsername.remove(token);
        if (username != null) {
            usernameToToken.remove(username);
        }
    }
} 