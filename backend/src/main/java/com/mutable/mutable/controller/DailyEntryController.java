package com.mutable.mutable.controller;

import com.mutable.mutable.dto.EntryRequest;
import com.mutable.mutable.service.DailyEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dailyEntry")
public class DailyEntryController {

    @Autowired
    private DailyEntryService dailyEntryService;

    @PostMapping("/add")
    public ResponseEntity<String> addDailyEntry(@RequestBody EntryRequest entryRequest, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        dailyEntryService.handleGeminiAnalysis(entryRequest, userId);
        return ResponseEntity.ok().build();
    }
}
