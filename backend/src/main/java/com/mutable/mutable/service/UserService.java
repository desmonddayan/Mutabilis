package com.mutable.mutable.service;

import com.mutable.mutable.model.UserLog;
import com.mutable.mutable.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService{

    @Autowired
    private UserRepository userRepository;

    public UserLog createEntry(UserLog userLog, String userId){
        userLog.setUserId(userId);
        userLog.setCreatedAt(LocalDateTime.now());
        return userRepository.save(userLog);
    }
}