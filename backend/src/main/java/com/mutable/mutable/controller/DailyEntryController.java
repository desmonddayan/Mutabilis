package com.mutable.mutable.controller;

import com.mutable.mutable.RateLimiter;
import com.mutable.mutable.dto.EntryRequest;
import com.mutable.mutable.dto.TrackPhoto;
import com.mutable.mutable.model.DailyEntryLog;
import com.mutable.mutable.service.DailyEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dailyEntry")
public class DailyEntryController {

    @Autowired
    private DailyEntryService dailyEntryService;
    @Autowired
    private RateLimiter rateLimiter;

    @PostMapping("/add")
    public ResponseEntity<String> addDailyEntry(@RequestBody EntryRequest entryRequest, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        if (!rateLimiter.tryConsume("chat:" + userId, 10, Duration.ofHours(1))) {
            return ResponseEntity.status(429).body("Too many requests. Please try again later.");
        }
        dailyEntryService.handleGeminiAnalysis(entryRequest, userId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/get")
    public ResponseEntity<DailyEntryLog> getDailyEntry(@RequestParam LocalDate date, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        DailyEntryLog entry = dailyEntryService.handleEntryFind(userId, date);
        return ResponseEntity.ok(entry);
    }
    @PutMapping("/update")
    public ResponseEntity<String> updateDailyEntry(@RequestBody EntryRequest entryRequest, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        if (!rateLimiter.tryConsume("chat:" + userId, 10, Duration.ofHours(1))) {
            return ResponseEntity.status(429).body("Too many requests. Please try again later.");
        };
        dailyEntryService.updateDailyEntry(entryRequest, userId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/delete")
    public void deleteDailyEntry(@RequestParam LocalDate date, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        dailyEntryService.handleDailyEntryDelete(date, userId);
    }

    @GetMapping("/getPhotoEntry")
    public ResponseEntity<List<TrackPhoto>> getphotoEntries(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<TrackPhoto> entries = dailyEntryService.handleTrackPageFetch(startDate, endDate, userId);
        return ResponseEntity.ok(entries);
    }
}
