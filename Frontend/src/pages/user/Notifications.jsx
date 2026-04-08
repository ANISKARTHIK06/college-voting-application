import React, { useState, useEffect } from 'react';
import http from '@/config/http';
import { toast } from 'react-hot-toast';
import { 
    Bell, CheckCheck, Trash2, Clock, Info, 
    AlertTriangle, Trophy, Vote, Megaphone,
    X, MailOpen, Mail, Filter
} from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread

    const fetchNotifications = async () => {
        try {
            const res = await http.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
            toast.error('Could not load alerts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await http.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const markAllRead = async () => {
        try {
            await http.put('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await http.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Alert removed');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const clearAll = async () => {
        if (!window.confirm('Are you sure you want to clear your entire notification history? This action cannot be undone.')) return;
        try {
            await http.delete('/notifications/clear-all');
            setNotifications([]);
            toast.success('Notification history cleared');
        } catch (error) {
            toast.error('Failed to clear list');
        }
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case 'election': return { icon: <Vote size={20} />, color: '#6366f1', label: 'Election' };
            case 'result':   return { icon: <Trophy size={20} />, color: '#f59e0b', label: 'Results' };
            case 'announcement': return { icon: <Megaphone size={20} />, color: '#ec4899', label: 'Broadcast' };
            case 'reminder': return { icon: <Clock size={20} />, color: '#10b981', label: 'Reminder' };
            default:         return { icon: <Info size={20} />, color: '#94a3b8', label: 'Alert' };
        }
    };

    const filtered = filter === 'unread' 
        ? notifications.filter(n => !n.isRead) 
        : notifications;

    return (
        <>
        <style>{`
            .nt-page { padding: 32px; min-height: 100vh; background: var(--bg-main); }
            .nt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
            .nt-title { font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .nt-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }
            
            .nt-actions { display: flex; align-items: center; gap: 12px; }
            .nt-filter-pill { display: flex; background: var(--bg-card); border: 1px solid var(--border); padding: 4px; border-radius: 14px; }
            .nt-pill { padding: 6px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; background: transparent; color: var(--text-muted); }
            .nt-pill.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }

            .nt-stack { display: flex; flex-direction: column; gap: 12px; }
            .nt-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; display: flex; padding: 24px; gap: 20px; position: relative; transition: 0.2s; }
            .nt-card:hover { transform: translateY(-2px); border-color: var(--primary); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
            .nt-card.unread { border-left: 4px solid var(--primary); }
            
            .nt-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .nt-content { flex: 1; min-width: 0; }
            .nt-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .nt-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text-main); }
            .nt-time { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
            .nt-msg { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; }
            
            .nt-footer { display: flex; gap: 16px; }
            .nt-btn { font-size: 0.75rem; font-weight: 700; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
            .nt-btn.read { color: var(--primary); }
            .nt-btn.del { color: var(--danger); opacity: 0.6; }
            .nt-btn:hover { text-decoration: underline; opacity: 1; }
            
            .nt-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); position: absolute; top: 24px; right: 24px; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

            .nt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 24px; text-align: center; background: var(--bg-card); border: 2px dashed var(--border); border-radius: 32px; }
            .nt-empty-icon { width: 80px; height: 80px; background: rgba(99,102,241,0.05); color: var(--primary); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        `}</style>

        <div className="nt-page">
            <div className="nt-header">
                <div>
                    <h1 className="nt-title">Notifications</h1>
                    <p className="nt-subtitle">Stay updated with institution alerts, results, and reminders.</p>
                </div>
                <div className="nt-actions">
                    <div className="nt-filter-pill">
                        <button className={`nt-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`nt-pill ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread</button>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
                            <CheckCheck size={16} style={{ marginRight: 8 }} /> Mark all read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }} onClick={clearAll}>
                            <Trash2 size={16} style={{ marginRight: 8 }} /> Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="nt-stack">
                {loading ? (
                    <div className="nt-empty" style={{ border: 'none' }}>
                        <div className="spinner" />
                        <p style={{ marginTop: 20, fontWeight: 600, color: 'var(--text-muted)' }}>Synching with the cloud...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    filtered.map((n, i) => {
                        const config = getTypeConfig(n.type);
                        return (
                            <div key={n._id} className={`nt-card animate-slideUp ${!n.isRead ? 'unread' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="nt-icon-box" style={{ background: `${config.color}15`, color: config.color }}>
                                    {config.icon}
                                </div>
                                <div className="nt-content">
                                    <div className="nt-top">
                                        <h4 className="nt-card-title">{n.title}</h4>
                                        <span className="nt-time">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="nt-msg">{n.description}</p>
                                    <div className="nt-footer">
                                        {!n.isRead && (
                                            <button className="nt-btn read" onClick={() => markAsRead(n._id)}>
                                                <MailOpen size={14} /> Mark as read
                                            </button>
                                        )}
                                        <button className="nt-btn del" onClick={() => deleteNotification(n._id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                                {!n.isRead && <div className="nt-dot" />}
                            </div>
                        );
                    })
                ) : (
                    <div className="nt-empty">
                        <div className="nt-empty-icon">
                            <Bell size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Quiet for now</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 300, marginTop: 8 }}>
                            {filter === 'unread' ? "You've read all your recent notifications." : "We'll alert you here when new results or elections are posted."}
                        </p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Notifications;
