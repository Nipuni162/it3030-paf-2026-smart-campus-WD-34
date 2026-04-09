import api from './api';
import { Ticket, TicketStatus } from '../types/ticket';

export const technicianService = {
  /**
   * Get all tickets assigned to the logged-in technician
   */
  getAssignedTickets: async (technicianId: string): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets?technicianId=${technicianId}`);
    return response.data;
  },

  /**
   * Get a single ticket by ID
   */
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Update the status of a ticket
   */
  updateTicketStatus: async (id: string, status: TicketStatus, resolutionNotes?: string): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}/status`, { 
      status, 
      resolutionNotes 
    });
    return response.data;
  },

  /**
   * Add a comment to a ticket
   */
  addComment: async (id: string, content: string): Promise<void> => {
    await api.post(`/tickets/${id}/comments`, { content });
  }
};
