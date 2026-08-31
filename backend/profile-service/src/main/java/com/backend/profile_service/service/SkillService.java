package com.backend.profile_service.service;

import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.repository.SkillRepository;
import org.springframework.stereotype.Service;
import com.backend.profile_service.dto.CreateSkillRequest;
import java.util.List;

@Service
public class SkillService {
    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public  List<Skill> searchSkills(String query) {
        return skillRepository.findByNameContainingIgnoreCase(query);
    }

    public Skill createSkill(CreateSkillRequest request) {

        return skillRepository.findByNameIgnoreCase(request.getName())
                .orElseGet(() -> {
                    Skill skill = new Skill();

                    skill.setName(request.getName().trim());

                    return skillRepository.save(skill);
                });
    }
}

