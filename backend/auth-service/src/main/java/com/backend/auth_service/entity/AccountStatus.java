package com.backend.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "account_statuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AccountStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false,unique = true,length = 50)
    private String name;

    @Column(length = 255)
    private String description;
}
