package com.backend.browse_skill_service.client;


import com.backend.browse_skill_service.dto.ProfileSkillResponse;
import com.backend.browse_skill_service.dto.SkillResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProfileServiceClient {
    private final RestClient restClient;

    private static final String PROFILE_SERVICE_URL =
            "http://localhost:8087";

    public List<ProfileSkillResponse> getProfilesBySkill(
            Long skillId,
            String skillType) {

        return restClient.get()
                .uri(PROFILE_SERVICE_URL
                                + "/api/skills/{skillId}/profiles?skillType={skillType}",
                        skillId,
                        skillType)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public List<SkillResponse> searchSkills(String name) {

        return restClient.get()
                .uri(PROFILE_SERVICE_URL
                                + "/api/skills/search?name={name}",
                        name)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
