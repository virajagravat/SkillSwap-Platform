package com.backend.profile_service.repository;

import com.backend.profile_service.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {
    List<Skill> findByNameContainingIgnoreCase(String name);
}
