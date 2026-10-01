package com.mutable.mutable.controller;

import com.mutable.mutable.model.UserLog;
import com.mutable.mutable.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserLogController {

    @Autowired
    private UserService userService;

    @PostMapping("/me")
    public ResponseEntity<Void> createUserEntry(@AuthenticationPrincipal Jwt jwt){

        String userId = jwt.getSubject();
        UserLog userCheck = userService.findByUserId(userId);
        if(userCheck == null){
            String email = jwt.getClaimAsString("email");
            Map<String,Object> userMetaData = jwt.getClaim("user_metadata");
            String name = null;
            String avatarURL = null;

            if (userMetaData != null){
                name = (String) userMetaData.get("name");
                avatarURL = (String) userMetaData.get("avatar_url");
            }
            userService.createEntry(userId, email, name, avatarURL);
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(400).body(null);
        }
    }
}

