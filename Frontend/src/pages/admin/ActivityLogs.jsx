import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    Activity, Search, X, Shield, User, Clock,
    Globe, LogIn, LogOut, Vote, Megaphone, Trash2,
    RefreshCw, ChevronDown, ChevronUp, Filter
} from 'lucide-react';

/* ── helpers ───────────────────────────────────────────────── */
const ACTION_META = {
    LOGIN:   { label: 'Login',    color: '#10b981', bg: 'rgba(16,185,129,0.12)',  Icon: LogIn   },
    LOGOUT:  { label: 'Logout',   color: '#64748b', bg: 'rgba(100,116,139,0.12)', Icon: LogOut  },
    VOTE:    { label: 'Vote',     color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  Icon: Vote    },
    ANNOUNCE:{ label: 'Announce', color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  Icon: Megaphone },
    DELETE:  { label: 'Delete',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   Icon: Trash2  },
    DEFAULT: { label: 'Action',   color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  Icon: Shield  },
};

const getActionMeta = action => {
    if (!action) return ACTION_META.DEFAULT;
    const key = Object.keys(ACTION_META).find(k => action.toUpperCase().includes(k));
    return ACTION_META[key] || ACTION_META.DEFAULT;
};

const fmtDate = ts => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = ts => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const timeAgo = ts => {
    const secs = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
};

