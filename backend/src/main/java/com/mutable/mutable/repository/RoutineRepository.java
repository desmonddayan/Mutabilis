package com.mutable.mutable.repository;

import com.mutable.mutable.model.RoutineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoutineRepository extends JpaRepository<RoutineLog, UUID> {
    List<RoutineLog> findByUserId(String userId);
    List<RoutineLog> findByRoutineIdAndUserId(UUID routineId, String userId);
    void deleteByRoutineIdAndUserId(UUID routineId, String userId);
}
