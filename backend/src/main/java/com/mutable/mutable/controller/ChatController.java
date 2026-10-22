package com.mutable.mutable.controller;

import com.mutable.mutable.dto.ChatHistory;
import com.mutable.mutable.dto.ChatRecord;
import com.mutable.mutable.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/sendMessage")
    public ResponseEntity<String> sendMessage(@RequestBody ChatRecord chatRecord, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        String response = chatService.handleUserRequest(chatRecord, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getChatHistory")
    public ResponseEntity<List<ChatHistory>> getChatHistory(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(chatService.handleChatHistory(userId));
    }
}
