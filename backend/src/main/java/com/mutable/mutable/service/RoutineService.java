package com.mutable.mutable.service;

import com.mutable.mutable.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;



}
