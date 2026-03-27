import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, Star, Zap, Trophy, Target, 
  Crown, Sparkles, Shield, Map, Loader2
} from 'lucide-react';
import { getMyStats } from '../lib/api';

const BADGE_ICONS = {
  early_bird: Zap,
  first_vote: Star,
  district_voter: Map,
  district_master: Target,
  full_coverage: Crown,
  high_confidence: Sparkles,
  streak_3: Star,
  top_10: Trophy,
};

const BADGE_COLORS = {
  early_bird: 'purple',
  first_vote: 'emerald',
  district_voter: 'blue',
  district_master: 'amber',
  full_coverage: 'red',
  high_confidence: 'pink',
  streak_3: 'cyan',
  top_10: 'orange',
};

const Rewards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    if (!storedUser) { navigate('/signin'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getMyStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Loading Vault</p>
    </div>
  );

  if (!stats) return null;

  const badges = stats.badges || [];
  const earnedCount = badges.filter(b => b.earned).length;

  // Rank tier
  const getRankTier = (score) => {
    if (score >= 500) return 'Oracle';
    if (score >= 300) return 'Expert';
    if (score >= 150) return 'Predictor';
    return 'Voter';
  };

  const tiers = ['Voter', 'Predictor', 'Expert', 'Oracle'];
  const currentTier = getRankTier(stats.rankScore);
  const currentTierIdx = tiers.indexOf(currentTier);
  const progressPct = Math.min(100, (stats.rankScore / 500) * 100);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/20"
        >
          <Trophy className="text-emerald-500 w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Rewards <span className="text-emerald-500 italic">Vault</span>.</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Your contributions to the Kerala 2026 intelligence swarm are rewarded through influence and prestige.</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#111111] border border-emerald-900/20 p-10 rounded-[40px] text-center space-y-2">
          <div className="text-5xl font-black text-white">{stats.influencePoints.toLocaleString()}</div>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Influence Points</p>
        </div>
        <div className="bg-[#111111] border border-emerald-900/20 p-10 rounded-[40px] text-center space-y-2">
          <div className="text-5xl font-black text-white">{earnedCount} / {badges.length}</div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-500">Badges Unlocked</p>
        </div>
        <div className="bg-[#111111] border border-emerald-900/20 p-10 rounded-[40px] text-center space-y-2 relative overflow-hidden">
          <div className="text-5xl font-black text-white">#{stats.rankPosition}</div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-500">Global Rank</p>
          <div className="absolute top-0 right-0 p-4">
            <Crown className="text-amber-500/20 w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
            <Shield className="text-emerald-500" />
            Achievement Meta
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, i) => {
            const Icon = BADGE_ICONS[badge.key] || Star;
            const color = BADGE_COLORS[badge.key] || 'emerald';
            return (
              <div key={badge.key} className={`p-8 rounded-[32px] border transition-all duration-500 ${
                badge.earned 
                ? 'bg-[#111111] border-emerald-900/30' 
                : 'bg-[#0A0A0A] border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
              }`}>
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-5 rounded-3xl ${
                    badge.earned ? `bg-${color}-500/10 text-${color}-500` : 'bg-white/5 text-white/20'
                  }`}>
                    <Icon size={32} />
                  </div>
                  {badge.earned && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <Award size={10} /> Earned
                    </span>
                  )}
                </div>
                <h4 className={`text-xl font-black mb-2 ${badge.earned ? 'text-white' : 'text-slate-500'}`}>{badge.title}</h4>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">{badge.desc}</p>
                
                {badge.earned && badge.earnedAt && (
                  <p className="mt-4 text-[10px] text-emerald-500/50 font-bold uppercase tracking-widest">
                    {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}
                
                {!badge.earned && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800" style={{ width: '0%' }} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-700 font-bold uppercase tracking-widest">Locked</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rank Progression */}
      <div className="bg-[#0A0A0A] border border-emerald-900/10 p-12 rounded-[50px] space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight">Rank <span className="text-emerald-500 italic">Progress</span></h3>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Reach 500 pts for ORACLE tier</p>
          </div>
          <div className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs">
            Rank: {currentTier}
          </div>
        </div>

        <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600" style={{ width: `${progressPct}%` }} />
          <div className="absolute inset-0 flex justify-between px-10 items-center">
            {tiers.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= currentTierIdx ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiers.map((rank, i) => (
            <div key={rank} className={`text-center space-y-2 ${currentTier === rank ? 'text-white' : 'text-slate-700'}`}>
              <div className="text-xs font-black uppercase tracking-widest">{rank}</div>
              {currentTier === rank && <div className="text-[10px] font-black text-emerald-500">Current Tier</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
