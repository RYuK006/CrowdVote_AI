import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Key, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getMe, updateProfile, changePassword, deleteAccount } from '../lib/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', phoneNumber: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem('user') || localStorage.getItem('adminUser');
    if (!s) { navigate('/signin'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      setForm({ username: res.data.username, email: res.data.email, phoneNumber: res.data.phoneNumber || '' });
    } catch {
      const s = JSON.parse(localStorage.getItem('user') || localStorage.getItem('adminUser') || '{}');
      setUser(s);
      setForm({ username: s.username || '', email: s.email || '', phoneNumber: s.phoneNumber || '' });
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      const k = res.data.role === 'admin' ? 'adminUser' : 'user';
      const old = JSON.parse(localStorage.getItem(k) || '{}');
      localStorage.setItem(k, JSON.stringify({ ...old, ...form }));
      setMsg({ ok: true, text: 'Profile updated' });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setSaving(false); }
  };

  const handlePw = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { setMsg({ ok: false, text: 'Fill both fields' }); return; }
    setChangingPw(true); setMsg(null);
    try { await changePassword(pwForm); setMsg({ ok: true, text: 'Password changed' }); setPwForm({ currentPassword: '', newPassword: '' }); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setChangingPw(false); }
  };

  const handleDelete = async () => {
    try { await deleteAccount(); localStorage.clear(); navigate('/'); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;
  if (!user) return null;

  const initials = (user.username || 'U').slice(0, 2).toUpperCase();
  const joined = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-[#0A0A0A] border border-emerald-900/10 p-12 rounded-[50px]">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 bg-emerald-500 rounded-[32px] flex items-center justify-center text-black text-5xl font-black">{initials}</div>
          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{user.role === 'admin' ? 'System Architect' : 'Swarm Expert'}</span>
              <span className="px-4 py-1.5 bg-white/5 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Joined {joined}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">{user.username}</h1>
            <p className="text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold ${msg.ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {msg.ok ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>} {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3"><User className="text-emerald-500"/>Identity Center</h3>
          <div className="space-y-6">
            {[['Username','text','username'],['Email','email','email'],['Phone','text','phoneNumber']].map(([l,t,k])=>(
              <div key={k} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full bg-[#050505] border border-white/5 p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"/>
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            {saving?<Loader2 size={16} className="animate-spin"/>:<Save size={16}/>} {saving?'Saving...':'Update Identity'}
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-3"><Shield className="text-emerald-500"/>Security</h3>
            {[['Current Password','currentPassword'],['New Password','newPassword']].map(([l,k])=>(
              <div key={k} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{l}</label>
                <input type="password" value={pwForm[k]} onChange={e=>setPwForm({...pwForm,[k]:e.target.value})} className="w-full bg-[#050505] border border-white/5 p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"/>
              </div>
            ))}
            <button onClick={handlePw} disabled={changingPw} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              {changingPw?<Loader2 size={16} className="animate-spin"/>:<Key size={16} className="text-emerald-500"/>} {changingPw?'Changing...':'Change Password'}
            </button>
          </div>
          <div className="bg-red-950/10 border border-red-900/20 p-10 rounded-[40px] space-y-6">
            <h3 className="text-2xl font-black text-red-500">Danger Zone</h3>
            <p className="text-xs font-bold text-slate-500 uppercase">Permanently delete your account. This cannot be undone.</p>
            {!confirmDelete?(
              <button onClick={()=>setConfirmDelete(true)} className="w-full py-4 border border-red-900/30 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500/10 flex items-center justify-center gap-2"><Trash2 size={16}/>Delete Account</button>
            ):(
              <div className="flex gap-3">
                <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-xs uppercase">Confirm</button>
                <button onClick={()=>setConfirmDelete(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-black text-xs uppercase">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
