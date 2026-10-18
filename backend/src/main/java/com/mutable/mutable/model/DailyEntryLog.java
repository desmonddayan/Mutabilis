package com.mutable.mutable.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "dailyentry_log", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "entry_date"}))
@Getter
@Setter
@ToString
@NoArgsConstructor


public class DailyEntryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String userId;
    private LocalDate entryDate;
    private List<String> routineIds;

    @Column(columnDefinition = "TEXT")
    private String diaryEntry;

    private Integer waterCount;
    private String waterUnitState;
    private String stressCount;
    private Integer sleepCount;

    private String leftFacePhotoPath;
    private String middlePhotoPath;
    private String rightFacePhotoPath;

    private Integer acneSeverity;
    private Integer redness;
    private Integer texture;
    private Integer oiliness;
    private Integer dryness;
    private Integer scars;
    private Integer lesionEstimate;
    @Column(columnDefinition = "TEXT")
    private String geminiAnalysisNotes;
}
