package com.campus.hub.booking;

import com.campus.hub.auth.User;
import com.campus.hub.auth.UserRepository;
import com.campus.hub.notification.Notification;
import com.campus.hub.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        // Simple conflict check
        boolean hasConflict = bookingRepository.existsByResourceIdAndStatusAndDateAndTimeSlot(
            booking.getResourceId(), "APPROVED", booking.getDate(), booking.getTimeSlot()
        );

        if (hasConflict) {
            throw new RuntimeException("Time slot already booked for this resource");
        }

        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(String id, String status, String adminEmail, String adminName) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        
        // Create notification for user
        Notification notification = new Notification();
        notification.setUserId(booking.getUserId());
        
        // Build clear message with admin info
        String adminInfo = adminEmail != null ? adminEmail : "An administrator";
        String message = adminInfo + " has " + status.toLowerCase() + " your booking request for " + booking.getResourceName();
        
        notification.setMessage(message);
        notification.setType(status.equals("APPROVED") ? "SUCCESS" : "WARNING");
        notificationService.createNotification(notification);

        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    public Booking cancelBooking(String id, String userId, String reason) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus("CANCELLED");
        Booking savedBooking = bookingRepository.save(booking);

        // Notify all Admin users
        List<User> admins = userRepository.findByRole("ADMIN");
        String reasonText = (reason != null && !reason.trim().isEmpty()) ? ". Reason: " + reason : ".";
        
        for (User admin : admins) {
            Notification adminNotification = new Notification();
            adminNotification.setUserId(admin.getId());
            adminNotification.setMessage("Booking Cancelled: User " + booking.getUserName() + 
                " has cancelled their reservation for " + booking.getResourceName() + 
                " on " + booking.getDate() + reasonText);
            adminNotification.setType("WARNING");
            notificationService.createNotification(adminNotification);
        }

        return savedBooking;
    }
}
