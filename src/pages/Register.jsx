import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Smartphone, User } from 'lucide-react';
import { phoneAuth } from '../lib/api';

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Phone & Name, 2 = OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full Name is strictly required to register.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
      setConfirmationResult(result);
      setSuccess('OTP sent to ' + formatted);
      setStep(2);
    } catch (err) {
      setError(err.message);
      if (window.recaptchaVerifier) window.recaptchaVerifier = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const token = await result.user.getIdToken();
      
      const res = await phoneAuth({ token, fullName, action: 'register' });
      localStorage.removeItem('adminUser');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/voting');
    } catch (err) {
      if (err.code && err.code.includes('invalid-verification-code')) {
         setError('Invalid OTP. Please try again.');
      } else {
         setError('Registration failed: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setConfirmationResult(null);
    setVerificationCode('');
    setError('');
    setSuccess('');
    if (window.recaptchaVerifier) window.recaptchaVerifier = null;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] text-white font-inter overflow-hidden">
      {/* Left Side: Motif */}
      <div className="hidden lg:flex relative bg-[#080808] border-r border-emerald-900/10 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <pattern id="auth-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
               <rect width="60" height="60" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
             </pattern>
             <rect width="100%" height="100%" fill="url(#auth-pattern)" />
           </svg>
        </div>
        
        <div className="relative z-10 space-y-12 max-w-xl">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
             <ShieldCheck size={64} className="text-emerald-500 mb-8" />
             <h1 className="text-7xl font-black text-white leading-none tracking-tighter">
               Join <span className="text-emerald-500 italic">The Swarm.</span>
             </h1>
          </motion.div>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Register your identity to participate in Kerala's prediction arena. Your phone number verifies your unique citizen vote.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 relative w-full h-full max-w-xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#0A0A0A] p-12 rounded-[50px] shadow-3xl border border-white/5 relative z-10"
        >
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight italic">
              {step === 1 ? 'New Connection' : 'Verify Identity'}
            </h2>
            
            {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}
            {success && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">{success}</p>}

            <AnimatePresence mode="wait">
              {/* Step 1: Phone & Full Name */}
              {step === 1 && (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={handleSendOtp}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} /> Full Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        placeholder="Oommen Chandy" required
                        className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      <p className="text-[10px] text-slate-600 font-bold italic">Will appear on the global leaderboard.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={14} /> Voter Phone Number
                      </label>
                      <div className="flex gap-3">
                        <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 text-emerald-500 font-black text-sm shrink-0">+91</div>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="9876543210" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={loading || !fullName.trim() || !phoneNumber.trim()}
                    className="w-full bg-emerald-600 text-black font-black py-5 rounded-[24px] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 mt-4"
                  >
                    {loading ? 'Processing...' : 'Send Verification OTP'}
                    <ArrowRight size={16} />
                  </button>
                </motion.form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6 text-center" 
                  onSubmit={handleVerifyOtp}
                >
                   <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Hello, {fullName}.<br/><br/>6-Digit OTP Sent to <span className="text-emerald-500">{phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`}</span></p>
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000" 
                    className="w-full p-6 bg-[#050505] border border-emerald-500/40 rounded-[24px] focus:border-emerald-500 transition-all text-center text-4xl font-black tracking-[0.5em] outline-none text-emerald-500 shadow-2xl shadow-emerald-500/10" 
                    required
                    maxLength={6}
                  />
                  <button 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-black font-black py-5 rounded-[24px] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                  >
                    {loading ? 'Verifying...' : 'Register & Enter'}
                  </button>
                  <button type="button" onClick={resetFlow} className="text-[10px] font-black text-slate-800 hover:text-emerald-500 transition-all uppercase tracking-widest mt-2 block mx-auto">
                     Change Details
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div id="recaptcha-container"></div>
        </motion.div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center relative z-10 border-t border-white/5 pt-8 w-full max-w-md">
            <p className="text-slate-500 text-sm font-medium">
              Already initialized?{' '}
              <Link to="/signin" className="text-emerald-500 font-bold hover:underline transition-all">Resume Connection</Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Register;
