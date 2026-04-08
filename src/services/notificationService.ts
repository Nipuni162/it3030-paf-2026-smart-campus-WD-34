export type NotificationType = 'BOOKING' | 'TICKET' | 'SYSTEM';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-1',
    title: 'Booking Approved',
    message: 'Your request for Auditorium A has been approved for tomorrow.',
    type: 'BOOKING',
    priority: 'MEDIUM',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'N-2',
    title: 'New Ticket Update',
    message: 'Technician assigned to your IT support ticket #442.',
    type: 'TICKET',
    priority: 'LOW',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'N-3',
    title: 'Facility Maintenance',
    message: 'Block 3 Labs will be closed for maintenance on Saturday.',
    type: 'SYSTEM',
    priority: 'HIGH',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
  },
  {
    id: 'N-4',
    title: 'Ticket Resolved',
    message: 'Your ticket regarding the projector in Lab 302 has been marked as resolved.',
    type: 'TICKET',
    priority: 'MEDIUM',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markAsRead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  },

  markAllAsRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
    if (index !== -1) {
      MOCK_NOTIFICATIONS.splice(index, 1);
    }
  }
};
