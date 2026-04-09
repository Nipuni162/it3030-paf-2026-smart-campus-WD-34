import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Search,
  User,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrTech = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
    ...(user?.role === 'TECHNICIAN' ? [
      { icon: <Ticket size={18} />, label: 'My Tickets', path: '/technician/tickets' }
    ] : []),
    ...(user?.role !== 'TECHNICIAN' ? [
      { icon: <Calendar size={18} />, label: 'Bookings', path: '/bookings' },
      { icon: <Calendar size={18} />, label: 'My Bookings', path: '/my-bookings' },
      { icon: <Ticket size={18} />, label: 'Tickets', path: '/tickets' }
    ] : []),
    ...(user?.role === 'ADMIN' ? [
      { icon: <Settings size={18} />, label: 'Resources', path: '/admin/resources' },
      { icon: <Calendar size={18} />, label: 'Manage Bookings', path: '/admin/bookings' }
    ] : []),
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
  ];

  const NavLinks = ({ className, itemClassName }: { className?: string, itemClassName?: (isActive: boolean) => string }) => (
    <nav className={className}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) => itemClassName ? itemClassName(isActive) : cn(
            "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-500 group relative text-[11px] font-bold uppercase tracking-[0.15em]",
            isActive 
              ? "bg-ink text-white shadow-xl shadow-ink/10" 
              : "text-ink/30 hover:text-ink hover:bg-black/5"
          )}
        >
          <span className="shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            {item.icon}
          </span>
          <span className="relative">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className={cn(
      "min-h-screen bg-paper text-ink font-sans flex",
      isAdminOrTech ? "flex-row" : "flex-col"
    )}>
      {/* Sidebar for Admin/Technician */}
      {isAdminOrTech && (
        <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border sticky top-0 h-screen z-50">
          <div className="p-8">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-ink rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xl shadow-ink/20 text-white transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                  C
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-lg border-2 border-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black tracking-tighter text-xl text-ink uppercase">Campus</span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase ml-0.5">Hub.OS</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-4">
            <NavLinks 
              className="flex flex-col gap-2" 
              itemClassName={(isActive) => cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group text-[11px] font-bold uppercase tracking-[0.15em]",
                isActive 
                  ? "bg-ink text-white shadow-2xl shadow-ink/10" 
                  : "text-ink/30 hover:text-ink hover:bg-black/5"
              )}
            />
          </div>

          <div className="p-8 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-ink/30 hover:bg-red-500 hover:text-white transition-all duration-500 group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-card/40 backdrop-blur-2xl border-b border-border flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-16">
            {/* Logo - Only show if not in sidebar mode */}
            {!isAdminOrTech && (
              <div 
                onClick={() => navigate('/')} 
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-ink rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xl shadow-ink/20 text-white transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                    C
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-lg border-2 border-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black tracking-tighter text-xl text-ink uppercase">Campus</span>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase ml-0.5">Hub.OS</span>
                </div>
              </div>
            )}

            {/* Desktop Nav Links - Only show if not in sidebar mode */}
            {!isAdminOrTech && (
              <NavLinks className="hidden lg:flex items-center gap-2" />
            )}
            
            {/* Page Title or Breadcrumb for Sidebar mode */}
            {isAdminOrTech && (
              <div className="hidden lg:block">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20">Management Console</h2>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            {/* Search */}
            <div className="relative hidden xl:block group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors duration-300" size={14} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-12 pr-6 py-3 bg-black/[0.03] border border-transparent rounded-2xl text-[12px] focus:ring-4 focus:ring-accent/5 focus:bg-white focus:border-black/5 transition-all duration-500 w-48 xl:w-72 outline-none font-bold tracking-tight"
              />
            </div>
            
            {/* User & Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-2xl text-ink/20 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              
              <div className="flex items-center gap-4 pl-4 md:pl-10 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-black text-ink leading-none mb-1 uppercase tracking-tight">{user?.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-accent/60">{user?.role}</p>
                </div>
                
                <div className="relative group cursor-pointer">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-2xl shadow-black/10 ring-1 ring-black/5 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      alt="User" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg" />
                </div>

                <div className="flex items-center gap-2">
                  {!isAdminOrTech && (
                    <button
                      onClick={handleLogout}
                      className="hidden sm:flex p-3 rounded-2xl text-ink/20 hover:bg-red-500 hover:text-white transition-all duration-500 group shadow-sm hover:shadow-red-500/20"
                      title="Logout"
                    >
                      <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {/* Mobile Menu Toggle */}
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-3 hover:bg-black/5 rounded-2xl transition-all text-ink/60"
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-card/95 backdrop-blur-2xl z-40 p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <NavLinks 
              className="flex flex-col gap-3" 
              itemClassName={(isActive) => cn(
                "flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 text-[14px] font-black uppercase tracking-[0.1em]",
                isActive 
                  ? "bg-ink text-white shadow-2xl shadow-ink/20" 
                  : "text-ink/30 hover:text-ink hover:bg-black/5"
              )}
            />
            <div className="mt-auto pt-8 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] text-ink/30 hover:bg-red-500 hover:text-white transition-all duration-500 group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-black text-[14px] tracking-[0.1em] uppercase">Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-paper/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
