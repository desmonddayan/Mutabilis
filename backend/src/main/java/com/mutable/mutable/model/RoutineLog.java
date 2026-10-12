package com.mutable.mutable.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "routine_log")
@Getter
@Setter
@NoArgsConstructor

public class RoutineLog{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID routineId;
    private String productName;
    private String userId;
    private String routineName;
    private String routineTime;
    private String productId;
    private Integer stepOrder;
}
