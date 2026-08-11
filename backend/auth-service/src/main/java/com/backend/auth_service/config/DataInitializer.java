package com.backend.auth_service.config;

import com.backend.auth_service.entity.AccountStatus;
import com.backend.auth_service.entity.Role;
import com.backend.auth_service.repository.AccountStatusRepository;
import com.backend.auth_service.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final RoleRepository roleRepository;
    private final AccountStatusRepository accountStatusRepository;
    @Bean
    CommandLineRunner initializeData(){
        return args -> {

            // =========================
            // Initialize Roles
            // =========================

            if (!roleRepository.existsByName("USER")){
                Role userRole = new Role();
                userRole.setName("USER");
                roleRepository.save(userRole);
            }

            if (!roleRepository.existsByName("ADMIN")){
                Role adminRole= new Role();
                adminRole.setName("ADMIN");

                roleRepository.save(adminRole);
            }

            // =========================
            // Initialize Account Statuses
            // =========================
            createStatus("ACTIVE","User Account is Active");
            createStatus("INACTIVE","User Account is Inactive");
            createStatus("SUSPENDED","User Account has been Suspended");
            createStatus("PENDING","User Account is pending Verification");

        };
    }
    private void createStatus(String name,String description){
        if (!accountStatusRepository.existsByName(name)){
            AccountStatus status = new AccountStatus();
            status.setName(name);
            status.setDescription(description);
            accountStatusRepository.save(status);
        }
    }
}