/* ── component ─────────────────────────────────────────────── */
const ActivityLogs = () => {
    const [logs, setLogs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch]   = useState('');
    const [filter, setFilter]   = useState('All');
    const [expanded, setExpanded] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = async (refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/activity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /* filter categories derived from data */
    const actionCategories = ['All', ...new Set(logs.map(l => {
        const key = Object.keys(ACTION_META).find(k => l.action?.toUpperCase().includes(k));
        return key ? ACTION_META[key].label : 'Other';
    }))];

    const filtered = logs.filter(log => {
        const matchSearch =
            log.action?.toLowerCase().includes(search.toLowerCase()) ||
            log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            log.details?.toLowerCase().includes(search.toLowerCase()) ||
            log.ipAddress?.includes(search);
        const matchFilter = filter === 'All' || (() => {
            const key = Object.keys(ACTION_META).find(k => log.action?.toUpperCase().includes(k));
            const label = key ? ACTION_META[key].label : 'Other';
            return label === filter;
        })();
        return matchSearch && matchFilter;
    });

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    /* stats */
    const stats = [
        { label: 'Total Events', value: logs.length, color: '#6366f1', icon: Activity },
        { label: 'Logins', value: logs.filter(l => l.action?.toUpperCase().includes('LOGIN')).length, color: '#10b981', icon: LogIn },
        { label: 'Votes Cast', value: logs.filter(l => l.action?.toUpperCase().includes('VOTE')).length, color: '#a855f7', icon: Vote },
        { label: 'Today', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, color: '#f59e0b', icon: Clock },
    ];

    return (
        <>
        <style>{`
            .logs-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            .logs-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
            .logs-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,#6366f1,#a855f7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .logs-subtitle { color:var(--text-muted); font-size:0.875rem; margin-top:4px; font-weight:500; }
            .refresh-btn { display:flex; align-items:center; gap:8px; padding:10px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:12px; font-weight:700; font-size:0.82rem; color:var(--text-muted); cursor:pointer; transition:all 0.18s; }
            .refresh-btn:hover { border-color:var(--primary); color:var(--primary); background:rgba(99,102,241,0.06); }
            .refresh-btn svg { transition:transform 0.6s; }
            .refresh-btn:hover svg { transform:rotate(180deg); }
            /* stats */
            .logs-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
            @media(max-width:768px){ .logs-stats{ grid-template-columns:repeat(2,1fr); } }
            .stat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; display:flex; align-items:center; gap:14px; transition:all 0.2s; }
            .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.1); border-color:var(--primary); }
            .stat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .stat-val { font-size:1.5rem; font-weight:800; font-family:var(--font-heading); color:var(--text-main); line-height:1; }
            .stat-lbl { font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-top:3px; }
            /* toolbar */
            .logs-toolbar { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:12px; margin-bottom:24px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
            .tab-group { display:flex; background:var(--bg-main); border-radius:12px; padding:4px; gap:2px; flex-wrap:wrap; }
            .tab-btn { padding:7px 14px; border-radius:9px; font-size:0.75rem; font-weight:700; border:none; background:transparent; color:var(--text-muted); cursor:pointer; transition:all 0.18s; white-space:nowrap; }
            .tab-btn.active { background:white; color:var(--primary); box-shadow:0 2px 8px rgba(0,0,0,0.1); }
            .tab-btn:hover:not(.active){ color:var(--text-main); background:var(--border-subtle); }
            .search-box { flex:1; min-width:180px; display:flex; align-items:center; gap:10px; background:var(--bg-main); border:1px solid var(--border); border-radius:12px; padding:10px 16px; }
            .search-box input { flex:1; border:none; background:transparent; outline:none; font-size:0.875rem; color:var(--text-main); font-family:var(--font-body); }
            .search-box input::placeholder { color:var(--text-muted); }
            .search-box:focus-within { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .count-badge { font-size:0.7rem; font-weight:700; padding:3px 9px; background:rgba(99,102,241,0.1); color:var(--primary); border-radius:20px; white-space:nowrap; }
            /* table wrapper */
            .table-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; overflow:hidden; }
            .log-table { width:100%; border-collapse:collapse; }
            .log-table thead th { padding:14px 20px; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); text-align:left; background:var(--bg-main); border-bottom:1px solid var(--border); white-space:nowrap; }
            .log-table tbody tr { border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.15s; }
            .log-table tbody tr:last-child { border-bottom:none; }
            .log-table tbody tr:hover { background:rgba(99,102,241,0.04); }
            .log-table tbody tr.expanded-row { background:rgba(99,102,241,0.03); }
            .log-table td { padding:14px 20px; vertical-align:middle; }
            /* action cell */
            .action-cell { display:flex; align-items:center; gap:10px; }
            .action-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .action-label { font-size:0.85rem; font-weight:700; color:var(--text-main); }
            /* user cell */
            .user-cell { display:flex; align-items:center; gap:10px; }
            .avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--secondary)); display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:800; color:white; text-transform:uppercase; flex-shrink:0; }
            .user-name { font-size:0.85rem; font-weight:600; color:var(--text-main); }
            .user-role { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-top:1px; }
            /* details */
            .details-text { font-size:0.82rem; color:var(--text-muted); max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
            .ip-text { font-size:0.78rem; font-family:monospace; color:var(--text-muted); background:var(--bg-main); padding:3px 8px; border-radius:6px; border:1px solid var(--border); }
            .time-col { text-align:right; }
            .time-main { font-size:0.82rem; font-weight:600; color:var(--text-main); }
            .time-ago { font-size:0.68rem; color:var(--text-muted); margin-top:2px; }
            /* expand row */
            .expand-row td { padding:0 20px 16px 20px !important; }
            .expand-card { background:var(--bg-main); border:1px solid var(--border); border-radius:14px; padding:16px 20px; display:grid; grid-template-columns:1fr 1fr; gap:12px 24px; }
            @media(max-width:640px){ .expand-card { grid-template-columns:1fr; } }
            .expand-field { display:flex; flex-direction:column; gap:3px; }
            .expand-lbl { font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); }
            .expand-val { font-size:0.82rem; color:var(--text-main); font-weight:500; word-break:break-all; }
            /* empty / loading */
            .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; gap:14px; text-align:center; }
            .empty-icon { width:72px; height:72px; border-radius:20px; background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1)); display:flex; align-items:center; justify-content:center; }
            .spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation:spin 0.8s linear infinite; }
            @keyframes spin { to { transform:rotate(360deg); } }
            /* pagination */
            .pagination { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-top:1px solid var(--border); }
            .page-info { font-size:0.8rem; color:var(--text-muted); font-weight:600; }
            .page-buttons { display:flex; gap:6px; }
            .page-btn { width:34px; height:34px; border-radius:9px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-muted); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; }
            .page-btn:hover:not(:disabled){ border-color:var(--primary); color:var(--primary); background:rgba(99,102,241,0.06); }
            .page-btn:disabled { opacity:0.4; cursor:not-allowed; }
            .page-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        `}</style>

        <div className="logs-page">
            {/* Header */}
            <div className="logs-header">
                <div>
                    <h1 className="logs-title">Activity Logs</h1>
                    <p className="logs-subtitle">Real-time audit trail of all governance and user actions.</p>
                </div>
                <button className="refresh-btn" onClick={() => fetchLogs(true)}>
                    <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                    {refreshing ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {/* Stats */}
            <div className="logs-stats">
                {stats.map(({ label, value, color, icon: Icon }) => (
                    <div className="stat-card" key={label}>
                        <div className="stat-icon" style={{ background: `${color}18` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                            <div className="stat-val">{value}</div>
                            <div className="stat-lbl">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="logs-toolbar">
                <div className="tab-group">
                    {[...new Set(['All', ...actionCategories])].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${filter === tab ? 'active' : ''}`}
                            onClick={() => { setFilter(tab); setPage(1); }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="search-box">
                    <Search size={15} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search by user, action, or IP..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                            <X size={14} />
                        </button>
                    )}
                </div>
                <span className="count-badge">{filtered.length} records</span>
            </div>

            {/* Table */}
            <div className="table-wrap">
                {loading ? (
                    <div className="empty-state">
                        <div className="spinner" />
                        <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', fontWeight:600 }}>Loading activity logs…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Activity size={30} color="var(--primary)" /></div>
                        <p style={{ fontWeight:700, color:'var(--text-main)' }}>No logs found</p>
                        <p style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>
                            {search ? `No results for "${search}"` : 'No activity recorded in this category yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                    <table className="log-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>User</th>
                                <th>Details</th>
                                <th>IP Address</th>
                                <th style={{ textAlign:'right' }}>Timestamp</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(log => {
                                const meta = getActionMeta(log.action);
                                const isOpen = expanded === log._id;
                                return (
                                    <React.Fragment key={log._id}>
                                        <tr
                                            className={isOpen ? 'expanded-row' : ''}
                                            onClick={() => setExpanded(isOpen ? null : log._id)}
                                        >
                                            {/* Action */}
                                            <td>
                                                <div className="action-cell">
                                                    <div className="action-icon" style={{ background: meta.bg, color: meta.color }}>
                                                        <meta.Icon size={16} />
                                                    </div>
                                                    <span className="action-label" style={{ color: meta.color }}>{log.action}</span>
                                                </div>
                                            </td>
                                            {/* User */}
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar">{log.user?.name?.charAt(0) || 'S'}</div>
                                                    <div>
                                                        <div className="user-name">{log.user?.name || 'System'}</div>
                                                        <div className="user-role">{log.user?.role || 'system'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Details */}
                                            <td>
                                                <span className="details-text" title={log.details}>{log.details || '—'}</span>
                                            </td>
                                            {/* IP */}
                                            <td>
                                                <span className="ip-text">{log.ipAddress || '127.0.0.1'}</span>
                                            </td>
                                            {/* Time */}
                                            <td className="time-col">
                                                <div className="time-main">{fmtDate(log.timestamp)} · {fmtTime(log.timestamp)}</div>
                                                <div className="time-ago">{timeAgo(log.timestamp)}</div>
                                            </td>
                                            {/* Expand toggle */}
                                            <td style={{ textAlign:'center', width:36 }}>
                                                <span style={{ color:'var(--text-muted)', display:'flex', justifyContent:'center' }}>
                                                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Expand Row */}
                                        {isOpen && (
                                            <tr>
                                                <td colSpan={6} className="expand-row">
                                                    <div className="expand-card">
                                                        <div className="expand-field">
                                                            <span className="expand-lbl">Full Action</span>
                                                            <span className="expand-val">{log.action}</span>
                                                        </div>
                                                        <div className="expand-field">
                                                            <span className="expand-lbl">User ID</span>
                                                            <span className="expand-val" style={{ fontFamily:'monospace', fontSize:'0.75rem' }}>{log.user?._id || '—'}</span>
                                                        </div>
                                                        <div className="expand-field" style={{ gridColumn:'1/-1' }}>
                                                            <span className="expand-lbl">Details</span>
                                                            <span className="expand-val">{log.details || 'No additional details.'}</span>
                                                        </div>
                                                        {log.metadata && (
                                                            <div className="expand-field" style={{ gridColumn:'1/-1' }}>
                                                                <span className="expand-lbl">Metadata</span>
                                                                <span className="expand-val" style={{ fontFamily:'monospace', fontSize:'0.75rem', whiteSpace:'pre-wrap' }}>
                                                                    {JSON.stringify(log.metadata, null, 2)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <span className="page-info">
                                Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
                            </span>
                            <div className="page-buttons">
                                <button className="page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const p = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
                                    return (
                                        <button key={p} className={`page-btn ${page===p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                                    );
                                })}
                                <button className="page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
        </>
    );
};

export default ActivityLogs;
