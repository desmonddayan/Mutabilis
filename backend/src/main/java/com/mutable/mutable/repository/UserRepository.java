package com.mutable.mutable.repository;

import com.mutable.mutable.model.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserLog, UUID> {
    UserLog findByUserId(String userId);
}