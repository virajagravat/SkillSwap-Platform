package com.backend.profile_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String profilePhoto;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
