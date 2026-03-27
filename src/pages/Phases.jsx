import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, 
  CheckCircle2, Lock, 
  ArrowRight, Activity,
  Zap, Target, Loader2
} from 'lucide-react';
import { getPhaseConfig } from '../lib/api';

const PHASE_ORDER = ['Pre-Election', 'Campaign', 'Final', 'Exit-Poll', 'Post-Result'];

const PHASE_ICONS = {
  'Pre-Election': Calendar,
  'Campaign': Zap,
  'Final': Lock,
  'Exit-Poll': Activity,
  'Post-Result': Target,
};

const Phases = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!config?.electionDate) return;
    const timer = setInterval(() => {
      const diff = new Date(config.electionDate) - Date.now();
      if (diff <= 0) {
        setCountdown('Election Day!');
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${days} Days, ${hours} Hours, ${mins} Minutes`);
    }, 1000);
    return () => clearInterval(timer);
  }, [config]);

  const fetchConfig = async () => {
    try {
      const res = await getPhaseConfig();
      setConfig(res.data);
    } catch (err) {
      // Fallback defaults if backend is down
      setConfig({
        currentPhase: 'Campaign',
        electionDate: '2026-04-14',
        predictionLocked: false
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  const currentPhase = config?.currentPhase || 'Campaign';
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);

  const phases = PHASE_ORDER.map((phase, i) => {
    let status, dateLine;
    if (i < currentIdx) {
      status = 'Completed';
      dateLine = 'Completed';
    } else if (i === currentIdx) {
      status = 'Live';
      dateLine = 'Current Phase';
    } else {
      status = 'Locked';
      dateLine = 'Upcoming';
    }
    // Approximate dates
    const dateMap = {
      'Pre-Election': 'Jan — Feb 2026',
      'Campaign': 'Mar — Apr 2026',
      'Final': 'Apr 2026',
      'Exit-Poll': 'Apr 2026',
      'Post-Result': 'May 2026',
    };
    if (status !== 'Live') dateLine = dateMap[phase] || 'TBD';

    return { title: phase, status, date: dateLine, icon: PHASE_ICONS[phase] || Calendar };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Election <span className="text-emerald-500 italic">Phases</span>.</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Track the temporal evolution of the Kerala 2026 democratic swarm.</p>
        {config?.predictionLocked && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-xs font-black border border-red-500/20">
            <Lock size={14} /> Predictions are currently locked
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {phases.map((phase, i) => {
          const PhaseIcon = phase.icon;
          return (
            <div key={i} className={`p-10 rounded-[40px] border transition-all ${
              phase.status === 'Live' 
              ? 'bg-[#0A0A0A] border-emerald-500 shadow-2xl shadow-emerald-500/10' 
              : phase.status === 'Completed'
              ? 'bg-[#0A0A0A] border-emerald-500/20 opacity-70'
              : 'bg-transparent border-white/5 opacity-40 grayscale'
            }`}>
              <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl ${
                  phase.status === 'Live' ? 'bg-emerald-500 text-black' 
                  : phase.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-white/5 text-slate-500'
                }`}>
                  <PhaseIcon size={24} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  phase.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : phase.status === 'Completed' ? 'bg-emerald-500/5 text-emerald-500/60 border-emerald-500/10'
                  : 'bg-white/5 text-slate-700 border-white/5'
                }`}>
                  {phase.status === 'Completed' && <CheckCircle2 size={10} className="inline mr-1" />}
                  {phase.status}
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{phase.title}</h3>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">{phase.date}</p>
              
              {phase.status === 'Live' && (
                <button 
                  onClick={() => window.location.href = '/voting'}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group transition-all"
                >
                  Enter Voting <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Countdown */}
      <div className="p-12 bg-emerald-950/10 border border-emerald-900/20 rounded-[50px] flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-emerald-500/20 rounded-3xl text-emerald-500">
          <Clock size={48} />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-3xl font-black tracking-tight">Election <span className="text-emerald-500 italic">Countdown</span>.</h4>
          <p className="text-slate-500 font-medium">
            {config?.electionDate 
              ? <>The Kerala 2026 election is on <span className="text-white font-black">{new Date(config.electionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.</>
              : 'Election date not yet announced.'
            }
            {countdown && <> — <span className="text-emerald-500 font-black">{countdown}</span></>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Phases;
