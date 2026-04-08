package com.campus.hub.repository;

import com.campus.hub.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Conflict detection query: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
    boolean existsByResourceIdAndStatusAndStartTimeBeforeAndEndTimeAfter(
        String resourceId, String status, LocalDateTime endTime, LocalDateTime startTime
    );

    List<Booking> findByUserId(String userId);
}
