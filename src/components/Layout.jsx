import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Trophy, 
  LogOut, User, Bell, ShieldCheck, 
  BarChart3, Award, Settings, HelpCircle,
  Menu, X, Cpu
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('adminUser');
    // If both exist, the regular user session wins — clear stale admin
    if (storedUser && storedAdmin) {
      localStorage.removeItem('adminUser');
    }
    const active = storedUser || storedAdmin;
    if (active) {
      setUser(JSON.parse(active));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const isAuthPage = [
    '/signin', 
    '/signup', 
    '/reset-password', 
    '/admin/login',
    '/'
  ].includes(location.pathname);

  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return <main>{children}</main>;

  const navLinks = [
    { to: '/voting', label: 'Voting', icon: LayoutDashboard },
    { to: '/arena', label: 'Arena', icon: Map },
    { to: '/leaderboard', label: 'Elite', icon: Trophy },
    { to: '/analytics', label: 'Meta', icon: BarChart3 },
    { to: '/rewards', label: 'Vault', icon: Award },
  ];

  const secondaryLinks = [
    { to: '/notifications', label: 'Alerts', icon: Bell },
    { to: '/phases', label: 'Phases', icon: Cpu },
    { to: '/help', label: 'Docs', icon: HelpCircle },
    { to: '/profile', label: 'Node', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-80 bg-[#070707] border-r border-white/5 h-screen sticky top-0 hidden lg:flex flex-col z-50">
        <div className="p-10">
           <Link to="/dashboard" className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                 <ShieldCheck size={24} />
              </div>
              CrowdVote <span className="text-emerald-500 italic">OS</span>
           </Link>
        </div>

        <nav className="flex-1 px-8 space-y-2 overflow-y-auto custom-scrollbar">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 ml-4">Main Network</p>
           {navLinks.map((link) => (
             <Link
               key={link.to}
               to={link.to}
               className={`flex items-center gap-4 px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all group ${
                 location.pathname === link.to
                   ? 'bg-emerald-600 text-black shadow-lg shadow-emerald-600/20'
                   : 'text-slate-500 hover:text-white hover:bg-white/5'
               }`}
             >
                <link.icon size={18} className={location.pathname === link.to ? 'text-black' : 'text-slate-600 group-hover:text-emerald-500 transition-colors'} />
                {link.label}
             </Link>
           ))}

           <div className="pt-10 pb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 ml-4">Utilities</p>
              {secondaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all group ${
                    location.pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                   <link.icon size={18} className={location.pathname === link.to ? 'text-white' : 'text-slate-600 group-hover:text-emerald-500 transition-colors'} />
                   {link.label}
                </Link>
              ))}
           </div>
        </nav>

        <div className="p-8 mt-auto">
           <div className="bg-[#0A0A0A] rounded-[32px] p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              <div className="relative z-10 flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-lg">
                    {user?.fullName?.slice(0, 1).toUpperCase() || 'U'}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-white leading-tight truncate">{user?.fullName || 'User'}</div>
                    <div className="text-[10px] text-slate-600 font-bold truncate mt-0.5">{user?.email || ''}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                       {user?.role === 'admin' ? 'Architect' : 'Archivist'}
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                 <LogOut size={14} />
                 Terminate Session
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header - Mobile */}
        <header className="h-20 lg:hidden border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-400">
                 <Menu size={24} />
              </button>
              <div className="text-xl font-black tracking-tighter">
                 CrowdVote <span className="text-emerald-500">OS</span>
              </div>
           </div>
           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 font-black">
              {user?.fullName?.slice(0, 1).toUpperCase() || 'U'}
           </div>
        </header>

        {/* Global Status Bar - Desktop */}
        <div className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-md relative z-30">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Synchronized</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Cpu size={12} className="text-emerald-500" />
                 Current Phase: <span className="text-white">Campaign Execution</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-emerald-900/40 flex items-center justify-center text-[10px] font-bold">
                       {i}
                    </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                    +42
                 </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                 <Bell size={18} />
              </button>
           </div>
        </div>

        {/* Dynamic Content Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar selection:bg-emerald-500 selection:text-black">
           <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="p-8 lg:p-12 pb-32"
              >
                {children}
              </motion.div>
           </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#070707] z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#070707]">
                 <div className="text-xl font-black tracking-tighter">
                    CrowdVote <span className="text-emerald-500">OS</span>
                 </div>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500">
                    <X size={24} />
                 </button>
              </div>
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto bg-[#070707]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 ml-4">Interface</p>
                 {[...navLinks, ...secondaryLinks].map((link) => (
                   <Link
                     key={link.to}
                     to={link.to}
                     onClick={() => setIsMenuOpen(false)}
                     className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                       location.pathname === link.to
                         ? 'bg-emerald-500 text-black'
                         : 'text-slate-500 hover:bg-white/5'
                     }`}
                   >
                      <link.icon size={18} />
                      {link.label}
                   </Link>
                 ))}
              </nav>
              <div className="p-8 border-t border-white/5 bg-[#070707]">
                 <button onClick={handleLogout} className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-500/20">
                    Terminate Session
                 </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Layout;
