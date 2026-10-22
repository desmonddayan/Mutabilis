package com.mutable.mutable.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chat_log")
@Getter
@Setter
@ToString
@NoArgsConstructor

public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String userId;
    private UUID conversationId;
    private String role;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Instant createdAt;
}
