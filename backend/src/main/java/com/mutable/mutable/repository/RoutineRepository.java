package com.mutable.mutable.repository;

import com.mutable.mutable.model.RoutineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoutineRepository extends JpaRepository<RoutineLog, UUID> {

}
