package com.backend.profile_service.service;

import com.backend.profile_service.entity.Profile;
import com.backend.profile_service.entity.ProfileSkill;
import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.entity.SkillType;
import com.backend.profile_service.repository.ProfileRepository;
import com.backend.profile_service.repository.ProfileSkillRepository;
import com.backend.profile_service.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.profile_service.exception.ProfileNotFoundException;
import com.backend.profile_service.exception.SkillNotFoundException;
import com.backend.profile_service.exception.SkillAlreadyExistsException;
import com.backend.profile_service.exception.SkillNotAssociatedException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileSkillService {

    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProfileSkillRepository profileSkillRepository;


    public ProfileSkill addSkillToProfile(
            Long profileId,
            Long skillId,
            SkillType skillType) {

        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Profile not found with id: " + profileId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new SkillNotFoundException("Skill not found with id: " + skillId));

        boolean exists = profileSkillRepository
                .existsByProfileIdAndSkillIdAndSkillType(
                        profileId,
                        skillId,
                        skillType
                );

        if (exists) {
            throw new SkillAlreadyExistsException(
                    "Skill already exists for this profile with type: " + skillType
            );
        }

        ProfileSkill profileSkill = new ProfileSkill();

        profileSkill.setProfile(profile);
        profileSkill.setSkill(skill);
        profileSkill.setSkillType(skillType);

        return profileSkillRepository.save(profileSkill);
    }

    public List<ProfileSkill> getProfileSkills(Long profileId) {
        profileRepository.findById(profileId)
                .orElseThrow(() ->
                        new RuntimeException("Profile not found with id: " + profileId));

        return profileSkillRepository.findByProfileId(profileId);
    }

    @Transactional
    public void removeSkillFromProfile(Long profileId, Long skillId) {

        profileRepository.findById(profileId)
                .orElseThrow(() ->
                        new RuntimeException("Profile not found with id: " + profileId));

        skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new RuntimeException("Skill not found with id: " + skillId));

        boolean exists = profileSkillRepository
                .existsByProfileIdAndSkillIdAndSkillType(
                        profileId,
                        skillId,
                        SkillType.TEACH
                );

        if (!exists) {
            exists = profileSkillRepository
                    .existsByProfileIdAndSkillIdAndSkillType(
                            profileId,
                            skillId,
                            SkillType.LEARN
                    );
        }

        if (!exists) {
            throw new SkillNotAssociatedException(
                    "Skill is not associated with this profile"
            );
        }

        profileSkillRepository.deleteByProfileIdAndSkillId(
                profileId,
                skillId
        );
    }
}
