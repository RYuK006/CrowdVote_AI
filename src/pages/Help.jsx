import React from 'react';
import { 
  HelpCircle, Book, Shield, 
  Terminal, Globe, Mail, 
  ChevronRight, ExternalLink, Scale,
  Info, Cpu, Target
} from 'lucide-react';

const Help = () => {
  const sections = [
    { title: 'The Swarm Methodology', desc: 'How CrowdVote AI calibrates consensus through weighted user accuracy and demographic interpolation.', icon: Cpu },
    { title: 'Archival Integrity', desc: 'Our integration with the 2021 Election Commission master data for historical benchmarking.', icon: Book },
    { title: 'Predictability Score (PS)', desc: 'Understanding the formula behind your personal accuracy index and global ranking.', icon: Target },
    { title: 'Privacy Protocol', desc: 'How we anonymize your simulation data while maintaining electoral integrity.', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 pt-28">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                Support & Documentation
              </span>
           </div>
           <h1 className="text-7xl font-black tracking-tighter">Technical <span className="text-emerald-500 italic">Meta</span>.</h1>
           <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl">Dive into the mechanics of the Kerala 2026 electoral swarm intelligence platform.</p>
        </div>

        {/* Documentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {sections.map((sec, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] hover:border-emerald-500/30 transition-all group">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit mb-6 group-hover:bg-emerald-500/20 transition-colors">
                    <sec.icon className="text-emerald-500 w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{sec.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed text-sm mb-6">{sec.desc}</p>
                 <button className="flex items-center gap-2 text-xs font-black text-emerald-500 hover:gap-4 transition-all">
                    Read Document <ChevronRight size={14} />
                 </button>
              </div>
           ))}
        </div>

        {/* FAQ Accordion Placeholder */}
        <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[50px] space-y-10">
           <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <HelpCircle className="text-emerald-500" />
              Frequently Asked
           </h3>
           <div className="space-y-4">
              {[
                'How often are the consensus trends updated?',
                'Can I change my prediction after submission?',
                'How are the influence points calculated?',
                'What happens if my prediction is extremely accurate?'
              ].map((q, i) => (
                <div key={i} className="p-6 bg-[#050505] border border-white/5 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-emerald-500/20 transition-all">
                   <span className="font-bold text-slate-300">{q}</span>
                   <ChevronRight className="text-slate-800 group-hover:text-emerald-500" size={20} />
                </div>
              ))}
           </div>
        </div>

        {/* Contact Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-emerald-600 rounded-[40px] text-black space-y-4 flex flex-col justify-between shadow-2xl shadow-emerald-600/20">
              <h3 className="text-3xl font-black leading-tight">Need direct <br/> intelligence sync?</h3>
              <p className="font-bold opacity-80 uppercase text-xs tracking-tight">Our technical team is available for high-tier integration queries.</p>
              <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                 <Mail size={16} /> Contact Swarm Lab
              </button>
           </div>
           
           <div className="p-10 bg-[#111] border border-white/5 rounded-[40px] space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-3">
                 <Scale className="text-emerald-500" />
                 Ethical Meta
              </h3>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <li className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"><ExternalLink size={14} /> Neural Integrity Policy</li>
                 <li className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"><ExternalLink size={14} /> Open Data Standard</li>
                 <li className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"><ExternalLink size={14} /> Swarm Neutrality Act</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
