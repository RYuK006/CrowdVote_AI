import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, MapPin, 
  Users, BarChart3, ChevronRight 
} from 'lucide-react';

const Elections = ({ constituencies = [] }) => {
  const mockConstituencies = [
    { name: 'Trivandrum', coverage: 98, polls: 4, status: 'Active' },
    { name: 'Palakkad', coverage: 94, polls: 3, status: 'Active' },
    { name: 'Ernakulam', coverage: 99, polls: 5, status: 'Syncing' },
    { name: 'Kozhikode', coverage: 91, polls: 2, status: 'Active' },
    { name: 'Wayanad', coverage: 88, polls: 1, status: 'Offline' },
    { name: 'Idukki', coverage: 95, polls: 4, status: 'Active' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-10 pb-20"
    >
      {/* Editorial Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
           <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60">Registry Orchestration</span>
           <h1 className="text-5xl font-black tracking-tighter text-white">Constituency <span className="text-emerald-500 italic">Nodes</span></h1>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
           <Plus size={18} strokeWidth={3} />
           Provision New Node
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4">
         <div className="flex-1 bg-[#0A0A0A] border border-emerald-900/10 rounded-2xl flex items-center px-6 focus-within:border-emerald-500/30 transition-all">
            <Search className="text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Query node registry..." 
              className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-sm font-medium placeholder:text-slate-600"
            />
         </div>
         <div className="bg-[#0A0A0A] border border-emerald-900/10 rounded-2xl px-6 flex items-center gap-4 cursor-pointer hover:bg-emerald-500/5 transition-all group">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Sort: Coverage</span>
            <ChevronRight size={16} className="text-slate-600 rotate-90" />
         </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockConstituencies.map((node, i) => (
          <div 
            key={i} 
            className="group relative bg-[#090909] border border-emerald-900/5 rounded-[32px] p-8 hover:bg-[#0C0C0C] hover:border-emerald-500/20 transition-all duration-500 overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-xl text-black">
                   <ChevronRight size={20} />
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white">{node.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-500' : node.status === 'Syncing' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{node.status}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#050505] p-4 rounded-2xl space-y-1">
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Node Coverage</div>
                      <div className="text-lg font-black text-emerald-500">{node.coverage}%</div>
                   </div>
                   <div className="bg-[#050505] p-4 rounded-2xl space-y-1">
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Polls</div>
                      <div className="text-lg font-black text-white">{node.polls}</div>
                   </div>
                </div>

                <div className="pt-2">
                   <div className="w-full bg-emerald-900/10 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000" 
                        style={{ width: `${node.coverage}%` }} 
                      />
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Elections;
