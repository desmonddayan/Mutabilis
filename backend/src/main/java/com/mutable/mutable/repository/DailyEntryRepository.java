package com.mutable.mutable.repository;

import com.mutable.mutable.model.DailyEntryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface DailyEntryRepository extends JpaRepository<DailyEntryLog, UUID > {
    DailyEntryLog findByUserIdAndEntryDate(String userId, LocalDate entryDate);

    List<DailyEntryLog> findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(String userId, LocalDate start, LocalDate end);

    void deleteByUserIdAndEntryDate(String userId, LocalDate entryDate);

    List<DailyEntryLog> findByUserIdAndEntryDateInOrderByEntryDateAsc(String userId, Set<LocalDate> entryDates);
}
