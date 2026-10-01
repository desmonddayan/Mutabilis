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
    private String keyIngredients;
    private boolean comedogenic;
    private String coreCloggingIngredients;
    private String optimalStorageEnvironment;
    private String skinTypeSuitability;
    private String recommendedUsageFrequency;
    private boolean purging;
    private String purgingPeriod;
    private String weatherCompatability;
    private String sunCompatability;
    private String suitableCombinationIngredients;
    private String poorCombinationIngredients;
    private String compatabilityWithPregnancyAndBreastFeeding;
    private String additionalNotes;
}
