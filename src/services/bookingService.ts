import api from './api';
import { Resource, ResourceType } from './resourceService';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  userRole: 'STUDENT' | 'LECTURER' | 'ADMIN';
  date: string;
  timeSlot: string;
  status: BookingStatus;
  purpose: string;
  attendees: number;
  rejectionReason?: string;
}

const USE_MOCK = false;

export const bookingService = {
  getResources: async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>('/resources');
    return response.data;
  },

  getBookings: async (userId?: string): Promise<Booking[]> => {
    const url = userId ? `/bookings?userId=${userId}` : '/bookings';
    const response = await api.get<Booking[]>(url);
    return response.data;
  },

  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  approveBooking: async (id: string): Promise<void> => {
    await api.patch(`/bookings/${id}/status`, { status: 'APPROVED' });
  },

  rejectBooking: async (id: string, reason: string): Promise<void> => {
    await api.patch(`/bookings/${id}/status`, { 
      status: 'REJECTED',
      rejectionReason: reason 
    });
  }
};

export type { Resource, ResourceType };
