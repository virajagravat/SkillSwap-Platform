package com.backend.session_service.repository;

import com.backend.session_service.entity.SessionEntity;
import com.backend.session_service.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, UUID> {
    Optional<SessionEntity> findByRequestId(UUID requestId);

    List<SessionEntity> findBySenderIdOrReceiverId(UUID senderId, UUID receiverId);

    List<SessionEntity> findByStatusAndSessionDateAndStartTimeLessThanEqual(
            SessionStatus status,
            LocalDate sessionDate,
            LocalTime startTime);
}
