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

    public UserLog findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    public void createEntry(String userId, String email, String avatarURL, String name) {
        UserLog userLog = new UserLog();
        userLog.setUserId(userId);
        userLog.setName(name);
        userLog.setEmail(email);
        userLog.setAvatarURL(avatarURL);
        userLog.setCreatedAt(LocalDateTime.now());
        userRepository.save(userLog);
    }
}