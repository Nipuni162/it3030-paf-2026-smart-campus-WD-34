import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types/ticket';

// Mock Data
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1001',
    title: 'Projector not working in Room 302',
    description: 'The projector turns on but shows a blue screen. Tried restarting but no luck.',
    category: 'IT',
    priority: 'HIGH',
    status: 'OPEN',
    location: 'Block A, Room 302',
    faculty: 'Computing',
    email: 'john.student@sliit.lk',
    createdBy: 'user-1',
    createdByName: 'John Student',
    createdAt: '2026-03-26T10:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z',
    comments: [],
    attachments: [
      { id: 'att-1', url: 'https://picsum.photos/seed/projector/800/600', fileName: 'blue_screen.jpg' }
    ]
  },
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
    assignedTo: 'tech-2',
    assignedToName: 'Sarah Plumber',
    createdAt: '2026-03-24T11:20:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    resolutionNotes: 'Replaced the washer in the tap. Tested and working fine.',
    comments: [],
    attachments: []
  }
];

export const ticketService = {
  getTickets: async (role: string, userId: string): Promise<Ticket[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (role === 'ADMIN') return MOCK_TICKETS;
    if (role === 'TECHNICIAN') return MOCK_TICKETS.filter(t => t.assignedTo === userId);
    return MOCK_TICKETS.filter(t => t.createdBy === userId);
  },

  getTicketById: async (id: string): Promise<Ticket | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_TICKETS.find(t => t.id === id);
  },

  createTicket: async (data: Partial<Ticket>): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newTicket: Ticket = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: [],
      ...data
    } as Ticket;
    MOCK_TICKETS.unshift(newTicket);
    return newTicket;
  },

  updateStatus: async (id: string, status: TicketStatus, notes?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ticket = MOCK_TICKETS.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      if (notes) ticket.resolutionNotes = notes;
    }
  },

  assignTechnician: async (id: string, techId: string, techName: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ticket = MOCK_TICKETS.find(t => t.id === id);
    if (ticket) {
      ticket.assignedTo = techId;
      ticket.assignedToName = techName;
      ticket.status = 'IN_PROGRESS';
      ticket.updatedAt = new Date().toISOString();
    }
  },

  addComment: async (id: string, userId: string, userName: string, content: string): Promise<void> => {
    const ticket = MOCK_TICKETS.find(t => t.id === id);
    if (ticket) {
      ticket.comments.push({
        id: `c-${Date.now()}`,
        userId,
        userName,
        content,
        createdAt: new Date().toISOString()
      });
    }
  }
};
