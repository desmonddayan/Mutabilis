package com.mutable.mutable.repository;

import com.mutable.mutable.model.PhotoScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PhotoScoreLogRepository extends JpaRepository<PhotoScoreLog, UUID> {
    PhotoScoreLog findByUserIdAndEntryDateAndSlot(String userId, LocalDate date, String slot);

    List<PhotoScoreLog> findByUserIdAndEntryDateIn(String userId, Set<LocalDate> entryDates);
}
