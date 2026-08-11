package com.backend.auth_service.controller;

import com.backend.auth_service.dto.UserDTO;
import com.backend.auth_service.entity.User;
import com.backend.auth_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<UserDTO> getCurrentUser(
            Authentication authentication) {

        // The JWT filter sets the User object as the principal
        // But we also handle the case where getName() returns the email
        String email;

        if (authentication.getPrincipal() instanceof User) {
            email = ((User) authentication.getPrincipal()).getEmail();
        } else {
            email = authentication.getName();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Convert to DTO to avoid LazyInitializationException
        UserDTO userDTO = UserDTO.fromEntity(user);

        return ResponseEntity.ok(userDTO);
    }
}