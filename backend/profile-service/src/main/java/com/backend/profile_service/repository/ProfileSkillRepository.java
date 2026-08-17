package com.backend.profile_service.repository;

import com.backend.profile_service.entity.ProfileSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileSkillRepository extends JpaRepository<ProfileSkill,Long> {
}
