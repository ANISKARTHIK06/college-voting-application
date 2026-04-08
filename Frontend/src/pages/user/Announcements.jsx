import React, { useState, useEffect } from 'react';
import http from '@/config/http';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Globe, Target, Megaphone, Search, X, Clock,
    Filter, ChevronRight, Bell
} from 'lucide-react';

// API usage will now use http instance

const UserAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [search, setSearch]               = useState('');
    const [filter, setFilter]               = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        http.get('/announcements')
          .then(r => setAnnouncements(r.data))
          .catch(() => toast.error('Failed to load announcements'))
          .finally(() => setLoading(false));
    }, []);

    const TABS = ['All', 'Global', 'Targeted'];

    const filtered = announcements.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                            a.description.toLowerCase().includes(search.toLowerCase());
        if (filter === 'All')      return matchSearch;
        if (filter === 'Global')   return matchSearch && a.targetType === 'Global';
        if (filter === 'Targeted') return matchSearch && a.targetType !== 'Global';
        return matchSearch;
    });

    return (
        <>
        <style>{`
            .ua-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            .ua-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; gap:16px; flex-wrap:wrap; }
            .ua-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .ua-subtitle { color:var(--text-muted); font-size:0.875rem; margin-top:4px; font-weight:500; }
            .ua-toolbar { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:12px; margin-bottom:24px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
            .tab-grp { display:flex; background:var(--bg-main); border-radius:12px; padding:4px; gap:2px; }
            .tab-btn { padding:8px 18px; border-radius:10px; font-size:0.8rem; font-weight:700; border:none; background:transparent; color:var(--text-muted); cursor:pointer; transition:all 0.15s; white-space:nowrap; }
            .tab-btn.active { background:white; color:var(--primary); box-shadow:0 2px 8px rgba(0,0,0,0.1); }
            .tab-btn:hover:not(.active){ color:var(--text-main); }
            .ua-search { flex:1; min-width:180px; display:flex; align-items:center; gap:10px; background:var(--bg-main); border:1px solid var(--border); border-radius:12px; padding:10px 16px; }
            .ua-search input { flex:1; border:none; background:transparent; outline:none; font-size:0.875rem; color:var(--text-main); font-family:var(--font-body); }
            .ua-search input::placeholder { color:var(--text-muted); }
            .ua-search:focus-within { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .ua-count { font-size:0.7rem; font-weight:800; padding:4px 10px; background:rgba(99,102,241,0.1); color:var(--primary); border-radius:20px; white-space:nowrap; }
            .ua-list { display:flex; flex-direction:column; gap:14px; }
            .ua-card { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; display:flex; overflow:hidden; transition:all 0.2s; }
            .ua-card:hover { transform:translateY(-2px); border-color:var(--primary); box-shadow:0 8px 28px rgba(99,102,241,0.1); }
            .ua-stripe { width:4px; flex-shrink:0; }
            .ua-body { flex:1; padding:22px 26px; display:flex; gap:18px; align-items:flex-start; }
            .ua-icon-wrap { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .ua-content { flex:1; min-width:0; }
            .ua-card-top { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
            .ua-card-title { font-size:1rem; font-weight:700; color:var(--text-main); }
            .ua-badge { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:3px 9px; border-radius:6px; }
            .ua-desc { font-size:0.85rem; color:var(--text-muted); line-height:1.65; margin-bottom:14px; }
            .ua-meta { display:flex; gap:14px; flex-wrap:wrap; }
            .ua-meta-item { display:flex; align-items:center; gap:5px; font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; }
            /* empty/loading */
            .ua-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; gap:14px; text-align:center; background:var(--bg-card); border:2px dashed var(--border); border-radius:22px; }
            .spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation:spin2 0.8s linear infinite; }
            @keyframes spin2 { to { transform:rotate(360deg); } }
        `}</style>

        <div className="ua-page">
            <div className="ua-header">
                <div>
                    <h1 className="ua-title">Campus Announcements</h1>
                    <p className="ua-subtitle">Official communications from the institution's governance team.</p>
                </div>
            </div>

            <div className="ua-toolbar">
                <div className="tab-grp">
                    {TABS.map(tab => (
                        <button key={tab} className={`tab-btn ${filter===tab?'active':''}`} onClick={() => setFilter(tab)}>{tab}</button>
                    ))}
                </div>
                <div className="ua-search">
                    <Search size={15} color="var(--text-muted)" />
                    <input
                        placeholder="Search announcements..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}><X size={14} /></button>}
                </div>
                <span className="ua-count">{filtered.length} notices</span>
            </div>

            <div className="ua-list">
                {loading ? (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 24px', gap:14 }}>
                        <div className="spinner" />
                        <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', fontWeight:600 }}>Loading announcements…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ua-empty">
                        <div style={{ width:64, height:64, borderRadius:18, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Megaphone size={28} color="var(--primary)" />
                        </div>
                        <p style={{ fontWeight:700, color:'var(--text-main)' }}>No Announcements Found</p>
                        <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', maxWidth:320 }}>
                            {search ? `No results for "${search}"` : 'Your administration has not posted any notices in this category yet.'}
                        </p>
                    </div>
                ) : filtered.map((a, idx) => {
                    const isImportant = a.priority === 'Important';
                    const isGlobal    = a.targetType === 'Global';
                    const stripe      = isImportant ? '#ef4444' : isGlobal ? 'var(--primary)' : 'var(--secondary)';
                    return (
                        <div className="ua-card" key={a._id}>
                            <div className="ua-stripe" style={{ background: stripe }} />
                            <div className="ua-body">
                                <div className="ua-icon-wrap" style={{ background:`${stripe}15`, color:stripe }}>
                                    {isGlobal ? <Globe size={22} /> : <Target size={22} />}
                                </div>
                                <div className="ua-content">
                                    <div className="ua-card-top">
                                        <span className="ua-card-title">{a.title}</span>
                                        {isImportant && <span className="ua-badge" style={{ background:'rgba(239,68,68,0.12)', color:'#ef4444' }}>Urgent</span>}
                                        <span className="ua-badge" style={{ background: isGlobal ? 'rgba(6,182,212,0.12)' : 'rgba(168,85,247,0.12)', color: isGlobal ? 'var(--accent)' : 'var(--secondary)' }}>
                                            {isGlobal ? 'Global' : 'Targeted'}
                                        </span>
                                    </div>
                                    <p className="ua-desc">{a.description}</p>
                                    <div className="ua-meta">
                                        <span className="ua-meta-item"><Clock size={11} />{new Date(a.publishDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                                        {a.createdBy?.name && <span className="ua-meta-item"><Bell size={11} />{a.createdBy.name}</span>}
                                        {a.targetValues?.length > 0 && <span className="ua-meta-item"><Target size={11} />{a.targetValues.join(', ')}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </>
    );
};

export default UserAnnouncements;
