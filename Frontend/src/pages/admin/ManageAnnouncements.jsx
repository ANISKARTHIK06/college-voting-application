import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    Megaphone, Search, Trash2, AlertCircle, Clock,
    History, X, Target, Shield, Bell, Globe,
    ChevronRight, Archive, Plus, Users, CheckCircle
} from 'lucide-react';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showCreate, setShowCreate] = useState(false);
    const [showAudit, setShowAudit] = useState(false);
    const [auditData, setAuditData] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Normal',
        targetType: 'Global',
        targetValues: ''
    });

    useEffect(() => { fetchAnnouncements(); }, [filter]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            let url = 'http://localhost:5000/api/announcements';
            if (filter === 'Archived') url += '?isArchived=true';
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setAnnouncements(res.data);
        } catch {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditHistory = async (announcement) => {
        try {
            setSelectedAnnouncement(announcement);
            setShowAudit(true);
            setAuditLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/announcements/${announcement._id}/revisions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuditData(res.data);
        } catch {
            toast.error('Failed to load revision history');
        } finally {
            setAuditLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                targetValues: formData.targetValues.split(',').map(v => v.trim()).filter(v => v)
            };
            await axios.post('http://localhost:5000/api/announcements', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Announcement published successfully!');
            setShowCreate(false);
            setFormData({ title: '', description: '', priority: 'Normal', targetType: 'Global', targetValues: '' });
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Archive this announcement?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Archived successfully');
            fetchAnnouncements();
        } catch {
            toast.error('Failed to archive');
        }
    };

    const TABS = ['All', 'Global', 'Targeted', 'Archived'];

    const filtered = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.description.toLowerCase().includes(search.toLowerCase());
        if (filter === 'All') return matchesSearch;
        if (filter === 'Archived') return matchesSearch;
        if (filter === 'Global') return matchesSearch && a.targetType === 'Global';
        if (filter === 'Targeted') return matchesSearch && a.targetType !== 'Global';
        return matchesSearch;
    });

    const stats = [
        { label: 'Total', value: announcements.length, icon: Bell, color: 'var(--primary)' },
        { label: 'Global', value: announcements.filter(a => a.targetType === 'Global').length, icon: Globe, color: 'var(--accent)' },
        { label: 'Targeted', value: announcements.filter(a => a.targetType !== 'Global').length, icon: Target, color: 'var(--secondary)' },
        { label: 'Urgent', value: announcements.filter(a => a.priority === 'Important').length, icon: AlertCircle, color: 'var(--danger)' },
    ];

    return (
        <>
            <style>{`
                .ann-page { min-height: 100vh; background: var(--bg-main); padding: 32px; }
                .ann-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 16px; flex-wrap: wrap; }
                .ann-title { font-size: 2rem; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.03em; }
                .ann-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; font-weight: 500; }
                .ann-compose-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 14px; font-weight: 700; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(99,102,241,0.35); white-space: nowrap; }
                .ann-compose-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.45); }
                .ann-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
                @media (max-width: 768px) { .ann-stats { grid-template-columns: repeat(2,1fr); } }
                .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s; }
                .stat-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.1); }
                .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .stat-val { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main); line-height: 1; }
                .stat-label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
                .ann-toolbar { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 12px; margin-bottom: 24px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
                .tab-group { display: flex; background: var(--bg-main); border-radius: 12px; padding: 4px; gap: 2px; }
                .tab-btn { padding: 8px 18px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; border: none; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.18s; white-space: nowrap; }
                .tab-btn.active { background: white; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .tab-btn:hover:not(.active) { color: var(--text-main); background: var(--border-subtle); }
                .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; }
                .search-box input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.875rem; color: var(--text-main); font-family: var(--font-body); }
                .search-box input::placeholder { color: var(--text-muted); }
                .search-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
                /* Cards */
                .announcements-list { display: flex; flex-direction: column; gap: 16px; }
                .ann-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; display: flex; transition: all 0.25s; position: relative; }
                .ann-card:hover { border-color: var(--primary); box-shadow: 0 8px 32px rgba(99,102,241,0.12); transform: translateY(-2px); }
                .ann-card-stripe { width: 4px; flex-shrink: 0; }
                .ann-card-body { flex: 1; padding: 24px 28px; display: flex; gap: 20px; align-items: flex-start; }
                .ann-card-icon-wrap { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .ann-card-content { flex: 1; min-width: 0; }
                .ann-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
                .badge-urgent { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 6px; background: rgba(239,68,68,0.12); color: var(--danger); border: 1px solid rgba(239,68,68,0.25); }
                .badge-targeted { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 6px; background: rgba(168,85,247,0.12); color: var(--secondary); border: 1px solid rgba(168,85,247,0.25); }
                .badge-global { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 6px; background: rgba(6,182,212,0.12); color: var(--accent); border: 1px solid rgba(6,182,212,0.25); }
                .ann-card-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .ann-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
                .ann-meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .ann-card-actions { display: flex; flex-direction: column; gap: 8px; padding: 20px 20px 20px 0; align-items: center; flex-shrink: 0; }
                .icon-btn { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--bg-main); color: var(--text-muted); cursor: pointer; transition: all 0.18s; }
                .icon-btn:hover.audit { background: rgba(168,85,247,0.1); border-color: var(--secondary); color: var(--secondary); }
                .icon-btn:hover.delete { background: rgba(239,68,68,0.1); border-color: var(--danger); color: var(--danger); }
                /* Empty State */
                .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 16px; text-align: center; background: var(--bg-card); border: 2px dashed var(--border); border-radius: 24px; }
                .empty-icon { width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1)); display: flex; align-items: center; justify-content: center; }
                /* Loading */
                .loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 24px; }
                .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                /* Drawer */
                .drawer-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; justify-content: flex-end; animation: fadeIn 0.2s ease; }
                .drawer { background: var(--bg-sidebar); height: 100%; width: 100%; max-width: 520px; border-left: 1px solid var(--border); display: flex; flex-direction: column; animation: slideLeft 0.3s cubic-bezier(0.16,1,0.3,1); }
                @keyframes slideLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .drawer-header { padding: 28px 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .drawer-title { font-size: 1.25rem; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); }
                .drawer-subtitle { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; font-weight: 500; }
                .close-btn { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-main); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: all 0.18s; }
                .close-btn:hover { background: rgba(239,68,68,0.1); border-color: var(--danger); color: var(--danger); }
                .drawer-body { flex: 1; overflow-y: auto; padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }
                .form-field { display: flex; flex-direction: column; gap: 8px; }
                .form-lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); }
                .form-ctrl { width: 100%; padding: 12px 16px; background: var(--bg-main); border: 1.5px solid var(--border); border-radius: 12px; color: var(--text-main); font-size: 0.9rem; font-family: var(--font-body); outline: none; transition: all 0.18s; }
                .form-ctrl:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .form-ctrl::placeholder { color: var(--text-muted); opacity: 0.7; }
                textarea.form-ctrl { resize: none; line-height: 1.6; }
                select.form-ctrl { cursor: pointer; }
                .targeting-box { background: var(--bg-main); border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
                .targeting-box-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
                .priority-group { display: flex; gap: 10px; }
                .priority-btn { flex: 1; padding: 12px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg-main); font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.18s; color: var(--text-muted); }
                .priority-btn.active-normal { background: rgba(99,102,241,0.1); border-color: var(--primary); color: var(--primary); }
                .priority-btn.active-important { background: rgba(239,68,68,0.1); border-color: var(--danger); color: var(--danger); }
                .priority-btn:hover:not([class*="active"]) { background: var(--border-subtle); color: var(--text-main); }
                .submit-btn { width: 100%; padding: 15px; border-radius: 14px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
                .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
                .audit-note { display: flex; align-items: center; gap: 6px; justify-content: center; padding: 12px; background: var(--bg-main); border-radius: 10px; border: 1px solid var(--border); margin-top: 4px; }
                /* Modal */
                .modal-overlay { position: fixed; inset: 0; z-index: 250; background: rgba(0,0,0,0.75); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
                .modal { background: var(--bg-sidebar); width: 100%; max-width: 680px; border-radius: 28px; border: 1px solid var(--border); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 32px 96px rgba(0,0,0,0.4); }
                .modal-header { padding: 28px 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .modal-body { flex: 1; overflow-y: auto; padding: 28px 32px; }
                .timeline { position: relative; padding-left: 32px; display: flex; flex-direction: column; gap: 24px; }
                .timeline::before { content: ''; position: absolute; left: 10px; top: 12px; bottom: 12px; width: 2px; background: linear-gradient(to bottom, var(--primary), var(--secondary), transparent); opacity: 0.3; }
                .timeline-item { position: relative; }
                .timeline-dot { position: absolute; left: -26px; top: 4px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid var(--bg-sidebar); z-index: 1; }
                .timeline-card { background: var(--bg-main); border: 1px solid var(--border); border-radius: 16px; padding: 16px 20px; }
                .timeline-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
                .timeline-action { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 6px; }
                .timeline-by { display: flex; align-items: center; gap: 8px; }
                .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: white; text-transform: uppercase; }
                .timeline-user { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
                .timeline-time { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }
                .timeline-content { font-size: 0.8rem; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; font-family: monospace; line-height: 1.7; max-height: 160px; overflow-y: auto; }
                .modal-footer { padding: 16px 32px; border-top: 1px solid var(--border); }
            `}</style>

            <div className="ann-page">
                {/* Header */}
                <div className="ann-header">
                    <div>
                        <h1 className="ann-title">Announcements</h1>
                        <p className="ann-subtitle">Manage and publish institutional communications to your community.</p>
                    </div>
                    <button className="ann-compose-btn" onClick={() => setShowCreate(true)}>
                        <Plus size={18} /> New Announcement
                    </button>
                </div>

                {/* Stats */}
                <div className="ann-stats">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div className="stat-card" key={label}>
                            <div className="stat-icon" style={{ background: `${color}18` }}>
                                <Icon size={22} style={{ color }} />
                            </div>
                            <div>
                                <div className="stat-val">{value}</div>
                                <div className="stat-label">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="ann-toolbar">
                    <div className="tab-group">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="search-box">
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="announcements-list">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner" />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Loading announcements...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.map((a, idx) => {
                            const isImportant = a.priority === 'Important';
                            const isGlobal = a.targetType === 'Global';
                            const stripeColor = isImportant ? 'var(--danger)' : isGlobal ? 'var(--primary)' : 'var(--secondary)';

                            return (
                                <div className="ann-card" key={a._id} style={{ animationDelay: `${idx * 40}ms` }}>
                                    <div className="ann-card-stripe" style={{ background: stripeColor }} />
                                    <div className="ann-card-body">
                                        <div className="ann-card-icon-wrap" style={{ background: `${stripeColor}15`, color: stripeColor }}>
                                            {isGlobal ? <Globe size={24} /> : <Target size={24} />}
                                        </div>
                                        <div className="ann-card-content">
                                            <div className="ann-card-title">
                                                {a.title}
                                                {isImportant && <span className="badge-urgent">Urgent</span>}
                                                {isGlobal
                                                    ? <span className="badge-global">Global</span>
                                                    : <span className="badge-targeted">Targeted</span>
                                                }
                                            </div>
                                            <div className="ann-card-desc">{a.description}</div>
                                            <div className="ann-meta">
                                                <span className="ann-meta-item">
                                                    <Clock size={13} />
                                                    {new Date(a.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                {a.targetValues?.length > 0 && (
                                                    <span className="ann-meta-item">
                                                        <Users size={13} />
                                                        {a.targetValues.join(', ')}
                                                    </span>
                                                )}
                                                <span className="ann-meta-item">
                                                    <Shield size={13} />
                                                    {a.createdBy?.name || 'Admin'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ann-card-actions">
                                        <button
                                            className="icon-btn audit"
                                            title="View Audit Log"
                                            onClick={() => fetchAuditHistory(a)}
                                        >
                                            <History size={17} />
                                        </button>
                                        {filter !== 'Archived' && (
                                            <button
                                                className="icon-btn delete"
                                                title="Archive"
                                                onClick={() => handleDelete(a._id)}
                                            >
                                                <Archive size={17} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Megaphone size={36} color="var(--primary)" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Announcements Found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 340 }}>
                                {search ? `No results matching "${search}". Try a different keyword.` : 'No announcements in this category yet. Create one to get started.'}
                            </p>
                            {!search && (
                                <button className="ann-compose-btn" onClick={() => setShowCreate(true)} style={{ marginTop: 8 }}>
                                    <Plus size={16} /> Create First Announcement
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Drawer */}
            {showCreate && (
                <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
                    <div className="drawer">
                        <div className="drawer-header">
                            <div>
                                <div className="drawer-title">New Announcement</div>
                                <div className="drawer-subtitle">Broadcast to your institution</div>
                            </div>
                            <button className="close-btn" onClick={() => setShowCreate(false)}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div className="drawer-body">

                                <div className="form-field">
                                    <label className="form-lbl">Title *</label>
                                    <input
                                        required
                                        className="form-ctrl"
                                        placeholder="e.g., Library Hours Extended During Exams"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-lbl">Message *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="form-ctrl"
                                        placeholder="Write the full announcement message here..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="targeting-box">
                                    <div className="targeting-box-title">
                                        <Target size={14} color="var(--primary)" /> Delivery Target
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 14 }}>
                                        <label className="form-lbl">Audience</label>
                                        <select
                                            className="form-ctrl"
                                            value={formData.targetType}
                                            onChange={e => setFormData({ ...formData, targetType: e.target.value })}
                                        >
                                            <option value="Global">Everyone (Global)</option>
                                            <option value="Role">By Role (e.g., Faculty)</option>
                                            <option value="Department">By Department</option>
                                            <option value="Organization">By Organization / Club</option>
                                        </select>
                                    </div>
                                    {formData.targetType !== 'Global' && (
                                        <div className="form-field">
                                            <label className="form-lbl">Specify Values <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
                                            <input
                                                required
                                                className="form-ctrl"
                                                placeholder={formData.targetType === 'Department' ? 'CS, IT, ECE' : formData.targetType === 'Role' ? 'Faculty, Staff' : 'Debate Club, NSS'}
                                                value={formData.targetValues}
                                                onChange={e => setFormData({ ...formData, targetValues: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label className="form-lbl">Priority Level</label>
                                    <div className="priority-group">
                                        {['Normal', 'Important'].map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                className={`priority-btn ${formData.priority === p ? (p === 'Important' ? 'active-important' : 'active-normal') : ''}`}
                                                onClick={() => setFormData({ ...formData, priority: p })}
                                            >
                                                {p === 'Important' ? '🔴 Urgent / Important' : '🔵 Normal'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <button type="submit" className="submit-btn">
                                    <Megaphone size={17} /> Publish Announcement
                                </button>
                                <div className="audit-note">
                                    <CheckCircle size={13} color="var(--success)" />
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>All broadcasts are logged and auditable</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Audit Modal */}
            {showAudit && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAudit(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ padding: 8, background: 'rgba(168,85,247,0.12)', borderRadius: 10 }}><History size={20} color="var(--secondary)" /></div>
                                    Audit History
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                                    {selectedAnnouncement?.title}
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAudit(false)}><X size={18} /></button>
                        </div>

                        <div className="modal-body">
                            {auditLoading ? (
                                <div className="loading-state">
                                    <div className="spinner" />
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Loading audit trail...</p>
                                </div>
                            ) : auditData.length > 0 ? (
                                <div className="timeline">
                                    {auditData.map((rev, idx) => {
                                        const isArchive = rev.action === 'Archive';
                                        return (
                                            <div className="timeline-item" key={rev._id}>
                                                <div
                                                    className="timeline-dot"
                                                    style={{ background: isArchive ? 'var(--danger)' : 'var(--primary)' }}
                                                >
                                                    {isArchive
                                                        ? <Archive size={10} color="white" />
                                                        : <CheckCircle size={10} color="white" />
                                                    }
                                                </div>
                                                <div className="timeline-card">
                                                    <div className="timeline-head">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <span
                                                                className="timeline-action"
                                                                style={isArchive
                                                                    ? { background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }
                                                                    : { background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }
                                                                }
                                                            >
                                                                {rev.action}
                                                            </span>
                                                            <div className="timeline-by">
                                                                <div className="avatar">{rev.changedBy?.name?.charAt(0) || 'A'}</div>
                                                                <span className="timeline-user">{rev.changedBy?.name || 'Admin'}</span>
                                                            </div>
                                                        </div>
                                                        <span className="timeline-time">
                                                            {new Date(rev.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="timeline-content">
                                                        {isArchive
                                                            ? <span style={{ color: 'var(--danger)', fontStyle: 'italic' }}>Announcement was archived and removed from active broadcasts.</span>
                                                            : <pre style={{ margin: 0, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(rev.changes, null, 2)}</pre>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state" style={{ border: 'none', padding: '40px 24px' }}>
                                    <div className="empty-icon">
                                        <Shield size={32} color="var(--text-muted)" />
                                    </div>
                                    <p style={{ color: 'var(--text-main)', fontWeight: 700 }}>No revision history</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>This announcement hasn't been modified since it was created.</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Shield size={12} /> All changes are immutably logged for governance compliance
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageAnnouncements;
