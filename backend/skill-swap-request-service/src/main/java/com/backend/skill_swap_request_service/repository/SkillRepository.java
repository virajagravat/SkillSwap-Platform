package com.backend.skill_swap_request_service.repository;

import com.backend.skill_swap_request_service.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing Skill entities.
 */
@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    // JpaRepository already provides existsById, findAll, etc.
}
