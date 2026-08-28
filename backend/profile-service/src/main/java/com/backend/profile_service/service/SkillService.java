package com.backend.profile_service.service;

import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.repository.SkillRepository;
import org.springframework.stereotype.Service;
import com.backend.profile_service.dto.CreateSkillRequest;
import com.backend.profile_service.exception.SkillAlreadyExistsException;



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
}

