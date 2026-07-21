package com.mutable.mutable.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_log")
@Getter
@Setter

@NoArgsConstructor
public class UserLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String userId;
    private String email;
    private String name;
    private String avatarURL;
    private LocalDateTime createdAt;
}