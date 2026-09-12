package com.mutable.mutable.controller;

import com.mutable.mutable.model.RoutineLog;
import com.mutable.mutable.service.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/routines")
public class RoutineLogController {

    @Autowired
    private RoutineService routineService;

    @PostMapping("/add")
    public ResponseEntity<RoutineLog> addRoutine(@RequestBody RoutineLog routineLog) {

    }


}
