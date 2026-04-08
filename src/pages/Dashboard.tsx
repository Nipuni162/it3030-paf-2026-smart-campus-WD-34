import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Ticket, 
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { AdminDashboard } from './admin/AdminDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import { DashboardCalendar } from '../components/DashboardCalendar';
import { bookingService, Booking } from '../services/bookingService';
import { WeatherWidget } from '../components/WeatherWidget';

const HERO_IMAGES = [
  "https://static.sliit.lk/wp-content/uploads/2024/07/15041028/SLIIT-Metro-Campus-welcomed-new-batch-for-July-2024-intake-2.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlHpGxyvgIGgAyY5fkJwaOPJSh_Jxvl4a50g&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwF5WQv-Xid1GPpOIHLYfpBANUAbHxVJXoBQ&s"
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_IMAGES[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-24">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-[1px] bg-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Campus Management</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                  Empowering <br />
                  <span className="text-accent italic serif-italic font-normal lowercase">Campus</span> Life.
                </h2>
                <p className="text-white/60 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-10">
                  Experience the next generation of campus management and resource booking with our unified operating system.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/bookings')}
                    className="px-8 py-4 bg-accent text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-ink transition-all duration-500 shadow-2xl shadow-accent/20"
                  >
                    Reserve Space
                  </button>
                  <button 
                    onClick={() => navigate('/tickets')}
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/20 transition-all duration-500 border border-white/10"
                  >
                    Support Center
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await bookingService.getBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'TECHNICIAN') {
    return <TechnicianDashboard />;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroCarousel />

      <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">Campus Overview</h1>
            <p className="text-xl serif-italic text-ink/50">Welcome back, {user?.name}. Here's your campus overview.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-2xl text-[11px] font-bold text-ink/30 uppercase tracking-[0.2em]">
            <Calendar size={14} className="text-accent" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            label="Total Bookings" 
            value="12" 
            icon={<Calendar className="text-accent" />} 
            trend="+3 this week"
            color="blue"
          />
          <StatCard 
            label="Active Tickets" 
            value="04" 
            icon={<Ticket className="text-orange-500" />} 
            trend="-2 resolved"
            color="orange"
          />
          <StatCard 
            label="Notifications" 
            value="08" 
            icon={<CheckCircle2 className="text-green-500" />} 
            trend="All caught up"
            color="green"
          />
          <StatCard 
            label="Usage Rate" 
            value="84%" 
            icon={<TrendingUp className="text-purple-500" />} 
            trend="High activity"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-10 card-shadow">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
              <button className="p-3 hover:bg-black/5 rounded-2xl transition-all text-ink/20">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="space-y-10">
              <ActivityItem 
                title="Booking Approved" 
                desc="Your request for Auditorium A has been approved for tomorrow." 
                time="2 hours ago"
                icon={<CheckCircle2 size={20} />}
                type="success"
              />
              <ActivityItem 
                title="New Ticket Update" 
                desc="Technician assigned to your IT support ticket #442." 
                time="5 hours ago"
                icon={<Clock size={20} />}
                type="info"
              />
              <ActivityItem 
                title="Facility Maintenance" 
                desc="Block 3 Labs will be closed for maintenance on Saturday." 
                time="Yesterday"
                icon={<AlertCircle size={20} />}
                type="warning"
              />
            </div>
          </div>

          {/* Quick Actions & Events */}
          <div className="space-y-8">
            <div className="bg-ink rounded-[2.5rem] p-10 text-white shadow-2xl shadow-ink/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all duration-700" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Need Help?</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed relative z-10">Report any maintenance issues or facility problems instantly to our support team.</p>
              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => navigate('/tickets/create')}
                  className="flex-1 py-4 bg-white text-ink font-bold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Raise Ticket <ArrowUpRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/tickets?filter=mine')}
                  className="flex-1 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  My Tickets <Ticket size={18} />
                </button>
              </div>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border p-10 card-shadow">
              <h3 className="text-xl font-bold mb-8 tracking-tight">Upcoming Events</h3>
              <div className="space-y-8">
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-accent/5 rounded-2xl flex flex-col items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">MAR</span>
                    <span className="text-xl font-bold leading-none">28</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-sm mb-1">Tech Symposium</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ink/30">Main Auditorium • 10:00 AM</p>
                  </div>
                </div>
                
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-14 h-14 bg-ink/5 rounded-2xl flex flex-col items-center justify-center text-ink/40 shrink-0 group-hover:bg-ink group-hover:text-white transition-all duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">APR</span>
                    <span className="text-xl font-bold leading-none">02</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-sm mb-1">Career Fair 2026</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-ink/30">Exhibition Hall • 09:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <DashboardCalendar bookings={bookings} />
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: string }) {
  const colors = {
    blue: "bg-blue-500/5 text-blue-500 border-blue-500/10",
    orange: "bg-orange-500/5 text-orange-500 border-orange-500/10",
    green: "bg-green-500/5 text-green-500 border-green-500/10",
    purple: "bg-purple-500/5 text-purple-500 border-purple-500/10",
  };
  
  return (
    <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", colors[color as keyof typeof colors])}>
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-ink/20">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter text-ink">{value}</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
        <p className="text-[9px] font-bold text-ink/30 uppercase tracking-[0.15em]">{trend}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, desc, time, icon, type }: { title: string, desc: string, time: string, icon: React.ReactNode, type: 'success' | 'info' | 'warning' }) {
  const colors = {
    success: "bg-green-500/5 text-green-600 border-green-500/10",
    info: "bg-blue-500/5 text-blue-600 border-blue-500/10",
    warning: "bg-orange-500/5 text-orange-600 border-orange-500/10",
  };

  return (
    <div className="flex gap-6 group cursor-pointer">
      <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", colors[type])}>
        {icon}
      </div>
      <div className="flex-1 border-b border-border pb-6 group-last:border-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-black text-[13px] text-ink uppercase tracking-tight">{title}</h4>
          <span className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.2em]">{time}</span>
        </div>
        <p className="text-[13px] text-ink/40 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
