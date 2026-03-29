import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Star, LayoutDashboard, Loader2, MoveUp, ShieldCheck, Cpu, Target } from 'lucide-react';
import { apiRequest } from '../lib/api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiRequest('/users/leaderboard');
        setUsers(res.data || []);
        
        const meRes = await apiRequest('/users/me');
        setMe(meRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050505] space-y-6">
       <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Syncing Swarm Ranks...</p>
    </div>
  );

  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter pb-32 pt-28">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]"
           >
              <Trophy size={14} /> Official Archive Ranks
           </motion.div>
           <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">Democratic <span className="text-emerald-500 italic">Elite</span>.</h1>
           <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              The definitive ranking of Kerala's election archivists. Determined by Predictability Score (PS) and high-fidelity historical convergence.
           </p>
        </div>

        {/* Podium Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
           {/* Second Place */}
           {top3[1] && (
             <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="order-2 md:order-1">
                <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] text-center space-y-6 relative group hover:border-emerald-500/30 transition-all">
                   <div className="w-24 h-24 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black border-4 border-[#050505] shadow-xl">
                      {top3[1].fullName[0]}
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black">{top3[1].fullName}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rank #2 • Master</p>
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <div className="text-3xl font-black text-white">{top3[1].rankScore}</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase">PS Score</div>
                   </div>
                </div>
             </motion.div>
           )}

           {/* First Place */}
           {top3[0] && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="order-1 md:order-2">
                <div className="bg-[#111111] border-2 border-emerald-500 p-12 rounded-[50px] text-center space-y-8 relative shadow-2xl shadow-emerald-500/10 scale-110 z-10">
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                      Absolute Leader
                   </div>
                   <div className="w-32 h-32 bg-emerald-500 rounded-[40px] mx-auto flex items-center justify-center text-5xl font-black text-black border-8 border-[#111111] shadow-2xl">
                      {top3[0].fullName[0]}
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black">{top3[0].fullName}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Rank #1 • Oracle</p>
                   </div>
                   <div className="pt-8 border-t border-white/10 flex justify-between items-center px-10">
                      <div className="text-center">
                         <div className="text-3xl font-black">{top3[0].rankScore}</div>
                         <div className="text-[10px] font-black text-emerald-500 uppercase">PS Score</div>
                      </div>
                      <Trophy size={48} className="text-emerald-500" fill="currentColor" />
                   </div>
                </div>
             </motion.div>
           )}

           {/* Third Place */}
           {top3[2] && (
             <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="order-3">
                <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] text-center space-y-6 relative group hover:border-emerald-500/30 transition-all">
                   <div className="w-24 h-24 bg-amber-900/20 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black text-amber-500 border-4 border-[#050505] shadow-xl">
                      {top3[2].fullName[0]}
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black">{top3[2].fullName}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rank #3 • Expert</p>
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <div className="text-3xl font-black text-white">{top3[2].rankScore}</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase">PS Score</div>
                   </div>
                </div>
             </motion.div>
           )}
        </div>

        {/* Global Rankings List */}
        <div className="max-w-5xl mx-auto bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tight">Global <span className="text-emerald-500 italic">Feed</span></h3>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    <Medal size={14} /> View Badges
                 </button>
              </div>
           </div>
           
           <div className="divide-y divide-white/5">
              {remaining.map((user, i) => (
                <div key={user._id} className="p-8 flex items-center justify-between hover:bg-emerald-500/5 transition-all group border-l-4 border-transparent hover:border-emerald-500">
                   <div className="flex items-center gap-8">
                      <span className="text-3xl font-black text-slate-800 group-hover:text-emerald-500/20 transition-colors w-12 text-center">#{i + 4}</span>
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center font-black text-slate-500 border border-white/5 uppercase">
                            {user.fullName[0]}
                         </div>
                            <div className="space-y-1">
                             <h4 className="text-lg font-black">{user.fullName}</h4>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">{user.predictionsMade || 0} predictions · {(user.badges || []).length} badges</span>
                                <MoveUp size={12} className="text-emerald-500" />
                             </div>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-black">{user.rankScore}</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Predictability</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Current User Sticky Bar */}
        {me && (
           <motion.div 
             initial={{ y: 100 }} 
             animate={{ y: 0 }} 
             className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50"
           >
              <div className="bg-[#111] border-t-4 border-emerald-500 p-6 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center justify-between border-x border-b border-white/5">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-emerald-500/20">
                       {me.rankScore}
                    </div>
                    <div>
                       <h4 className="font-black text-lg">Your Current Performance</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{me.fullName} • {me.role}</p>
                    </div>
                 </div>
                     <div className="flex items-center gap-8">
                     <div className="text-right">
                        <div className="text-2xl font-black">#{users.findIndex(u => u._id === me._id) + 1 || '—'}</div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase">Global Rank</div>
                     </div>
                     <button className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all" onClick={() => window.location.href='/voting'}>
                        <LayoutDashboard size={24} />
                     </button>
                 </div>
              </div>
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
