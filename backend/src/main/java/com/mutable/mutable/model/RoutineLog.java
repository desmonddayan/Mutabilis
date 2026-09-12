package com.mutable.mutable.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
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

    private String userId;
    private UUID routineId;
    private String nightOrDay;

    @ElementCollection
    @CollectionTable(name = "routine_products", joinColumns = @JoinColumn(name = "routine_id"))
    @OrderColumn(name = "step_order")
    @Column(name = "product_name")
    private List<String> products;
}
