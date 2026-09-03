package com.backend.browse_skill_service.client;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class ProfileServiceClient {
    private final RestClient restClient;

    private static final String PROFILE_SERVICE_URL =
            "http://localhost:8087";

    public String getProfilesBySkill(
            Long skillId,
            String skillType) {

        return restClient.get()
                .uri(PROFILE_SERVICE_URL
                                + "/api/skills/{skillId}/profiles?skillType={skillType}",
                        skillId,
                        skillType)
                .retrieve()
                .body(String.class);
    }

    public String searchSkills(String name) {

        return restClient.get()
                .uri(PROFILE_SERVICE_URL
                                + "/api/skills/search?name={name}",
                        name)
                .retrieve()
                .body(String.class);
    }
}
