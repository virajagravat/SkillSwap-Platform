package com.backend.browse_skill_service.service;


import com.backend.browse_skill_service.client.ProfileServiceClient;
import com.backend.browse_skill_service.dto.BrowseSkillSearchResponse;
import com.backend.browse_skill_service.dto.PagedBrowseSkillResponse;
import com.backend.browse_skill_service.dto.ProfileSkillResponse;
import com.backend.browse_skill_service.dto.SkillResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BrowseSkillService {
    private final ProfileServiceClient profileServiceClient;

    public PagedBrowseSkillResponse searchSkills(String name,int page, int size) {

        List<SkillResponse> skills =
                profileServiceClient.searchSkills(name);

        List<BrowseSkillSearchResponse> results =
                new ArrayList<>();

        for (SkillResponse skill : skills) {

            List<ProfileSkillResponse> profileSkills =
                    profileServiceClient.getProfilesBySkill(
                            skill.getId(),
                            "TEACH"
                    );

            for (ProfileSkillResponse profileSkill : profileSkills) {

                BrowseSkillSearchResponse response =
                        new BrowseSkillSearchResponse();

                response.setUserId(
                        profileSkill.getProfile().getUserId()
                );

                response.setName(
                        profileSkill.getProfile().getName()
                );

                response.setProfilePhoto(
                        profileSkill.getProfile().getProfilePhoto()
                );

                response.setSkillId(
                        profileSkill.getSkill().getId()
                );

                response.setSkillName(
                        profileSkill.getSkill().getName()
                );

                response.setSkillType(
                        profileSkill.getSkillType()
                );

                results.add(response);
            }
        }

        int totalElements = results.size();

        int start = page * size;
        int end = Math.min(start + size, totalElements);

        List<BrowseSkillSearchResponse> pagedResults;

        if (start >= totalElements) {
            pagedResults = List.of();
        } else {
            pagedResults = results.subList(start, end);
        }

        int totalPages =
                (int) Math.ceil((double) totalElements / size);

        return new PagedBrowseSkillResponse(
                pagedResults,
                page,
                size,
                totalElements,
                totalPages
        );

    }
}
