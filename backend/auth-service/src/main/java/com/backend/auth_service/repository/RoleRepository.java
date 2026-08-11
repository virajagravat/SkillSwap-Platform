package com.backend.auth_service.repository;
import com.backend.auth_service.entity.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RoleRepository extends JpaRepository<Role,Long>{
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
}