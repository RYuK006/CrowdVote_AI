import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, AlertTriangle, 
  Info, Zap, Loader2, Trash2, CheckCheck,
  InboxIcon
} from 'lucide-react';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications 
} from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    if (!storedUser) { navigate('/signin'); return; }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteNotification(id);
      const wasUnread = notifications.find(n => n._id === id && !n.read);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'prediction': return <CheckCircle2 className="text-emerald-500" />;
      case 'phase': return <AlertTriangle className="text-amber-500" />;
      case 'badge': return <Zap className="text-purple-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Loading Feed</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-end border-b border-emerald-900/10 pb-10">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Command <span className="text-emerald-500 italic">Feed</span>.</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · {notifications.length} total
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 hover:bg-emerald-500/20 transition-all" title="Mark all read">
              <CheckCheck size={20} />
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={handleDeleteAll} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all" title="Clear all">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center">
            <Bell className="text-slate-700" size={32} />
          </div>
          <p className="text-slate-600 font-bold text-sm">No notifications yet. Start predicting to get updates!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div 
              key={note._id} 
              className={`p-6 md:p-8 rounded-[32px] border transition-all relative group flex gap-4 md:gap-6 ${
                note.read 
                ? 'bg-transparent border-white/5 opacity-60 hover:opacity-100 hover:border-emerald-900/10' 
                : 'bg-[#0A0A0A] border-emerald-500/20 shadow-xl shadow-emerald-500/5'
              }`}
            >
              <div className="shrink-0 mt-1">
                <div className="p-3 bg-white/5 rounded-2xl">
                  {getIcon(note.type)}
                </div>
              </div>
              
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className={`text-base md:text-lg font-black uppercase tracking-tight truncate ${note.read ? 'text-slate-300' : 'text-white'}`}>
                    {note.title}
                  </h4>
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest shrink-0">
                    {timeAgo(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{note.message}</p>
              </div>

              <div className="shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!note.read && (
                  <button onClick={() => handleMarkRead(note._id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" title="Mark read">
                    <CheckCircle2 size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(note._id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>

              {!note.read && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 group-hover:hidden" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
