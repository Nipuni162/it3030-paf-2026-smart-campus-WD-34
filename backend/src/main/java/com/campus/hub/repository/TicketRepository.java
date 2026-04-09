package com.campus.hub.repository;

import com.campus.hub.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedBy(String createdBy);
    List<Ticket> findByAssignedTo(String assignedTo);
}
