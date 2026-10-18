package com.mutable.mutable.dto;

import java.time.LocalDate;
import java.util.List;

public record EntryRequest(LocalDate entryDate, String diaryEntry, List<String> routineIds, Integer waterCount, String waterUnitState, String stressCount, Integer sleepCount, String leftFacePhotoPath, String middleFacePhotoPath, String rightFacePhotoPath){}
