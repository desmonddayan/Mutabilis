package com.mutable.mutable.service;

import com.mutable.mutable.dto.ChatHistory;
import com.mutable.mutable.dto.ChatRecord;
import com.mutable.mutable.model.ChatLog;
import com.mutable.mutable.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ClaudeChatService claudeChatService;

    public String handleUserRequest(ChatRecord chatRecord,  String userId) {
        return claudeChatService.handleResponse(chatRecord, userId);
    }
    public List<ChatHistory> handleChatHistory(String userId) {
        List<ChatLog> recent = chatRepository.findTop6ByUserIdOrderByCreatedAtDesc(userId);
        return recent.reversed().stream()
                .map(m -> new ChatHistory(m.getRole(), m.getMessage()))
                .toList();
    }
}
