package com.backend.profile_service.service;

import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.exception.SkillNotFoundException;
import com.backend.profile_service.repository.SkillRepository;
import org.springframework.stereotype.Service;
import com.backend.profile_service.dto.CreateSkillRequest;
import com.backend.profile_service.exception.SkillAlreadyExistsException;
import com.backend.profile_service.entity.ProfileSkill;
import com.backend.profile_service.entity.SkillType;
import com.backend.profile_service.repository.ProfileSkillRepository;



import java.util.List;

@Service
public class SkillService {
    private final SkillRepository skillRepository;
    private final ProfileSkillRepository profileSkillRepository;

    public SkillService(SkillRepository skillRepository,ProfileSkillRepository profileSkillRepository) {
        this.skillRepository = skillRepository;
        this.profileSkillRepository = profileSkillRepository;
    }

    public  List<Skill> searchSkills(String query) {
        return skillRepository.findByNameContainingIgnoreCase(query);
    }

    public Skill createSkill(CreateSkillRequest request) {

        skillRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(skill -> {
                    throw new SkillAlreadyExistsException(
                            "Skill already exists with name: " + request.getName()
                    );
                });

        Skill skill = new Skill();

        skill.setName(request.getName());

        return skillRepository.save(skill);
    }

    public List<ProfileSkill> getProfilesBySkill(
            Long skillId,
            SkillType skillType) {

        skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new SkillNotFoundException(
                                "Skill not found with id: " + skillId
                        ));

        return profileSkillRepository.findBySkillIdAndSkillType(
                skillId,
                skillType
        );
    }
}

