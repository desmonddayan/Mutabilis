package com.mutable.mutable.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "product_log")
@Getter
@Setter
@ToString
@NoArgsConstructor

public class ProductLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String productName;

    private String brand;

    private String productCategory;

    private boolean fragranceFree;

    @Column(columnDefinition = "TEXT")
    private String keyIngredients;
    @Column(columnDefinition = "TEXT")
    private boolean comedogenic;
    @Column(columnDefinition = "TEXT")
    private String coreCloggingIngredients;
    @Column(columnDefinition = "TEXT")
    private String optimalStorageEnvironment;
    @Column(columnDefinition = "TEXT")
    private String skinTypeSuitability;
    @Column(columnDefinition = "TEXT")
    private String recommendedUsageFrequency;
    @Column(columnDefinition = "TEXT")
    private boolean purging;
    @Column(columnDefinition = "TEXT")
    private String purgingPeriod;
    @Column(columnDefinition = "TEXT")
    private String weatherCompatability;
    @Column(columnDefinition = "TEXT")
    private String sunCompatability;
    @Column(columnDefinition = "TEXT")
    private String suitableCombinationIngredients;
    @Column(columnDefinition = "TEXT")
    private String poorCombinationIngredients;
    @Column(columnDefinition = "TEXT")
    private String compatabilityWithPregnancyAndBreastFeeding;
    @Column(columnDefinition = "TEXT")
    private String additionalNotes;
}
