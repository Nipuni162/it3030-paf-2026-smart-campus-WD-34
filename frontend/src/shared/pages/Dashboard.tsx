import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Ticket, 
  Bell,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';
import { AdminDashboard } from './admin/AdminDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import { DashboardCalendar } from '../components/DashboardCalendar';
import { bookingService, Booking } from '../../features/booking/bookingService';
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
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden group rounded-b-[3rem] lg:rounded-b-[4rem] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_IMAGES[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-paper/40 via-transparent to-transparent hidden lg:block" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 pb-32 md:pb-40">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-[2px] bg-accent rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Intelligent Infrastructure</span>
                </div>
                <h2 className="text-6xl md:text-9xl font-black text-ink mb-8 tracking-tighter leading-[0.85] text-gradient">
                  Campus <br />
                  <span className="serif-italic lowercase font-medium opacity-80">Orchestration</span> System.
                </h2>
                <p className="text-ink/60 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-12">
                  Navigate campus services with unprecedented speed and elegance. The only unified platform for life at Campus Hub.
                </p>
                <div className="flex flex-wrap gap-5">
                  <button 
                    onClick={() => navigate('/bookings')}
                    className="group relative px-10 py-5 bg-ink text-white font-bold text-[13px] uppercase tracking-wider rounded-2xl overflow-hidden shadow-2xl shadow-ink/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      New Booking <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                  <button 
                    onClick={() => navigate('/tickets')}
                    className="px-10 py-5 bg-card/40 backdrop-blur-xl text-ink font-bold text-[13px] uppercase tracking-wider rounded-2xl border border-ink/5 hover:bg-card/60 transition-all shadow-xl"
                  >
                    Infrastructure Support
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 right-24 hidden md:flex gap-4">
        <button 
          onClick={prevSlide}
          className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl text-ink border border-ink/5 hover:bg-card/60 transition-all shadow-xl group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl text-ink border border-ink/5 hover:bg-card/60 transition-all shadow-xl group"
        >
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1 rounded-full transition-all duration-700",
              currentIndex === idx ? "w-12 bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]" : "w-3 bg-ink/10"
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
    <div className="flex flex-col pb-24">
      <HeroCarousel />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full -mt-20 md:-mt-24 relative z-20 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Bookings" 
            value="12" 
            icon={<Calendar size={20} />} 
            trend="+3.2%"
            color="accent"
          />
          <StatCard 
            label="Active Tickets" 
            value="04" 
            icon={<Zap size={20} />} 
            trend="-14%"
            color="orange"
          />
          <StatCard 
            label="Notifications" 
            value="08" 
            icon={<Bell size={20} />} 
            trend="Stable"
            color="purple"
          />
          <StatCard 
            label="System Health" 
            value="99%" 
            icon={<Shield size={20} />} 
            trend="Perfect"
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-end justify-between px-2">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-ink uppercase">Pulse Feed</h2>
                <p className="text-lg serif-italic text-ink/40">Real-time infrastructure activity and updates.</p>
              </div>
              <button className="p-3 text-ink/30 hover:bg-surface rounded-2xl transition-all">
                <Activity size={20} />
              </button>
            </div>
            
            <div className="bg-card rounded-[3rem] border border-border p-10 shadow-premium overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="space-y-10 relative z-10">
                <ActivityItem 
                  title="Cloud Workspace Reserved" 
                  desc="Main Innovation Lab reservation confirmed for tomorrow, 10:00 AM." 
                  time="Just now"
                  icon={<CheckCircle2 size={20} />}
                  type="success"
                />
                <ActivityItem 
                  title="Infrastructure Alert" 
                  desc="Scheduled maintenance for Block 7 Power Grid completed successfully." 
                  time="2h ago"
                  icon={<Zap size={20} />}
                  type="info"
                />
                <ActivityItem 
                  title="Security Protocol" 
                  desc="New biometric access keys deployed for Research Wing B access." 
                  time="5h ago"
                  icon={<Shield size={20} />}
                  type="warning"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-ink rounded-[3rem] p-10 text-white shadow-2xl shadow-ink/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-accent opacity-20 group-hover:opacity-30 blur-3xl transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <Ticket className="text-accent" size={24} />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Support Engine</h3>
                <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">Encountering infrastructure issues? Deploy a support request instantly.</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/tickets/create')}
                    className="w-full py-4 bg-white text-ink font-bold rounded-2xl hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Open Ticket <ArrowUpRight size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/tickets?filter=mine')}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    Active Requests
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-[3rem] border border-border p-10 shadow-premium">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold tracking-tight">Upcoming</h3>
                <span className="px-3 py-1 bg-surface rounded-full text-[10px] font-bold text-ink/30 uppercase tracking-widest leading-none">Spring Session</span>
              </div>
              <div className="space-y-8">
                <EventItem date="28" month="MAR" title="Quantum Tech Week" location="North Auditorium" pulse />
                <EventItem date="02" month="APR" title="Sustainability Summit" location="Eco-Tech Hall" />
              </div>
            </div>

            <div className="space-y-6">
              <DashboardCalendar bookings={bookings} />
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: string }) {
  const colors = {
    accent: "bg-accent/5 text-accent border-accent/10 shadow-accent/5",
    orange: "bg-orange-500/5 text-orange-500 border-orange-500/10 shadow-orange-500/5",
    green: "bg-green-500/5 text-green-500 border-green-500/10 shadow-green-500/5",
    purple: "bg-purple-500/5 text-purple-500 border-purple-500/10 shadow-purple-500/5",
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-card p-8 rounded-[2.5rem] border border-border shadow-premium hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-card to-paper transition-all duration-500 group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", colors[color as keyof typeof colors])}>
          {icon}
        </div>
        <div className="px-2.5 py-1 bg-surface rounded-full">
           <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">{trend}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter text-ink mb-1">{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/30 italic serif-italic">{label}</span>
      </div>
    </motion.div>
  );
}

function ActivityItem({ title, desc, time, icon, type }: { title: string, desc: string, time: string, icon: React.ReactNode, type: 'success' | 'info' | 'warning' }) {
  const colors = {
    success: "bg-green-500/5 text-green-600 border-green-500/10",
    info: "bg-accent/5 text-accent border-accent/10",
    warning: "bg-orange-500/5 text-orange-600 border-orange-500/10",
  };

  return (
    <div className="flex gap-8 group cursor-pointer">
      <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm", colors[type])}>
        {icon}
      </div>
      <div className="flex-1 border-b border-border pb-8 group-last:border-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm text-ink group-hover:text-accent transition-colors">{title}</h4>
          <span className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.2em]">{time}</span>
        </div>
        <p className="text-[13px] text-ink/40 leading-relaxed font-semibold pr-10">{desc}</p>
      </div>
    </div>
  );
}

function EventItem({ date, month, title, location, pulse }: { date: string, month: string, title: string, location: string, pulse?: boolean }) {
  return (
    <div className="flex gap-6 group cursor-pointer items-center">
      <div className="relative">
        <div className={cn(
          "w-14 h-14 rounded-[1.25rem] flex flex-col items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:scale-110",
          pulse ? "bg-accent text-white" : "bg-surface text-ink/40"
        )}>
          <span className="text-[10px] font-bold uppercase tracking-widest">{month}</span>
          <span className="text-xl font-black leading-none">{date}</span>
        </div>
        {pulse && <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border-4 border-card rounded-full animate-ping" />}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="font-bold text-sm mb-1 truncate group-hover:text-accent transition-colors">{title}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20 truncate">{location}</p>
      </div>
    </div>
  );
}
