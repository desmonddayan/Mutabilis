package com.mutable.mutable.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "photoScore_log")
@Getter
@Setter
@NoArgsConstructor
@ToString

public class PhotoScoreLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String slot;
    private String userId;
    private LocalDate entryDate;
    private UUID dailyEntryId;

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
