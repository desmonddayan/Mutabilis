package com.mutable.mutable.controller;

import com.mutable.mutable.model.UserLog;
import com.mutable.mutable.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserLogController {

    @Autowired
    private UserService userService;

    @PostMapping("/me")
    public ResponseEntity<UserLog> createUserEntry(@RequestBody UserLog userLog, @AuthenticationPrincipal Jwt jwt){

        String userId = jwt.getSubject();
        UserLog userCheck = userService.findByUserId(userId);
        if(userCheck == null){
            UserLog saved = userService.createEntry(userLog, userId);
            return ResponseEntity.status(200).body(saved);
        }
        else {
            return ResponseEntity.status(400).body(null);
        }
    }
}

