import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle2, MapPin, ChevronRight, Sliders,
  ShieldCheck, Zap, Vote, Loader2, AlertCircle, User2
} from 'lucide-react';
import { apiRequest, getConstituencies } from '../lib/api';
import { useNavigate } from 'react-router-dom';

// Alliance config
const ALLIANCE_CONFIG = {
  LDF:    { label: 'Left Democratic Front',        color: 'text-red-500',    bg: 'bg-red-600',    badge: 'bg-red-500/10 text-red-500 border-red-500/20',    border: 'border-red-500/30' },
  UDF:    { label: 'United Democratic Front',       color: 'text-blue-500',   bg: 'bg-blue-600',   badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',   border: 'border-blue-500/30' },
  NDA:    { label: 'National Democratic Alliance',  color: 'text-orange-500', bg: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20', border: 'border-orange-500/30' },
  Others: { label: 'Independent / Others',          color: 'text-slate-500',  bg: 'bg-slate-600',  badge: 'bg-slate-500/10 text-slate-500 border-slate-500/20',  border: 'border-slate-500/30' },
};

const Voting = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user') || localStorage.getItem('adminUser');
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });

  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCon, setSelectedCon] = useState(null);
  const [selectedAlliance, setSelectedAlliance] = useState('');
  const [confidence, setConfidence] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getConstituencies();
        setConstituencies(res.data || []);
      } catch (err) {
        console.error('Failed to fetch voting data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, user]);

  // Filter constituencies
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

  const handleSubmit = async () => {
    if (!selectedAlliance || !selectedCon) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await apiRequest('/predictions/submit', {
        method: 'POST',
        body: JSON.stringify({
          constituencyId: selectedCon.constituencyId,
          predictedAlliance: selectedAlliance,
          confidenceWeight: confidence
        })
      });
      setSubmitMsg({ type: 'success', text: 'Vote locked successfully!' });
      setSelectedAlliance('');
      setConfidence(5);
    } catch (err) {
      setSubmitMsg({ type: 'error', text: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      {/* === Constituency Sidebar === */}
      <aside className="w-full lg:w-80 xl:w-96 bg-[#060606] border-r border-white/5 flex flex-col lg:h-[calc(100vh-80px)] shrink-0">
        <div className="p-5 space-y-3 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-black tracking-tight">
              SELECT <span className="text-emerald-500 italic">SEAT</span>
            </h2>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black border border-emerald-500/20">
              {constituencies.length} SEATS
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              type="text"
              placeholder="Search constituency or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs font-bold focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none text-white placeholder-slate-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-4 pt-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a #060606' }}>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-slate-600 text-xs py-10 font-bold">No constituencies found</p>
          ) : (
            Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([district, cons]) => (
              <div key={district}>
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.25em] px-2 mb-1.5">{district}</p>
                <div className="space-y-1">
                  {cons.map(con => (
                    <button
                      key={con.constituencyId}
                      onClick={() => { setSelectedCon(con); setSelectedAlliance(''); setSubmitMsg(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                        selectedCon?.constituencyId === con.constituencyId
                          ? 'bg-emerald-600/10 border-emerald-500/40 text-white'
                          : 'bg-transparent border-transparent hover:border-white/5 hover:bg-white/[0.02] text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="uppercase tracking-tight">{con.name}</span>
                        {selectedCon?.constituencyId === con.constituencyId && <ChevronRight size={12} className="text-emerald-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* === Main Voting Area === */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedCon ? (
            <motion.div
              key={selectedCon.constituencyId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              {/* Header */}
              <div className="relative group">
                {selectedCon.imageFiles?.[0] && (
                  <div className="w-full h-48 md:h-64 rounded-[40px] overflow-hidden mb-8 border border-white/10 relative">
                    <img 
                      src={`/images/constituencies/${selectedCon.imageFiles[0]}`} 
                      alt={selectedCon.name}
                      className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                  </div>
                )}
                <div className="space-y-3 relative">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                      #{selectedCon.constituencyId}
                    </span>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{selectedCon.district} District</span>
                    {selectedCon.sourceUrl && (
                      <a href={selectedCon.sourceUrl} target="_blank" rel="noreferrer" className="text-[8px] font-black text-emerald-500/40 uppercase hover:text-emerald-500 transition-colors">Source Data</a>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                    {selectedCon.name}
                  </h1>
                  {selectedCon.historical2021 && (
                    <p className="text-slate-500 text-sm font-medium">
                      2021: <span className="text-white font-bold">{selectedCon.historical2021.winnerName || selectedCon.historical2021.winnerFront}</span> won
                      {selectedCon.historical2021.margin > 0 && <> by <span className="text-emerald-500 font-bold">{selectedCon.historical2021.margin.toLocaleString()}</span> votes</>}
                      {selectedCon.historical2021.turnout > 0 && <> · Turnout: <span className="text-slate-300">{selectedCon.historical2021.turnout}%</span></>}
                    </p>
                  )}
                </div>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Vote size={16} className="text-emerald-500" />
                  Select Your Candidate
                </h3>

                <div className="space-y-3">
                  {selectedCon.candidates && selectedCon.candidates.length > 0 ? selectedCon.candidates.map((cand, i) => {
                    const allianceCfg = ALLIANCE_CONFIG[cand.alliance] || ALLIANCE_CONFIG.Others;
                    const isSelected = selectedAlliance === cand.alliance;

                    return (
                      <motion.button
                        key={`${cand.alliance}-${i}`}
                        onClick={() => setSelectedAlliance(cand.alliance)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-4 md:p-5 rounded-[20px] border-2 transition-all relative overflow-hidden group ${
                          isSelected
                            ? `${allianceCfg.border} bg-[#111] ring-2 ring-offset-2 ring-offset-[#050505] ring-emerald-500/30`
                            : 'border-white/5 bg-[#0A0A0A] hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Party Logo */}
                          {cand.partyLogo ? (
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                              <img
                                src={`/images/${cand.partyLogo}`}
                                alt={cand.party}
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          ) : (
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${allianceCfg.bg} flex items-center justify-center text-white font-black text-lg shrink-0`}>
                              {cand.party?.slice(0, 2).toUpperCase() || '?'}
                            </div>
                          )}

                          {/* Candidate Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-sm md:text-base uppercase tracking-tight text-white truncate">
                              {cand.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-xs font-black ${allianceCfg.color}`}>{cand.party}</span>
                              <span className="text-slate-700">•</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${allianceCfg.badge}`}>
                                {cand.alliance}
                              </span>
                            </div>
                          </div>



                          {/* Selection Indicator */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors" />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  }) : (
                    <div className="p-10 bg-[#0A0A0A] rounded-3xl border border-white/5 text-center">
                      <User2 className="mx-auto text-slate-700 mb-3" size={32} />
                      <p className="text-slate-500 text-xs font-bold">Candidate data not yet available for this constituency.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Confidence + Submit */}
              {selectedAlliance && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0A0A0A] border border-white/5 p-8 md:p-10 rounded-[32px] space-y-8"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-black flex items-center gap-3">
                      <Sliders className="text-emerald-500" size={20} />
                      Confidence Weight
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Higher confidence = more influence points at stake</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-5xl font-black text-emerald-500">{confidence}</span>
                      <span className="text-xs font-black text-slate-600 uppercase">Multiplier: {confidence * 10}x</span>
                    </div>
                    <input
                      type="range" min="1" max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-emerald-900/20 rounded-full appearance-none outline-none"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-700 uppercase tracking-widest">
                      <span>Low Risk</span>
                      <span>High Conviction</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-black rounded-[20px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    {submitting ? 'Locking Vote...' : 'Lock Prediction'}
                  </button>

                  {submitMsg && (
                    <div className={`flex items-center gap-2 text-xs font-bold ${submitMsg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {submitMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      {submitMsg.text}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Info */}
              <div className="p-6 bg-[#111] border border-white/5 rounded-[24px] flex items-start gap-4">
                <ShieldCheck className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <p className="text-[11px] font-bold leading-relaxed text-slate-400 italic">
                  "Select a candidate to cast your prediction. Your vote maps to their alliance front for swarm consensus calculation. You may update your prediction up to 3 times during the Campaign phase."
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-500/5 rounded-[32px] flex items-center justify-center border border-emerald-500/10 opacity-30">
                <MapPin className="text-emerald-500 w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Select a <span className="text-emerald-500 italic">Constituency</span>
                </h2>
                <p className="text-slate-600 max-w-sm font-medium text-sm">
                  Choose a seat from the sidebar to view candidates and cast your prediction.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Voting;
