import api from './api';
import { Ticket, TicketStatus } from '../types/ticket';

// Mock Data for Preview
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1002',
    title: 'Network issues in Library',
    description: 'Wi-Fi keeps disconnecting every 5 minutes. Affecting many students.',
    category: 'IT',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    location: 'Central Library, 2nd Floor',
    faculty: 'General',
    email: 'jane.staff@sliit.lk',
    createdBy: 'user-2',
    createdByName: 'Jane Staff',
    assignedTo: 'tech-1',
    assignedToName: 'Mike Technician',
    createdAt: '2026-03-25T14:30:00Z',
    updatedAt: '2026-03-26T09:00:00Z',
    comments: [
      { id: 'c-1', userId: 'tech-1', userName: 'Mike Technician', content: 'Investigating the router settings.', createdAt: '2026-03-26T09:05:00Z' }
    ],
    attachments: []
  },
  {
    id: 'T-1003',
    title: 'Leaking tap in Lab 04',
    description: 'The tap in the corner sink is leaking heavily.',
    category: 'FACILITY',
    priority: 'LOW',
    status: 'RESOLVED',
    location: 'Block C, Lab 04',
    faculty: 'Engineering',
    email: 'john.student@sliit.lk',
    createdBy: 'user-1',
    createdByName: 'John Student',
    assignedTo: 'tech-1',
    assignedToName: 'Mike Technician',
    createdAt: '2026-03-24T11:20:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    resolutionNotes: 'Replaced the washer in the tap. Tested and working fine.',
    comments: [],
    attachments: []
  }
];

const USE_MOCK = true; // Toggle this based on your environment

export const technicianService = {
  /**
   * Get all tickets assigned to the logged-in technician
   */
  getAssignedTickets: async (): Promise<Ticket[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_TICKETS;
    }
    const response = await api.get<Ticket[]>('/tickets/assigned');
    return response.data;
  },

  /**
   * Get a single ticket by ID
   */
  getTicketById: async (id: string): Promise<Ticket> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = MOCK_TICKETS.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Update the status of a ticket
   */
  updateTicketStatus: async (id: string, status: TicketStatus, resolutionNotes?: string): Promise<Ticket> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const ticket = MOCK_TICKETS.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      ticket.status = status;
      if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
      ticket.updatedAt = new Date().toISOString();
      return ticket;
    }
    const response = await api.put<Ticket>(`/tickets/${id}/status`, { 
      status, 
      resolutionNotes 
    });
    return response.data;
  },

  /**
   * Add a comment to a ticket
   */
  addComment: async (id: string, content: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = MOCK_TICKETS.find(t => t.id === id);
      if (ticket) {
        ticket.comments.push({
          id: `c-${Date.now()}`,
          userId: 'tech-1',
          userName: 'Mike Technician',
          content,
          createdAt: new Date().toISOString()
        });
      }
      return;
    }
    await api.post(`/tickets/${id}/comments`, { content });
  }
};
