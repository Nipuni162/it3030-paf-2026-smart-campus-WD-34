import api from './api';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type ResourceType = 'LECTURE_HALL' | 'LAB' | 'EQUIPMENT';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  faculty: string;
  building: string;
  capacity: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';
  description: string;
  image?: string;
}

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
  rejectionReason?: string;
}

const MOCK_RESOURCES: Resource[] = [
  { id: 'R-1', name: 'Main Auditorium', type: 'LECTURE_HALL', faculty: 'General', building: 'Main Building', capacity: 500, status: 'AVAILABLE', description: 'Large auditorium for major events.' },
  { id: 'R-2', name: 'Computing Lab 01', type: 'LAB', faculty: 'Computing', building: 'New Building', capacity: 50, status: 'AVAILABLE', description: 'High-end PCs for programming.' },
  { id: 'R-3', name: 'Engineering Workshop', type: 'LAB', faculty: 'Engineering', building: 'Engineering Building', capacity: 30, status: 'AVAILABLE', description: 'Heavy machinery and tools.' },
  { id: 'R-4', name: 'BM Lecture Hall 01', type: 'LECTURE_HALL', faculty: 'Business', building: 'BM Building', capacity: 100, status: 'AVAILABLE', description: 'Modern lecture hall for business students.' },
  { id: 'R-5', name: 'Projector 4K-01', type: 'EQUIPMENT', faculty: 'General', building: 'Main Building', capacity: 1, status: 'AVAILABLE', description: 'Portable 4K projector.' },
  { id: 'R-6', name: 'Physics Lab', type: 'LAB', faculty: 'Engineering', building: 'Engineering Building', capacity: 25, status: 'MAINTENANCE', description: 'Lab for physics experiments.' },
  { id: 'R-7', name: 'Digital Lab', type: 'LAB', faculty: 'Computing', building: 'New Building', capacity: 40, status: 'AVAILABLE', description: 'Electronics and digital logic lab.' },
  { id: 'R-8', name: 'Conference Room 01', type: 'LECTURE_HALL', faculty: 'Business', building: 'BM Building', capacity: 20, status: 'UNAVAILABLE', description: 'Small room for meetings.' },
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 'B-1001', resourceId: 'R-1', resourceName: 'Main Auditorium', userId: 'u-1', userName: 'John Student', userRole: 'STUDENT', date: '2026-03-28', timeSlot: '10:00 AM - 12:00 PM', status: 'PENDING', purpose: 'Tech Symposium' },
  { id: 'B-1002', resourceId: 'R-2', resourceName: 'Computing Lab 01', userId: 'u-2', userName: 'Jane Staff', userRole: 'LECTURER', date: '2026-03-28', timeSlot: '02:00 PM - 04:00 PM', status: 'APPROVED', purpose: 'CS Lab Session' },
];

const USE_MOCK = true;

export const bookingService = {
  getResources: async (): Promise<Resource[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return MOCK_RESOURCES;
    }
    const response = await api.get<Resource[]>('/resources');
    return response.data;
  },

  getBookings: async (): Promise<Booking[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_BOOKINGS;
    }
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newBooking: Booking = {
        id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PENDING',
        ...data
      } as Booking;
      MOCK_BOOKINGS.unshift(newBooking);
      return newBooking;
    }
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  approveBooking: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const booking = MOCK_BOOKINGS.find(b => b.id === id);
      if (booking) {
        booking.status = 'APPROVED';
      }
      return;
    }
    await api.put(`/bookings/${id}/approve`);
  },

  rejectBooking: async (id: string, reason: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const booking = MOCK_BOOKINGS.find(b => b.id === id);
      if (booking) {
        booking.status = 'REJECTED';
        booking.rejectionReason = reason;
      }
      return;
    }
    await api.put(`/bookings/${id}/reject`, { reason });
  }
};
