package com.backend.profile_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id", nullable = false , unique = true)
    private long userId;

    @Column(nullable = false)
    private String name;

    @Column(name="profile_photo")
    private String profilePhoto;

    @Column(name = "created_at" , nullable = false)
    private LocalDateTime createAt;

    @Column(name="update_at" , nullable = false)
    private LocalDateTime updateAt;


    @PrePersist
    protected void onCreate(){
        createAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        updateAt = LocalDateTime.now();
    }

}
