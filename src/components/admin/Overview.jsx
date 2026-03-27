import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Activity, ShieldCheck, Terminal, Cpu, 
  TrendingUp, AlertTriangle, CheckCircle2, Database 
} from 'lucide-react';

const Overview = ({ stats }) => {
  const telemetryData = [
    { time: '00:00', val: 450 },
    { time: '04:00', val: 520 },
    { time: '08:00', val: 480 },
    { time: '12:00', val: 610 },
    { time: '16:00', val: 590 },
    { time: '20:00', val: 720 },
    { time: '23:59', val: 680 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10"
    >
      {/* Editorial Header */}
      <div className="space-y-2">
         <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">Registry Command Center</span>
         <h1 className="text-5xl font-black tracking-tighter text-white">Consensus <span className="text-emerald-500 italic">Telemetry</span></h1>
      </div>

      {/* Hero Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-emerald-900/10 p-10 rounded-[40px] relative overflow-hidden group shadow-2xl shadow-emerald-500/5">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] transition-all group-hover:bg-emerald-500/10" />
           
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       Live Consensus Stream
                    </div>
                    <h2 className="text-4xl font-black text-white">98.4% <span className="text-slate-500 italic font-medium">Confidence Score</span></h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-right">
                       <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Sync</div>
                       <div className="text-sm font-bold text-emerald-500">1.4M events/s</div>
                    </div>
                 </div>
              </div>

              <div className="h-64 mt-12">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryData}>
                       <defs>
                          <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area 
                          type="monotone" 
                          dataKey="val" 
                          stroke="#10B981" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#telemetryGradient)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#0A0A0A] border border-emerald-900/10 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Lead Party (Predicted)</div>
              <div className="text-3xl font-black text-white group-hover:text-emerald-500 transition-colors">NATIONAL FRONT</div>
              <div className="mt-6 flex justify-between items-end">
                 <div>
                    <div className="text-sm font-bold text-emerald-500">84/140 Seats</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">98% Data Saturation</div>
                 </div>
                 <TrendingUp className="text-emerald-500/20 group-hover:text-emerald-500 transition-colors" size={48} />
              </div>
           </div>

           <div className="bg-[#0A0A0A] border border-emerald-900/10 p-8 rounded-[40px] space-y-6">
              <div className="flex justify-between items-center">
                 <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Master Node Status</div>
                 <CheckCircle2 className="text-emerald-500" size={16} />
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Database size={24} />
                 </div>
                 <div>
                    <div className="text-lg font-black text-white">140 Constituencies</div>
                    <div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">Full DB Encryption Active</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Terminal Health Logs */}
      <div className="bg-[#070707] border border-emerald-900/10 rounded-[40px] p-10 font-mono relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8">
            <Terminal className="text-white/5 w-32 h-32" />
         </div>
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3">
               <Cpu className="text-emerald-500" size={20} />
               System Kernel Logs
            </h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">Optimal Performance</span>
         </div>
         <div className="space-y-3 text-xs">
            {[
               { time: '19:42:01', msg: 'Neural consensus sync complete (Node_KR_01)', type: 'success' },
               { time: '19:40:55', msg: 'Blockchain payload signed (SHA-256)', type: 'info' },
               { time: '19:38:12', msg: 'Voter integrity audit: 0 outliers detected', type: 'success' },
               { time: '19:35:44', msg: 'Constituency weighting rebalanced for Phase: Campaign', type: 'warning' },
               { time: '19:30:00', msg: 'Routine cache purge initiated by admin.terminal', type: 'info' }
            ].map((log, i) => (
               <div key={i} className="flex gap-6 items-start py-1 border-b border-white/5 opacity-80 hover:opacity-100 transition-all cursor-default">
                  <span className="text-slate-600 font-bold">[{log.time}]</span>
                  <span className={log.type === 'success' ? 'text-emerald-500' : log.type === 'warning' ? 'text-amber-500' : 'text-slate-400'}>
                     {log.msg}
                  </span>
               </div>
            ))}
         </div>
      </div>
    </motion.div>
  );
};

export default Overview;
