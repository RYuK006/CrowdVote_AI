import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, MapPin, CheckCircle, Clock, Settings, 
  RefreshCcw, AlertTriangle, ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    constituencyCount: 0,
    predictionCount: 0,
    userCount: 0,
    currentPhase: 'Pre-Election',
    predictionLocked: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch for now, will connect to backend
    setTimeout(() => {
      setStats({
        constituencyCount: 140,
        predictionCount: 12450,
        userCount: 1540,
        currentPhase: 'Campaign',
        predictionLocked: false
      });
      setLoading(true);
    }, 800);
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  const phaseOptions = ['Pre-Election', 'Campaign', 'Final', 'Exit-Poll', 'Post-Result'];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#111111] border border-emerald-900/30 p-6 rounded-2xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ShieldCheck className="text-emerald-500 w-10 h-10" />
              Admin Command Center
            </h1>
            <p className="text-gray-400">Kerala 2026 Election Management & Analytics</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
              <RefreshCcw className="w-4 h-4" /> Sync Data
            </button>
            <button className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border border-emerald-900/30 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
              <Settings className="w-4 h-4" /> Config
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Constituencies" 
            value={stats.constituencyCount} 
            icon={MapPin} 
            color="bg-emerald-500"
          />
          <StatCard 
            title="Verified Participants" 
            value={stats.userCount} 
            icon={Users} 
            color="bg-blue-500"
          />
          <StatCard 
            title="Total Predictions" 
            value={stats.predictionCount} 
            icon={CheckCircle} 
            color="bg-amber-500"
          />
          <StatCard 
            title="Current Election Phase" 
            value={stats.currentPhase} 
            icon={Clock} 
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phase Management */}
          <div className="lg:col-span-1 bg-[#111111] border border-emerald-900/30 p-8 rounded-2xl h-full">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Settings className="text-emerald-500" />
              Phase Architect
            </h3>
            
            <div className="space-y-4">
              {phaseOptions.map((phase) => (
                <button 
                  key={phase}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                    stats.currentPhase === phase 
                    ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' 
                    : 'bg-[#0A0A0A] border-emerald-900/10 text-gray-400 hover:border-emerald-900/40'
                  }`}
                >
                  {phase}
                  {stats.currentPhase === phase && <CheckCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex gap-3 text-amber-500">
                <AlertTriangle className="w-10 h-10 shrink-0" />
                <p className="text-sm">Changing the current phase will impact global prediction accessibility. Handle with caution.</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all">
              Lock All Predictions
            </button>
          </div>

          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-[#111111] border border-emerald-900/30 p-8 rounded-2xl min-h-[400px]">
            <h3 className="text-xl font-semibold mb-6">Prediction Convergence Trends</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Mon', predictions: 400 },
                  { name: 'Tue', predictions: 300 },
                  { name: 'Wed', predictions: 200 },
                  { name: 'Thu', predictions: 278 },
                  { name: 'Fri', predictions: 189 },
                  { name: 'Sat', predictions: 239 },
                  { name: 'Sun', predictions: 349 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #059669', borderRadius: '12px' }}
                  />
                  <Bar dataKey="predictions" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
