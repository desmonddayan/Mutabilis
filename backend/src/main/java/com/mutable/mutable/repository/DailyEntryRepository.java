package com.mutable.mutable.repository;

import com.mutable.mutable.model.DailyEntryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DailyEntryRepository extends JpaRepository<DailyEntryLog, UUID > {
}
