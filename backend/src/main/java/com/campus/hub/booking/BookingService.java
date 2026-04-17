package com.campus.hub.booking;

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

    public Booking updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        
        // Create notification for user
        Notification notification = new Notification();
        notification.setUserId(booking.getUserId());
        notification.setMessage("Your booking for " + booking.getResourceName() + " has been " + status.toLowerCase());
        notification.setType(status.equals("APPROVED") ? "SUCCESS" : "WARNING");
        notificationService.createNotification(notification);

        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
