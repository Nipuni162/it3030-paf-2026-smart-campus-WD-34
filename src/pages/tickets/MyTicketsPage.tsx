import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Clock, AlertCircle, Ticket as TicketIcon } from 'lucide-react';
import { technicianService } from '../../services/technicianService';
import { useAuth } from '../../context/AuthContext';
import { Ticket, TicketStatus, TicketPriority } from '../../types/ticket';
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge';
import { cn } from '../../lib/utils';

export const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await technicianService.getAssignedTickets(user.id);
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch assigned tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-500 bg-green-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">My Tickets</h1>
          <p className="text-xl serif-italic text-ink/50">Manage and resolve your assigned maintenance tasks.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative group flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-6 py-4 bg-paper border border-black/5 rounded-2xl text-sm font-bold outline-none focus:border-accent transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-6 py-4 bg-paper border border-black/5 rounded-2xl text-sm font-bold outline-none focus:border-accent transition-all"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/50 animate-pulse rounded-[2.5rem] border border-black/5" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
              className="bg-white rounded-[2.5rem] border border-black/5 p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group cursor-pointer flex flex-col md:flex-row md:items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-lg">
                    {ticket.id}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5", getPriorityColor(ticket.priority))}>
                    <AlertCircle size={12} /> {ticket.priority} Priority
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-ink mb-2 tracking-tight group-hover:text-accent transition-colors">
                  {ticket.title}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-sm text-ink/40">
                  <span className="flex items-center gap-2">
                    <Clock size={16} /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2 font-medium text-ink/60">
                    Location: {ticket.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-8">
                <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center text-ink/20 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 bg-white/50 rounded-[3rem] border border-dashed border-black/10 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5">
            <TicketIcon className="text-ink/10" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-ink mb-2">No tickets found</h3>
          <p className="text-ink/40 serif-italic">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};
