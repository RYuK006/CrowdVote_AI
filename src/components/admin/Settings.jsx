import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, ShieldCheck, Activity, 
  FileText, Trash2, Key, 
  Cpu, Zap, ShieldAlert,
  ChevronRight
} from 'lucide-react';

const Settings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-10 pb-20"
    >
      {/* Editorial Header */}
      <div className="space-y-2">
         <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">System Core Configuration</span>
         <h1 className="text-5xl font-black tracking-tighter text-white">Terminal <span className="text-emerald-500 italic">Settings</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terminal Configuration */}
        <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] space-y-8">
           <div className="flex items-center gap-3 text-emerald-500 text-xs font-black uppercase tracking-widest">
              <Terminal size={18} />
              Kernel Parameters
           </div>
           
           <div className="space-y-6">
              {[
                 { label: 'Sync Rate', desc: 'Neural buffer refresh frequency', val: '1.4ms', toggle: true },
                 { label: 'Oracle Integration', desc: 'External data source consensus', val: 'Active', toggle: true },
                 { label: 'Emergency Lockdown', desc: 'Instant node isolation protocol', val: 'Standby', toggle: false },
              ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center group cursor-pointer">
                    <div>
                       <div className="text-sm font-black text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{item.label}</div>
                       <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">{item.val}</span>
                       <div className={`w-12 h-6 rounded-full p-1 transition-all ${item.toggle ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${item.toggle ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Security Protocols */}
        <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] space-y-8">
           <div className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={18} />
              Security Protocol Status
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#050505] p-6 rounded-[32px] space-y-4 hover:border-emerald-500/20 border border-transparent transition-all group">
                 <div className="w-10 h-10 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Activity size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Firewall</div>
                    <div className="text-sm font-black text-white uppercase">Optimized</div>
                 </div>
              </div>
              <div className="bg-[#050505] p-6 rounded-[32px] space-y-4 hover:border-emerald-500/20 border border-transparent transition-all group">
                 <div className="w-10 h-10 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Cpu size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Encryption</div>
                    <div className="text-sm font-black text-white uppercase">SHA-512 Active</div>
                 </div>
              </div>
           </div>
        </div>

        {/* System Audit Log */}
        <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] space-y-8">
           <div className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
              <FileText size={18} />
              System Audit Versioning
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                 <span className="text-xs font-black text-white uppercase tracking-widest italic">Stable Kernel</span>
                 <span className="text-xs font-mono text-emerald-500">v2.4.0-emerald</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                 <span className="text-xs font-black text-white uppercase tracking-widest italic">Last Patch</span>
                 <span className="text-xs font-mono text-slate-500">02.14.2024 / 08:31 UTC</span>
              </div>
              <div className="flex justify-between items-center py-4">
                 <span className="text-xs font-black text-white uppercase tracking-widest italic">Runtime</span>
                 <span className="text-xs font-mono text-emerald-500">99.998% Uptime</span>
              </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0A0A0A] border border-rose-900/20 p-10 rounded-[40px] space-y-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8">
              <ShieldAlert className="text-rose-500/5 w-24 h-24" />
           </div>
           <div className="flex items-center gap-3 text-rose-500 text-xs font-black uppercase tracking-widest">
              <Trash2 size={18} />
              Danger Zone Protocol
           </div>
           <div className="space-y-4 flex flex-col">
              <button className="flex justify-between items-center py-4 hover:bg-rose-500/5 px-2 rounded-xl transition-all group/btn">
                 <div className="text-left">
                    <div className="text-xs font-black text-white uppercase tracking-widest group-hover/btn:text-rose-500 transition-colors">Purge System Cache</div>
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Deletes all transient node weights</div>
                 </div>
                 <ChevronRight size={16} className="text-slate-800" />
              </button>
               <button className="flex justify-between items-center py-4 hover:bg-rose-500/5 px-2 rounded-xl transition-all group/btn">
                  <div className="text-left">
                     <div className="text-xs font-black text-emerald-500 uppercase tracking-widest transition-colors">Download Admin CSV</div>
                     <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Export all node activity logs</div>
                  </div>
                  <FileText size={16} className="text-slate-800" />
               </button>
               <button className="flex justify-between items-center py-4 hover:bg-rose-500/5 px-2 rounded-xl transition-all group/btn">
                  <div className="text-left">
                     <div className="text-xs font-black text-white uppercase tracking-widest group-hover/btn:text-rose-500 transition-colors">Rotate Master Keys</div>
                     <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Requires 2FA verification</div>
                  </div>
                  <Key size={16} className="text-slate-800" />
               </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
