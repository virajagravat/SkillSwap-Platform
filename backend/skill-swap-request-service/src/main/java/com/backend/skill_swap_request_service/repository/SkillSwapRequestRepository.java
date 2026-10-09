package com.backend.skill_swap_request_service.repository;

import com.backend.skill_swap_request_service.entity.SkillSwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.backend.skill_swap_request_service.enums.RequestStatus;
/**
 * Basic CRUD + two convenience finder methods.
 * Hibernate will generate the underlying SQL automatically.
 */
@Repository
public interface SkillSwapRequestRepository
        extends JpaRepository<SkillSwapRequest, Long> {
    /** All requests where the given user is the receiver */
    List<SkillSwapRequest> findByReceiverId(Long receiverId);

    /** All requests where the given user is the sender */
    List<SkillSwapRequest> findBySenderId(Long senderId);

    /** Check for duplicate active request */
    boolean existsBySenderIdAndReceiverIdAndSkillIdAndStatusIn(
            Long senderId,
            Long receiverId,
            Long skillId,
            List<RequestStatus> statuses
    );
}
