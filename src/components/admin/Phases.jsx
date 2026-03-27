import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, ResponsiveContainer, 
  XAxis, YAxis, Tooltip 
} from 'recharts';
import { 
  Disc, Box, ChevronRight, 
  Settings2, LucideLock, AlertCircle,
  Clock, ShieldAlert, Cpu 
} from 'lucide-react';

const Phases = () => {
  const performanceData = [
    { name: 'Pre-Election', LDF: 400, UDF: 420, NDA: 120 },
    { name: 'Campaign', LDF: 480, UDF: 510, NDA: 150 },
    { name: 'Final Countdown', LDF: 490, UDF: 495, NDA: 180 },
    { name: 'Exit-Poll', LDF: 530, UDF: 480, NDA: 210 },
  ];

  const currentPhase = 'Campaign';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10 pb-20"
    >
      {/* Editorial Header */}
      <div className="space-y-2">
         <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">Temporal Protocol Orchestration</span>
         <h1 className="text-5xl font-black tracking-tighter text-white">Election <span className="text-emerald-500 italic">Phases</span></h1>
      </div>

      {/* Phase Timeline */}
      <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] relative overflow-hidden">
         <div className="flex justify-between relative mb-12">
            <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-900/20 -translate-y-1/2" />
            
            {['Pre-Election', 'Campaign', 'Final Countdown', 'Exit-Poll Analysis'].map((phase, i) => {
               const isActive = phase === currentPhase;
               return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-4 group">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/40 scale-110' : 'bg-[#050505] text-slate-700 border border-emerald-900/10'}`}>
                        {isActive ? <Disc className="animate-spin-slow" /> : <Box />}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>{phase}</span>
                     {isActive && (
                        <div className="absolute -top-12 px-4 py-2 bg-emerald-500 text-black text-[9px] font-black rounded-lg uppercase tracking-widest animate-bounce">Active Protocol</div>
                     )}
                  </div>
               );
            })}
         </div>

         {/* Performance Bar Chart */}
         <div className="h-80 w-full mt-20">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={performanceData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: '900' }} />
                  <Tooltip 
                     cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                     contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '16px' }}
                  />
                  <Bar dataKey="LDF" fill="#10B981" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="UDF" fill="#065F46" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="NDA" fill="#064E3B" radius={[10, 10, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Transition Control */}
         <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-emerald-900/10 p-10 rounded-[40px] space-y-8 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-3 text-emerald-500 text-xs font-black uppercase tracking-widest mb-6">
                  <LucideLock size={16} />
                  Governance Locking
               </div>
               <h3 className="text-3xl font-black text-white">Transition to <span className="text-emerald-500 italic">Final Phase</span></h3>
               <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">This action will finalize the campaign data buffer and initiate exit-poll neural weights. This procedure is irreversibly logged on the blockchain.</p>
            </div>
            <button className="w-full bg-[#10B981]/10 border border-[#10B981]/20 hover:bg-emerald-500 hover:text-black py-6 rounded-2xl text-emerald-500 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 group">
               Initiate Temporal Shift
               <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Intelligence Feed */}
         <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] space-y-8">
            <div className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
               <AlertCircle size={16} />
               Phase Intelligence Feed
            </div>
            <div className="space-y-6">
               {[
                  { title: 'Volatility Index', val: 'Low (0.12)', msg: 'Minimal cluster movement detected in past 6h.' },
                  { title: 'Sentiment Drift', val: 'LDF +2.1%', msg: 'Urban clusters shifting toward progressive metrics.' },
                  { title: 'Data Integrity', val: '99.98%', msg: 'Hash verification complete for phase buffer.' }
               ].map((item, i) => (
                  <div key={i} className="space-y-1">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.title}</span>
                        <span className="text-sm font-black text-emerald-500">{item.val}</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium">{item.msg}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default Phases;
