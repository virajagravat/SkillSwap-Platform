package com.backend.auth_service.dto;

import com.backend.auth_service.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String googleId;
    private String email;
    private String fullName;
    private String profilePicture;
    private String roleName;
    private String accountStatusName;

    /**
     * Convert User entity to UserDTO
     * This avoids LazyInitializationException when
     * serializing the response to JSON
     */
    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .googleId(user.getGoogleId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePicture(user.getProfilePicture())
                .roleName(user.getRole() != null
                        ? user.getRole().getName() : null)
                .accountStatusName(user.getAccountStatus() != null
                        ? user.getAccountStatus().getName() : null)
                .build();
    }
}
