package com.campus.hub.service;

import com.campus.hub.model.Ticket;
import com.campus.hub.repository.TicketRepository;
import com.campus.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByUserId(String userId) {
        return ticketRepository.findByCreatedBy(userId);
    }

    public List<Ticket> getTicketsByTechnicianId(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket assignTechnician(String id, String technicianId, String technicianName) {
        System.out.println("Assigning technician to ticket ID: " + id);
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> {
                System.out.println("Ticket NOT FOUND in database for ID: " + id);
                return new RuntimeException("Ticket not found with ID: " + id);
            });
        
        System.out.println("Found ticket: " + ticket.getTitle() + ". Assigning to: " + technicianName);
        ticket.setAssignedTo(technicianId);
        ticket.setAssignedToName(technicianName);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
