import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

    const handleQuickLogin = (roleEmail: string) => {
      setEmail(roleEmail);
      setPassword('password');
      // We need to wait for state updates or just call login logic directly
      // For simplicity in this mock, we'll just set values and the user can click login
      // OR we can wrap the logic in a function
    };

    const performLogin = async (loginEmail: string, loginPassword = 'password') => {
      setIsLoading(true);
      setError('');
      try {
        const data = await authService.login({ email: loginEmail, password: loginPassword });
        login(data.token, data.user);
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      performLogin(email, password);
    };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper font-sans overflow-hidden">
      {/* Editorial Hero Section */}
      <div className="lg:w-1/2 bg-ink p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute left-10 top-10 w-40 h-40 bg-accent/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-bold text-xl text-white mb-12 shadow-2xl shadow-accent/20">
            S
          </div>
          <h1 className="text-[12vw] lg:text-[8vw] font-bold text-white leading-[0.85] tracking-tighter uppercase mb-8">
            Smart<br />Campus
          </h1>
          <p className="text-xl serif-italic text-white/40 max-w-sm leading-relaxed">
            The next generation of university operations. Seamlessly manage facilities, assets, and maintenance.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
          <span>Est. 2026</span>
          <div className="w-12 h-px bg-white/10" />
          <span>IT3030 Module</span>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-paper">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-ink mb-3">Sign In</h2>
            <p className="text-ink/40 font-medium">Enter your credentials to access the hub.</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-lg border-black/5 text-accent focus:ring-accent" />
                <span className="text-ink/40 group-hover:text-ink transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:underline underline-offset-4">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-ink text-white rounded-2xl font-bold hover:bg-accent transition-all duration-500 shadow-2xl shadow-ink/10 disabled:opacity-50 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Enter Hub</>
              )}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-10">
              <div className="w-full border-t border-black/5"></div>
              <span className="absolute px-6 bg-paper text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20">Quick Access</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => performLogin('admin@university.edu')}
                className="py-3 bg-white border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Admin
              </button>
              <button 
                onClick={() => performLogin('tech@university.edu')}
                className="py-3 bg-white border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
              >
                Tech
              </button>
              <button 
                onClick={() => performLogin('user@university.edu')}
                className="py-3 bg-white border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
              >
                User
              </button>
            </div>
          </div>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-10">
              <div className="w-full border-t border-black/5"></div>
              <span className="absolute px-6 bg-paper text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20">Social Access</span>
            </div>

            <button className="w-full py-4 bg-white border border-black/5 rounded-2xl font-bold text-ink/60 hover:bg-black hover:text-white transition-all duration-500 flex items-center justify-center gap-4 text-xs uppercase tracking-widest">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0" alt="Google" />
              Google Login
            </button>
          </div>

          <p className="mt-12 text-center text-ink/30 text-[11px] font-bold uppercase tracking-widest">
            New here?{' '}
            <Link to="/signup" className="text-accent hover:underline underline-offset-4">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
