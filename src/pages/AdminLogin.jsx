import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../lib/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#10b98108_0%,_transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#0A0A0A] border border-white/5 p-12 rounded-[50px] shadow-3xl relative z-10"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <ShieldCheck className="text-emerald-500 w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Admin <span className="text-emerald-500">Command</span></h1>
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Restricted Access Protocol</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin ID (Email)</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin.terminal@election-os.kl" 
                required
                className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Passkey</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                required
                className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" 
              />
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800" size={18} />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-emerald-600 text-black font-black py-6 rounded-[24px] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Authorize Command Access'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/auth')}
            className="text-[10px] font-black text-slate-600 hover:text-emerald-500 transition-all uppercase tracking-widest"
          >
            Return to Standard Node
          </button>
        </div>
      </motion.div>

      {/* Security Footer */}
      <div className="absolute bottom-10 text-center w-full">
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">System-ID: KERALA-OS-v2.0-CORE</p>
      </div>
    </div>
  );
};

export default AdminLogin;
