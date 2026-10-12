package com.mutable.mutable.controller;

import com.mutable.mutable.model.RoutineLog;
import com.mutable.mutable.service.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/routine")
public class RoutineLogController {

    @Autowired
    private RoutineService routineService;

    @PostMapping("/add")
    public ResponseEntity<RoutineLog> addRoutine(@RequestParam List<String> productArray,
                                                 @RequestParam String routineName,
                                                 @RequestParam String routineTime,
                                                 @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        routineService.createRoutineEntry(productArray, userId, routineName, routineTime);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get")
    public ResponseEntity<List<RoutineLog>> getRoutines(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<RoutineLog> response = routineService.getRoutinesByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateRoutine(@RequestParam List<String> editedProductArray,
                                                @RequestParam UUID routineId,
                                                @RequestParam String routineName,
                                                @RequestParam String routineTime,
                                                @AuthenticationPrincipal Jwt jwt) {
        boolean updated = routineService.updateRoutineEntry(routineId, editedProductArray, routineName, routineTime, jwt.getSubject());
        return updated ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
