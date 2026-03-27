import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, BarChart3, TrendingUp,
  MapPin, Activity, Loader2
} from 'lucide-react';
import { getConstituencies } from '../lib/api';
import { useSocket } from '../context/SocketContext';

const ALLIANCE_COLORS = {
  LDF: { bar: 'bg-red-500', text: 'text-red-500', label: 'LDF' },
  UDF: { bar: 'bg-blue-500', text: 'text-blue-500', label: 'UDF' },
  NDA: { bar: 'bg-orange-500', text: 'text-orange-500', label: 'NDA' },
  Others: { bar: 'bg-slate-500', text: 'text-slate-500', label: 'OTH' },
};

const Arena = () => {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const res = await getConstituencies();
      setConstituencies(res.data || []);
    } catch (err) {
      console.error('Failed to fetch arena data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('consensusUpdate', (updatedCon) => {
        setConstituencies(prev => prev.map(c => 
          c.constituencyId === updatedCon.constituencyId ? { ...c, ...updatedCon } : c
        ));
      });
      return () => socket.off('consensusUpdate');
    }
  }, [socket]);

  const filtered = constituencies.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by district
  const grouped = filtered.reduce((acc, c) => {
    const d = c.district || 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(c);
    return acc;
  }, {});

  // Compute summary stats
  const totalCandidates = constituencies.reduce((t, c) => t + (c.candidates2026?.length || 0), 0);
  const ldfSeats = constituencies.filter(c => c.historical2021?.winnerFront === 'LDF').length;
  const udfSeats = constituencies.filter(c => c.historical2021?.winnerFront === 'UDF').length;
  const ndaSeats = constituencies.filter(c => c.historical2021?.winnerFront === 'NDA').length;

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
              Analytics
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            CONSENSUS <br /> <span className="text-emerald-500 italic">ARENA.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">2021 result breakdown & 2026 candidate overview for all 140 constituencies.</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Seats</p>
            <p className="text-2xl font-black text-white">{constituencies.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Candidates</p>
            <p className="text-2xl font-black text-emerald-500">{totalCandidates}</p>
          </div>
        </div>
      </div>

      {/* 2021 Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl text-center">
          <p className="text-[9px] font-black text-red-500/50 uppercase tracking-widest mb-1">LDF 2021</p>
          <p className="text-3xl font-black text-red-500">{ldfSeats}</p>
          <p className="text-[10px] text-slate-600 font-bold">seats won</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl text-center">
          <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest mb-1">UDF 2021</p>
          <p className="text-3xl font-black text-blue-500">{udfSeats}</p>
          <p className="text-[10px] text-slate-600 font-bold">seats won</p>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/10 p-5 rounded-2xl text-center">
          <p className="text-[9px] font-black text-orange-500/50 uppercase tracking-widest mb-1">NDA 2021</p>
          <p className="text-3xl font-black text-orange-500">{ndaSeats}</p>
          <p className="text-[10px] text-slate-600 font-bold">seats won</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
        <input
          type="text"
          placeholder="Filter by constituency or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/5 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none text-white placeholder-slate-600"
        />
      </div>

      {/* Constituency Grid — grouped by district */}
      {Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([district, cons]) => (
        <div key={district} className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{district} District — {cons.length} seats</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cons.map((con, i) => {
              const hist = con.historical2021 || {};
              const frontColor = ALLIANCE_COLORS[hist.winnerFront] || ALLIANCE_COLORS.Others;

              return (
                <motion.div
                  key={con.constituencyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-[#0A0A0A] border border-white/5 rounded-[24px] hover:border-emerald-500/20 transition-all group overflow-hidden"
                >
                  {/* Constituency Image Thumbnail */}
                  {con.imageFiles?.[0] && (
                    <div className="w-full h-24 overflow-hidden relative">
                      <img 
                        src={`/images/constituencies/${con.imageFiles[0]}`} 
                        alt={con.name}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">#{con.constituencyId}</p>
                        <h3 className="font-black text-sm uppercase tracking-tight text-white group-hover:text-emerald-500 transition-colors">
                          {con.name}
                        </h3>
                      </div>
                    {hist.winnerFront && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${frontColor.text} bg-white/5 border border-white/5`}>
                        {hist.winnerFront} '21
                      </span>
                    )}
                  </div>

                  {/* 2026 Candidates */}
                  <div className="space-y-1.5 mb-3">
                    {con.candidates?.slice(0, 3).map((cand, ci) => {
                      const cfg = ALLIANCE_COLORS[cand.alliance] || ALLIANCE_COLORS.Others;
                      return (
                        <div key={ci} className="flex items-center gap-2">
                          <span className={`text-[8px] font-black w-6 ${cfg.text}`}>{cand.alliance}</span>
                          <span className="text-[10px] text-slate-300 font-bold truncate flex-1">{cand.name}</span>
                          <span className={`text-[9px] ${cfg.text} opacity-70 font-bold`}>{cand.party}</span>
                        </div>
                      );
                    })}
                    {con.candidates?.length > 3 && (
                      <span className="text-[9px] text-slate-700 font-bold">+{con.candidates.length - 3} more</span>
                    )}
                  </div>

                  {/* 2021 Result Footer */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[9px] font-bold text-slate-600 truncate max-w-[60%]">
                      {hist.winnerName || '—'}
                    </span>
                    {hist.margin > 0 && (
                      <span className="text-[9px] font-black text-emerald-500/60">
                        +{hist.margin.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Arena;
