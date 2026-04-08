import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  Ticket, 
  Settings,
  Check,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { notificationService, Notification, NotificationType } from '../services/notificationService';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setIsLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'BOOKING': return <Calendar size={18} />;
      case 'TICKET': return <Ticket size={18} />;
      case 'SYSTEM': return <Settings size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-orange-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Notifications</h1>
          <p className="text-xl serif-italic text-ink/50">Stay updated with your bookings, tickets, and campus alerts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-6 py-3 bg-white border border-black/5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 hover:text-accent hover:border-accent transition-all duration-300"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {['ALL', 'UNREAD'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
              filter === f 
                ? "bg-accent text-white border-accent shadow-xl shadow-accent/20" 
                : "bg-white text-ink/40 border-black/5 hover:border-ink/20 hover:text-ink"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden card-shadow">
        {isLoading ? (
          <div className="p-20 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-paper animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-black/5">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-8 flex items-start gap-8 transition-all duration-500 group relative",
                  !notification.isRead ? "bg-accent/[0.02]" : "hover:bg-black/[0.01]"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110",
                  notification.type === 'BOOKING' ? "bg-blue-50 text-blue-600" : 
                  notification.type === 'TICKET' ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                )}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className={cn(
                        "text-lg font-bold tracking-tight transition-colors",
                        !notification.isRead ? "text-ink" : "text-ink/60"
                      )}>
                        {notification.title}
                      </h3>
                      <div className={cn("w-1.5 h-1.5 rounded-full", getPriorityColor(notification.priority))} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed mb-4",
                    !notification.isRead ? "text-ink/60" : "text-ink/30"
                  )}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/20">
                      <Clock size={12} /> {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {!notification.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline underline-offset-4"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="p-3 hover:bg-red-50 text-ink/20 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-paper rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-black/5">
              <Bell className="text-ink/10" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-ink mb-3">All caught up!</h3>
            <p className="text-xl serif-italic text-ink/30">No new notifications to show right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};
