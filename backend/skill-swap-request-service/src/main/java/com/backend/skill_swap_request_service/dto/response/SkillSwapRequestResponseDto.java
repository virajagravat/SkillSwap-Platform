package com.backend.skill_swap_request_service.dto.response;

import com.backend.skill_swap_request_service.enums.RequestStatus;
import lombok.Data;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO returned to clients representing a skill‑swap request.
 * Includes optional message from the requester and an optional reject reason.
 */
@Data
public class SkillSwapRequestResponseDto {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private Long skillId;
    private RequestStatus status;
    private LocalDate requestedDate;
    private LocalTime requestedStartTime;
    private LocalTime requestedEndTime;
    /** Optional free‑form message from the requester. */
    private String message;
    /** Optional reason supplied when the receiver rejects the request. */
    private String rejectReason;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
