import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Database, Users as UsersIcon, Settings as SettingsIcon, Activity, 
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

// Sub-components
import Overview from '../components/admin/Overview';
import Elections from '../components/admin/Elections';
import Users from '../components/admin/Users';
import Phases from '../components/admin/Phases';
import Settings from '../components/admin/Settings';

const Admin = () => {
  const [stats, setStats] = useState({
    constituencyCount: 140,
    predictionCount: 0,
    userCount: 0,
    currentPhase: 'Pre-Election',
    predictionLocked: false
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (!storedAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(storedAdmin));

    const fetchStats = async () => {
      try {
        const res = await apiRequest('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  const tabs = [
    { label: 'Overview', icon: Activity, component: <Overview stats={stats} /> },
    { label: 'Elections', icon: Database, component: <Elections /> },
    { label: 'Users', icon: UsersIcon, component: <Users /> },
    { label: 'Phases', icon: Cpu, component: <Phases /> },
    { label: 'Settings', icon: SettingsIcon, component: <Settings /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-inter flex text-white overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-[#070707] border-r border-emerald-900/10 fixed h-full z-40 hidden lg:flex flex-col">
        <div className="p-8 border-b border-emerald-900/5">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
               <ShieldCheck size={24} />
            </div>
            CrowdVote <span className="text-emerald-500 italic">OS</span>
          </div>
        </div>
        
        <nav className="flex-1 p-8 space-y-3">
          {tabs.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === item.label 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 translate-x-1' 
                  : 'text-slate-600 hover:text-emerald-400 hover:bg-emerald-950/5'
              }`}
            >
              <item.icon size={18} strokeWidth={activeTab === item.label ? 3 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-[#0A0A0A] rounded-[32px] p-6 border border-emerald-900/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-lg">
                      {admin?.username?.slice(0, 1).toUpperCase() || 'A'}
                   </div>
                   <div>
                      <div className="text-sm font-black text-white leading-tight truncate w-32">{admin?.username || 'Administrator'}</div>
                      <div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mt-1">Lvl 4 Admin</div>
                   </div>
                </div>
                <button 
                  onClick={() => { localStorage.removeItem('adminUser'); localStorage.removeItem('token'); navigate('/admin/login'); }}
                  className="w-full py-4 bg-emerald-500/5 hover:bg-emerald-500 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 transition-all border border-emerald-500/10"
                >
                   Term. Logout
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-80 min-h-screen">
         <div className="max-w-[1400px] mx-auto p-8 lg:p-16">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
               >
                  {tabs.find(t => t.label === activeTab)?.component}
               </motion.div>
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
};

export default Admin;
