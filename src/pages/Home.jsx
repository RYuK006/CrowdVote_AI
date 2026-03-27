import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Target, Map, Users, ChevronRight, ShieldCheck, Zap, BarChart3, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
   return (
      <div className="min-h-screen bg-[#050505] text-white font-inter overflow-hidden">
         {/* Top Navigation */}
         <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
               <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                     <ShieldCheck size={24} />
                  </div>
                  CrowdVote <span className="text-emerald-500 italic">OS</span>
               </div>
               <div className="flex items-center gap-6">
                  <Link to="/signin?mode=register" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Live Predictions</Link>
                  <Link to="/signin?mode=register" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-black font-black uppercase tracking-[0.15em] text-[10px] rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                     Join the Swarm <ArrowRight size={14} />
                  </Link>
               </div>
            </div>
         </nav>

         {/* Sovereign Hero Section */}
         <section className="relative pt-16 pb-20 overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2 space-y-10">
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-6"
                  >
                     <div className="flex items-center gap-3">
                        <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                           Electoral Swarm Sovereignty
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">v2.0 Emerald Intelligence</span>
                     </div>
                     <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                        The <span className="text-emerald-500 italic">Pulse</span> of<br />
                        Kerala's Heart.
                     </h1>
                     <p className="text-xl text-slate-400 max-w-xl font-medium leading-relaxed">
                        Harnessing peer-verified swarm intelligence to simulate the 2026 Kerala Assembly Elections with unprecedented accuracy.
                     </p>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="flex flex-wrap gap-6 pt-4"
                  >
                     <Link to="/signin" className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-3 active:scale-95">
                        Join the Swarm <ArrowRight size={18} />
                     </Link>
                     <Link to="/arena" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all active:scale-95">
                        Live Predictions
                     </Link>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.6 }}
                     className="flex items-center gap-8 pt-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all"
                  >
                     <div className="space-y-1">
                        <div className="text-2xl font-black">2.4M</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Predictions Synced</div>
                     </div>
                     <div className="w-px h-10 bg-white/10" />
                     <div className="space-y-1">
                        <div className="text-2xl font-black">140</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Constituencies Loaded</div>
                     </div>
                  </motion.div>
               </div>

               {/* Map / Visual Section */}
               <div className="lg:w-1/2 relative">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                     animate={{ opacity: 1, scale: 1, rotate: 0 }}
                     transition={{ duration: 1 }}
                     className="relative z-10 bg-[#0A0A0A] border border-emerald-900/20 p-8 rounded-[60px] shadow-3xl shadow-emerald-500/5 rotate-3 hover:rotate-0 transition-transform duration-700"
                  >
                     <img
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Kerala-map-en.svg"
                        alt="Kerala Assembly Map"
                        className="w-full h-auto filter invert brightness-150 contrast-125 saturate-200"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
                     <div className="absolute bottom-12 left-12 right-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex justify-between items-center">
                        <div>
                           <h4 className="font-black text-emerald-500 uppercase tracking-widest text-[10px]">Active Hotspot</h4>
                           <p className="text-lg font-black italic">Trivandrum City</p>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-black">94%</div>
                           <div className="text-[10px] font-bold text-slate-500 uppercase">Consensus</div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
               </div>
            </div>
         </section>

         {/* Feature Grid: Emergent Intelligence */}
         <section className="py-32 bg-[#080808] border-y border-emerald-900/10">
            <div className="container mx-auto px-6">
               <div className="max-w-3xl mb-20 space-y-6">
                  <h2 className="text-5xl font-black tracking-tighter">Emergent <span className="text-emerald-500 italic">Forecasting</span>.</h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">We don't just aggregate votes. We simulate electoral outcomes using high-fidelity historical layering and peer-verified swarm telemetry.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { title: 'Swarm Intelligence', desc: 'Weighted prediction models based on user accuracy history and demographic correlation.', icon: Zap },
                     { title: 'Archival Integrity', desc: 'Direct integration with Kerala 2021 master data ensuring historical accuracy benchmarks.', icon: Database },
                     { title: 'Real-time Analytics', desc: 'Predictive vectors that update as new information flows through the democratic swarm.', icon: BarChart3 },
                  ].map((feat, i) => (
                     <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] hover:border-emerald-500/30 transition-all group">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit mb-8 group-hover:bg-emerald-500/20 transition-colors">
                           <feat.icon className="text-emerald-500 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feat.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Footer / CTA */}
         <section className="py-32 container mx-auto px-6 text-center space-y-12">
            <div className="space-y-6">
               <ShieldCheck className="text-emerald-500 w-16 h-16 mx-auto mb-8" />
               <h2 className="text-6xl font-black tracking-tighter">Ready to <span className="text-emerald-500 italic">Impact</span> the Swarm?</h2>
               <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto">Join the elite rank of electoral archivists and shape the 2026 forecast.</p>
            </div>
            <div className="pt-8 flex justify-center gap-6">
               <Link to="/signin" className="px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-3xl shadow-emerald-500/40 active:scale-95">
                  Authenticate Access
               </Link>
            </div>
         </section>

         <footer className="py-12 border-t border-emerald-900/10 container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
               <ShieldCheck className="text-emerald-500" size={24} />
               CrowdVote <span className="text-emerald-500 italic">OS</span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <Link to="/signin?mode=register" className="hover:text-emerald-500 transition-colors">Documentation</Link>
               <Link to="/signin?mode=register" className="hover:text-emerald-500 transition-colors">Methodology</Link>
               <Link to="/signin?mode=register" className="hover:text-emerald-500 transition-colors">Privacy Alpha</Link>
            </div>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">© 2026 Electoral Swarm Lab</p>
         </footer>
      </div>
   );
};


export default Home;
