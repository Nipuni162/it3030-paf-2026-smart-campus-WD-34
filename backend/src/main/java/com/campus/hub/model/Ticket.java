package com.campus.hub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String userId;
    private String technicianId;
    private String category; // PLUMBING | ELECTRICAL | IT | OTHER
    private String description;
    private String priority; // LOW | MEDIUM | HIGH | URGENT
    private String status; // OPEN | IN_PROGRESS | RESOLVED | CLOSED
    private LocalDateTime createdAt;

    public Ticket() {}

    public Ticket(String id, String userId, String technicianId, String category, String description, String priority, String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.technicianId = technicianId;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTechnicianId() { return technicianId; }
    public void setTechnicianId(String technicianId) { this.technicianId = technicianId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
