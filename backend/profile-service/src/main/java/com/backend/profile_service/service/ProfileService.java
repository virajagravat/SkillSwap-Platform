package com.backend.profile_service.service;

import com.backend.profile_service.entity.Profile;
import com.backend.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.backend.profile_service.exception.ProfileNotFoundException;
import java.util.List;
import com.backend.profile_service.dto.ProfileResponse;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    //Search Profile by id
    public ProfileResponse getProfileById(Long id) {

        Profile profile = profileRepository.findById(id)
                .orElseThrow(() ->
                        new ProfileNotFoundException(
                                "Profile not found with id: " + id));

        return mapToResponse(profile);
    }

    //Get All Profile
    public List<ProfileResponse> getAllProfile() {
        return profileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //Create Profile
    public ProfileResponse createProfile(Profile profile){
        Profile savedProfile = profileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    //Update Profile
    public ProfileResponse updateProfile(Long id, String name, String profilePhoto){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profile.setName(name);
        profile.setProfilePhoto(profilePhoto);

        Profile savedProfile = profileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    public void deleteProfile(Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profileRepository.delete(profile);
    }

    private ProfileResponse mapToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();

        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setName(profile.getName());
        response.setProfilePhoto(profile.getProfilePhoto());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());

        return response;
    }


}
