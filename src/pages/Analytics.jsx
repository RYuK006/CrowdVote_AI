import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, Award, BarChart3, 
  Map, Calendar, ArrowRight, Zap, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getMyStats } from '../lib/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    if (!storedUser) {
      navigate('/signin');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getMyStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Loading Intelligence</p>
    </div>
  );

  if (error) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <p className="text-red-500 text-sm font-bold">{error}</p>
      <button onClick={fetchStats} className="text-emerald-500 text-xs font-bold underline">Retry</button>
    </div>
  );

  if (!stats) return null;

  const StatCard = ({ title, value, detail, icon: Icon }) => (
    <div className="bg-[#111111] border border-emerald-900/20 p-8 rounded-3xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-6 group-hover:bg-emerald-500/20 transition-colors">
          <Icon className="text-emerald-500 w-6 h-6" />
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-4xl font-black text-white mb-2">{value}</h3>
        <p className="text-emerald-500/60 text-xs font-bold">{detail}</p>
      </div>
      <Icon className="absolute -bottom-6 -right-6 text-white/5 w-32 h-32 group-hover:text-emerald-500/5 transition-colors" />
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
            Intelligence Pulse
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Your <span className="text-emerald-500 italic">Accuracy</span> Meta.</h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">Tracking your swarm-intelligence contribution across the Kerala 2026 electoral landscape.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Predictions Made" 
          value={stats.predictionsMade} 
          detail={`${stats.constituenciesPredicted}/140 seats covered`}
          icon={Target} 
        />
        <StatCard 
          title="Global Ranking" 
          value={`#${stats.rankPosition}`} 
          detail={`Top ${stats.rankPercentile}% of ${stats.totalUsers} users`}
          icon={Award} 
        />
        <StatCard 
          title="Influence Points" 
          value={stats.influencePoints.toLocaleString()} 
          detail={`Rank score: ${stats.rankScore}`}
          icon={TrendingUp} 
        />
        <StatCard 
          title="Districts Covered" 
          value={`${stats.districtsCovered}/14`} 
          detail={`${stats.constituenciesPredicted} constituencies`}
          icon={Map} 
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prediction Activity Chart */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <BarChart3 className="text-emerald-500" />
              Prediction Activity
            </h3>
          </div>
          
          {stats.chartData && stats.chartData.length > 0 ? (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#333" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800 }} dy={10} />
                  <YAxis stroke="#333" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #10B981', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#10B981', fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="predictions" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorPred)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <BarChart3 className="mx-auto text-slate-800" size={48} />
                <p className="text-slate-600 text-sm font-bold">No predictions yet. Start voting to see your activity chart.</p>
              </div>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-[#0A0A0A] border border-emerald-900/10 p-10 rounded-[40px] flex flex-col">
          <h3 className="text-2xl font-black tracking-tight mb-8">Electoral <span className="text-emerald-500 italic">Milestones</span></h3>
          <div className="space-y-6 flex-1">
            {stats.milestones.map((mod, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">{mod.title}</span>
                  <span className="font-black text-emerald-500">{mod.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${mod.progress >= 100 ? 'bg-emerald-500' : 'bg-emerald-500/40'}`} style={{ width: `${mod.progress}%` }} />
                </div>
                <p className="text-[10px] text-slate-600 font-bold uppercase">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
