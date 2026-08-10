package com.backend.auth_service.repository;
import com.backend.auth_service.entity.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountStatusRepository extends JpaRepository<AccountStatus,Long>{
    Optional<AccountStatus> findByName(String Name);
    boolean existsByName(String name);

}