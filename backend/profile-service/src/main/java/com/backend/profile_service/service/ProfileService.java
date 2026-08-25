package com.backend.profile_service.service;

import com.backend.profile_service.entity.Profile;
import com.backend.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.backend.profile_service.exception.ProfileNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    //Search Profile by id
    public Profile getProfileById(Long id){
        return profileRepository.findById(id)
                .orElseThrow(()-> new ProfileNotFoundException("Profile not found with id: " + id ));
    }

    //Get All Profile
    public List<Profile> getAllProfile(){
        return profileRepository.findAll();
    }

    //Create Profile
    public Profile createProfile(Profile profile){
        return profileRepository.save(profile);
    }

    //Update Profile
    public Profile updateProfile(Long id, String name, String profilePhoto){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profile.setName(name);
        profile.setProfilePhoto(profilePhoto);

        return profileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profileRepository.delete(profile);
    }


}
