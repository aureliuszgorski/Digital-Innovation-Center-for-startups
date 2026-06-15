'use client';
import { useState, useEffect } from 'react';
import { GarageProvider } from '@/context/GarageContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Lock, Crown } from 'lucide-react';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check session authentication
    const isAuth = sessionStorage.getItem('site-auth');
    if (isAuth === 'keepbuilding') {
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim().toLowerCase();
    // Allow both standard 'keepbuilding' and user's typo 'keepbuidling'
    if (cleanPwd === 'keepbuilding' || cleanPwd === 'keepbuidling') {
      setIsAuthenticated(true);
      sessionStorage.setItem('site-auth', 'keepbuilding');
      setError('');
    } else {
      setError('Invalid security key. Access denied.');
    }
  };

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#B4F052] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center px-4 z-[9999] overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[#B4F052]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-[#B4F052]/3 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="glass-card p-10 max-w-md w-full border-[#B4F052]/20 shadow-[0_0_80px_rgba(180,240,82,0.08)] text-center relative overflow-hidden animate-fade-in">
          {/* Branded Logo Accent */}
          <div className="w-16 h-16 rounded-2xl bg-[#B4F052]/10 border border-[#B4F052]/20 flex items-center justify-center text-[#B4F052] mx-auto mb-6 shadow-inner animate-pulse-glow">
            <Crown size={28} />
          </div>
          
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">
            Digital Innovation Center
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-6">
            Startup Operational Cockpit
          </p>
          
          <div className="h-[1px] w-full bg-white/[0.08] mb-6" />
          
          <p className="text-white/70 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
            Enter the security key to unlock the 100 startup challenges, sprints, and task modules.
          </p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter security key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20 focus:border-[#B4F052]/50 focus:bg-white/[0.05] text-white rounded-xl py-3 px-4 text-xs font-semibold text-center outline-none transition-all tracking-widest"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-[11px] font-semibold animate-fade-in">
                {error}
              </p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-[#B4F052] text-black font-extrabold rounded-xl text-xs hover:opacity-95 shadow-lg shadow-[#B4F052]/10 hover:shadow-[#B4F052]/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <Lock size={12} />
              Unlock Cockpit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <GarageProvider>
      <Sidebar />
      <TopBar />
      <main className="ml-56 mt-16 p-6 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </GarageProvider>
  );
}
