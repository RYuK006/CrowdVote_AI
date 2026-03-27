import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  sendPasswordResetEmail,
  linkWithPhoneNumber
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Smartphone, Mail, KeyRound, CheckCircle2, Phone } from 'lucide-react';
import { loginUser, registerUser, apiRequest } from '../lib/api';

const Auth = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode);
  const [authMethod, setAuthMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration step: 1 = email+password, 2 = phone OTP
  const [regStep, setRegStep] = useState(1);
  const [pendingUser, setPendingUser] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginUser({ email, password });
        localStorage.removeItem('adminUser');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/voting');
      } else if (mode === 'register') {
        if (regStep === 1) {
          // Step 1: Create account with email + password
          const uname = username.trim() || email.split('@')[0];
          const res = await registerUser({ username: uname, email, password });
          setPendingUser(res.data);
          localStorage.setItem('token', res.data.token);
          // Move to phone verification step
          setRegStep(2);
          setSuccess('Account created! Now verify your phone number.');
        } else if (regStep === 2) {
          // Step 2: Send phone OTP
          setupRecaptcha();
          const appVerifier = window.recaptchaVerifier;
          const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
          const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
          setConfirmationResult(result);
          setSuccess('OTP sent to ' + formatted);
        }
      } else {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Reset link sent to your email.');
      }
    } catch (err) {
      setError(err.message);
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      
      if (mode === 'register' && pendingUser) {
        // Save phone to backend
        const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        try {
          await apiRequest('/users/me/profile', {
            method: 'PUT',
            body: JSON.stringify({ phoneNumber: formatted })
          });
        } catch (e) {
          // Non-critical, continue
        }
        
        localStorage.removeItem('adminUser');
        localStorage.setItem('user', JSON.stringify({ ...pendingUser, phoneNumber: formatted }));
        navigate('/voting');
      } else {
        // Phone login flow
        navigate('/voting');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
      setConfirmationResult(result);
      setSuccess('OTP sent to ' + formatted);
    } catch (err) {
      setError(err.message);
      if (window.recaptchaVerifier) window.recaptchaVerifier = null;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');

      if (mode === 'register') {
        // Google register — still need phone verification
        const gUser = result.user;
        setPendingUser({ username: gUser.displayName, email: gUser.email, role: 'user' });
        setRegStep(2);
        setSuccess('Google account linked! Now verify your phone number.');
      } else {
        // Google login — go straight in
        localStorage.setItem('user', JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          role: 'user'
        }));
        navigate('/voting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setRegStep(1);
    setPendingUser(null);
    setConfirmationResult(null);
    setError('');
    setSuccess('');
    setPhoneNumber('');
    setVerificationCode('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] text-white font-inter overflow-hidden">
      {/* Left Side: Sovereign Motif */}
      <div className="hidden lg:flex relative bg-[#080808] border-r border-emerald-900/10 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <pattern id="auth-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
               <rect width="60" height="60" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
               <circle cx="30" cy="30" r="1.5" fill="#10b981" fillOpacity="0.1" />
             </pattern>
             <rect width="100%" height="100%" fill="url(#auth-pattern)" />
           </svg>
        </div>
        
        <div className="relative z-10 space-y-12 max-w-xl">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
             <ShieldCheck size={64} className="text-emerald-500 mb-8" />
             <h1 className="text-7xl font-black text-white leading-none tracking-tighter">
               The <span className="text-emerald-500 italic">Gate</span> of Kerala's Democracy.
             </h1>
          </motion.div>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Secure entry point for verified election archivists. Phone verification required to maintain electoral integrity.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-8">
             <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 space-y-2">
                <div className="text-3xl font-black text-emerald-500">OTP</div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phone Verified</div>
             </div>
             <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 space-y-2">
                <div className="text-3xl font-black text-emerald-500">One Vote</div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Per Phone Number</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0A0A0A] p-12 rounded-[50px] shadow-3xl border border-white/5 relative z-10"
        >
          {/* Mode Switcher */}
          {mode !== 'reset' && regStep === 1 && (
            <div className="flex bg-[#050505] p-1.5 rounded-2xl mb-12 border border-white/5">
              <button 
                onClick={() => { setMode('login'); resetAll(); }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-emerald-600 text-black shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMode('register'); resetAll(); }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-emerald-600 text-black shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                Register
              </button>
            </div>
          )}

          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight italic">
              {mode === 'login' ? 'Continue Sequence' 
                : mode === 'register' 
                  ? (regStep === 1 ? 'Initialize Node' : 'Verify Phone')
                  : 'Reset Protocol'}
            </h2>

            {/* Step indicator for registration */}
            {mode === 'register' && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${regStep >= 1 ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-600'}`}>1</div>
                <div className={`flex-1 h-0.5 ${regStep >= 2 ? 'bg-emerald-500' : 'bg-white/5'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${regStep >= 2 ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-600'}`}>2</div>
                <div className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Step {regStep}/2 — {regStep === 1 ? 'Credentials' : 'Phone OTP'}
                </div>
              </div>
            )}
            
            {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}
            {success && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">{success}</p>}

            <AnimatePresence mode="wait">
              {!confirmationResult ? (
                <motion.form 
                  key={`auth-form-${regStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={mode === 'login' && authMethod === 'phone' ? handlePhoneLogin : handleEmailAuth}
                >
                  {/* Login method selection */}
                  {mode === 'login' && (
                    <div className="flex gap-6 mb-4">
                      <button type="button" onClick={() => setAuthMethod('email')} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${authMethod === 'email' ? 'text-emerald-500' : 'text-slate-600'}`}>
                         <Mail size={14} /> Email Access
                      </button>
                      <button type="button" onClick={() => setAuthMethod('phone')} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${authMethod === 'phone' ? 'text-emerald-500' : 'text-slate-600'}`}>
                         <Smartphone size={14} /> OTP Node
                      </button>
                    </div>
                  )}

                  {/* Register Step 1: Username + Email + Password */}
                  {mode === 'register' && regStep === 1 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Name</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                          placeholder="Your Name" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" required minLength={6}
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                    </>
                  )}

                  {/* Register Step 2: Phone */}
                  {mode === 'register' && regStep === 2 && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number (with country code)</label>
                      <div className="flex gap-3">
                        <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 text-emerald-500 font-black text-sm shrink-0">+91</div>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="9876543210" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                      <p className="text-[10px] text-slate-600 font-bold mt-2">You'll receive an OTP to verify this number. This ensures one vote per citizen.</p>
                    </div>
                  )}

                  {/* Login: Email form */}
                  {mode === 'login' && authMethod === 'email' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Identifier</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="node@election-os.kl" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
                          <button type="button" onClick={() => setMode('reset')} className="text-[10px] font-black text-emerald-500 hover:underline uppercase tracking-widest">Recover?</button>
                        </div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" required
                          className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                      </div>
                    </>
                  )}

                  {/* Login: Phone form */}
                  {mode === 'login' && authMethod === 'phone' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Voter Phone (with +91)</label>
                      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 9876543210" required
                        className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                    </div>
                  )}

                  {/* Reset: Email form */}
                  {mode === 'reset' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Identifier</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com" required
                        className="w-full p-5 bg-[#050505] border border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all outline-none text-emerald-500 placeholder:text-slate-800 font-bold" />
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-black font-black py-5 rounded-[24px] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 mt-4"
                  >
                    {loading ? 'Processing...' 
                      : mode === 'reset' ? 'Send Reset Payload' 
                      : mode === 'login' ? 'Authorize Access' 
                      : regStep === 1 ? 'Continue to Phone Verify' 
                      : 'Send OTP'}
                    <ArrowRight size={16} />
                  </button>

                  {mode === 'reset' && (
                    <button type="button" onClick={() => setMode('login')} className="w-full text-[10px] font-black text-slate-500 hover:text-emerald-500 transition-all uppercase tracking-widest text-center mt-4">
                       Back to Authorization
                    </button>
                  )}
                </motion.form>
              ) : (
                <motion.form 
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center" 
                  onSubmit={handleVerifyOtp}
                >
                  <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">6-Digit OTP Sent to <br/><span className="text-emerald-500">{phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`}</span></p>
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
                    {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                  </button>
                  <button type="button" onClick={() => { setConfirmationResult(null); if (window.recaptchaVerifier) window.recaptchaVerifier = null; }} className="text-[10px] font-black text-slate-800 hover:text-emerald-500 transition-all uppercase tracking-widest">
                     Resend OTP
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="relative my-10">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-[#0A0A0A] px-6 text-slate-700">Third-Party Node</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading || (mode === 'register' && regStep === 2)}
              className="w-full bg-[#111] border border-white/5 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-4 hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="filter grayscale">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Neural Sync
            </button>
          </div>

          <div id="recaptcha-container"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
