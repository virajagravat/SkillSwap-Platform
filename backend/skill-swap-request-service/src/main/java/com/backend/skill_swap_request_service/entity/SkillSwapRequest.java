package com.backend.skill_swap_request_service.entity;

import com.backend.skill_swap_request_service.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.*;
import java.util.UUID;
@Entity
@Table(name = "skill_swap_requests")
@Data                         // getters, setters, toString, equals, hashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillSwapRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /** User who **sent** the request – taken from the JWT principal */
    @Column(name = "sender_id", nullable = false, columnDefinition = "uuid")
    private UUID senderId;
    /** User who will **receive** the request */
    @Column(name = "receiver_id", nullable = false, columnDefinition = "uuid")
    private UUID receiverId;
    /** Skill that is being requested */
    @Column(name = "skill_id", nullable = false, columnDefinition = "uuid")
    private UUID skillId;
    /** Optional free‑form message from the requester */
    @Column(length = 500)
    private String message;
    /** First date the requester proposed */
    private LocalDate requestedDate;
    /** First start‑time the requester proposed */
    private LocalTime requestedStartTime;
    /** First end‑time (or derived from duration) */
    private LocalTime requestedEndTime;
    /** Latest date proposed during negotiation */
    private LocalDate proposedDate;
    /** Latest start‑time proposed */
    private LocalTime proposedStartTime;
    /** Latest end‑time proposed */
    private LocalTime proposedEndTime;
    /** Current workflow status – stored as plain VARCHAR */
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;
    /** When the row was first inserted */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
    /** Updated automatically on every UPDATE (Hibernate fills it) */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}