import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Globe, Zap, 
  MoreHorizontal, Lock, UserCheck 
} from 'lucide-react';

const Users = () => {
  const nodes = [
    { id: '#ND-8821', status: 'Active', ip: '192.168.**.**', trust: 98, access: 'Admin' },
    { id: '#ND-7412', status: 'Active', ip: '45.12.**.**', trust: 92, access: 'Jurist' },
    { id: '#ND-1092', status: 'Offline', ip: '102.34.**.**', trust: 45, access: 'Watcher' },
    { id: '#ND-5563', status: 'Active', ip: '89.221.**.**', trust: 99, access: 'Jurist' },
    { id: '#ND-3321', status: 'Active', ip: '210.45.**.**', trust: 87, access: 'Watcher' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-10"
    >
      {/* Editorial Header */}
      <div className="space-y-2">
         <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">Node Integrity Surveillance</span>
         <h1 className="text-5xl font-black tracking-tighter text-white">Voter <span className="text-emerald-500 italic">Nodes</span></h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Nodes', val: '12,842', icon: Globe, color: 'text-emerald-500' },
          { label: 'Active Sync', val: '98.2%', icon: Zap, color: 'text-emerald-400' },
          { label: 'Fraud Alerts', val: '0', icon: ShieldAlert, color: 'text-slate-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-emerald-900/10 p-8 rounded-[32px] relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all transform group-hover:scale-110">
                <kpi.icon size={120} />
             </div>
             <div className="relative z-10 flex flex-col gap-4">
                <div className="w-10 h-10 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-500">
                   <kpi.icon size={20} />
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</div>
                   <div className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.val}</div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Node Registry Table */}
      <div className="bg-[#080808] border border-emerald-900/5 rounded-[40px] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black text-white">Voter Node Registry</h3>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all"><MoreHorizontal size={20} /></button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                     <th className="px-8 py-6">Node ID</th>
                     <th className="px-8 py-6">Sync Log</th>
                     <th className="px-8 py-6">IP Mask</th>
                     <th className="px-8 py-6">Trust Score</th>
                     <th className="px-8 py-6">Access Level</th>
                     <th className="px-8 py-6">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {nodes.map((node, i) => (
                     <tr key={i} className="group hover:bg-emerald-500/[0.02] transition-colors">
                        <td className="px-8 py-6 align-middle">
                           <div className="flex items-center gap-3 text-sm font-black text-white">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              {node.id}
                           </div>
                        </td>
                        <td className="px-8 py-6 align-middle">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                              {node.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 align-middle font-mono text-xs text-slate-500 tracking-tighter">
                           {node.ip}
                        </td>
                        <td className="px-8 py-6 align-middle">
                           <div className="flex items-center gap-3 w-32">
                              <div className="flex-1 h-1 bg-emerald-900/20 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 transition-all" style={{ width: `${node.trust}%` }} />
                              </div>
                              <span className="text-xs font-black text-emerald-500">{node.trust}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 align-middle">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                              {node.access === 'Admin' ? <Lock size={12} className="text-emerald-500" /> : <UserCheck size={12} />}
                              {node.access}
                           </div>
                        </td>
                        <td className="px-8 py-6 align-middle">
                           <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">Verify Node</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
};

export default Users;
