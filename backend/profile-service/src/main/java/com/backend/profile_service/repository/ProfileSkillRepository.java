package com.backend.profile_service.repository;

import com.backend.profile_service.entity.ProfileSkill;
import com.backend.profile_service.entity.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileSkillRepository extends JpaRepository<ProfileSkill,Long> {

    boolean existsByProfileIdAndSkillIdAndSkillType(
            Long profileId,
            Long skillId,
            SkillType skillType
    );

    List<ProfileSkill> findByProfileId(Long profileId);

    void deleteByProfileIdAndSkillId(Long profileId, Long skillId);

    List<ProfileSkill> findBySkillIdAndSkillType(
            Long skillId,
            SkillType skillType
    );

}
