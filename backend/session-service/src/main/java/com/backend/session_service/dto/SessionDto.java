package com.backend.session_service.dto;

import com.backend.session_service.entity.SessionStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class SessionDto {
    private UUID sessionId;
    private UUID requestId;
    private UUID senderId;
    private UUID receiverId;
    private String skillName;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private SessionStatus status;
    private String meetingLink;

    // Getters and Setters
    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }
    public UUID getRequestId() { return requestId; }
    public void setRequestId(UUID requestId) { this.requestId = requestId; }
    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
}
