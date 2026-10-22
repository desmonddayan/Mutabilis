package com.mutable.mutable.repository;

import com.mutable.mutable.model.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<ChatLog, UUID> {
    List<ChatLog> findTop6ByUserIdOrderByCreatedAtDesc(String userId);
}
