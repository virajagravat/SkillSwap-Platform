package com.backend.auth_service.repository;
import com.backend.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long>
{
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"role", "accountStatus"})
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    boolean existsByGoogleId(String googleId);

}