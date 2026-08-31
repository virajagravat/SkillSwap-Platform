package com.backend.profile_service.controller;

import com.backend.profile_service.dto.CreateProfileRequest;
import com.backend.profile_service.dto.ProfileResponse;
import com.backend.profile_service.dto.UpdateProfileRequest;
import com.backend.profile_service.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    // Search All Record
    @GetMapping
    public List<ProfileResponse> getAllProfiles(){
        return profileService.getAllProfile();
    }

    // Search Record by Id
    @GetMapping("/{id}")
    public ProfileResponse getProfileById(@PathVariable Long id){
        return profileService.getProfileById(id);
    }

    // Search Record by UserId
    @GetMapping("/user/{userId}")
    public ProfileResponse getProfileByUserId(@PathVariable Long userId){
        return profileService.getProfileByUserId(userId);
    }

    // Create profile
    @PostMapping
    public ProfileResponse createProfile(
            @Valid @RequestBody CreateProfileRequest request) {

        return profileService.createProfile(request);
    }

    // Update profile
    @PutMapping("/{id}")
    public ProfileResponse updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {

        return profileService.updateProfile(id, request);
    }

    // Delete profile
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
            value = "/{id}/photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ProfileResponse uploadProfilePhoto(
            @PathVariable Long id,
            @RequestPart("photo") MultipartFile photo) throws IOException {

        return profileService.uploadProfilePhoto(id, photo);
    }
}
