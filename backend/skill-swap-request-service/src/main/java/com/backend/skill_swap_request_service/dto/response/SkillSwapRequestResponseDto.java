package com.backend.skill_swap_request_service.dto.response;

import com.backend.skill_swap_request_service.enums.RequestStatus;
import lombok.Data;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * DTO returned to clients representing a skill‑swap request.
 */
@Data
public class SkillSwapRequestResponseDto {
    private Long id;
    private UUID senderId;
    private UUID receiverId;
    private UUID skillId;
    private RequestStatus status;
    private LocalDate requestedDate;
    private LocalTime requestedStartTime;
    private LocalTime requestedEndTime;
    private String message;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
