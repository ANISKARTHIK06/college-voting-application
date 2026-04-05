import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Dashboard.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read');
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Failed to delete notification');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'election': return '🗳️';
            case 'result': return '🏆';
            case 'reminder': return '⏰';
            default: return '🔔';
        }
    };

    const filteredNotifications = filter === 'unread' 
        ? notifications.filter(n => !n.isRead) 
        : notifications;

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader-spinner"></div>
                <p className="loader-text">Retrieving your secure alerts...</p>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notification Center</h1>
                    <p className="page-subtitle">Platform alerts, election reminders, and governance updates</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-secondary btn-sm" onClick={markAllRead}>Mark All as Read</button>
                    <div className="filter-group" style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <button 
                            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            </div>

            <div className="notifications-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredNotifications.length > 0 ? filteredNotifications.map((n, i) => (
                    <div 
                        key={n._id} 
                        className={`notification-item glass-panel animate-slideUp ${!n.isRead ? 'unread' : ''}`}
                        style={{ 
                            animationDelay: `${i * 0.05}s`,
                            display: 'flex',
                            gap: '20px',
                            padding: '24px',
                            borderLeft: !n.isRead ? '4px solid var(--primary)' : 'none',
                            position: 'relative'
                        }}
                    >
                        <div className="notification-icon" style={{ 
                            width: '48px', 
                            height: '48px', 
                            background: !n.isRead ? 'var(--primary-glow)' : 'var(--bg-main)', 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            flexShrink: 0
                        }}>
                            {getIcon(n.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h4 style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{n.title}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '800px' }}>{n.description}</p>
                            
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                {!n.isRead && (
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '0', fontSize: '0.8rem', color: 'var(--primary)' }} onClick={() => markAsRead(n._id)}>
                                        Mark as read
                                    </button>
                                )}
                                <button className="btn btn-ghost btn-sm" style={{ padding: '0', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => deleteNotification(n._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                        {!n.isRead && <div style={{ position: 'absolute', top: '24px', right: '24px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>}
                    </div>
                )) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔕</div>
                        <p className="empty-state-text">You're all caught up! No recent notifications to show.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
