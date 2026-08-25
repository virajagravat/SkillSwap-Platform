package com.backend.profile_service.controller;


import com.backend.profile_service.dto.ProfileResponse;
import com.backend.profile_service.entity.Profile;
import com.backend.profile_service.service.ProfileService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    //Search All Record
    @GetMapping
    public List<ProfileResponse> getAllProfiles(){
        return profileService.getAllProfile();
    }

    //search Record by Id
    @GetMapping("/{id}")
    public ProfileResponse getProfileById(@PathVariable Long id){
        return profileService.getProfileById(id);
    }

    //Create profile
    @PostMapping
    public ProfileResponse createProfile(@RequestBody Profile profile) {
        return profileService.createProfile(profile);
    }


    //update profile
    @PutMapping("/{id}")
    public ProfileResponse updateProfile(
            @PathVariable Long id,
            @RequestBody Profile profile) {

        return profileService.updateProfile(
                id,
                profile.getName(),
                profile.getProfilePhoto()
        );
    }

    //Delete profile
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {

        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }




}
