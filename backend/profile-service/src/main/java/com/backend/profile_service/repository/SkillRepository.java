package com.backend.profile_service.repository;

import com.backend.profile_service.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {
    List<Skill> findByNameContainingIgnoreCase(String name);
    Optional<Skill> findByNameIgnoreCase(String name);
}
