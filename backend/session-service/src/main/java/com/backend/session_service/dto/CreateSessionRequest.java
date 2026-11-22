package com.backend.session_service.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateSessionRequest {
    @NotNull
    private UUID requestId;
    @NotNull
    private UUID senderId;
    @NotNull
    private UUID receiverId;
    @NotNull
    private String skillName;

    // Getters and Setters (Lombok could be used, but explicit for clarity)
    public UUID getRequestId() { return requestId; }
    public void setRequestId(UUID requestId) { this.requestId = requestId; }
    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
}
