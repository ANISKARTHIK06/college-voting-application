import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import {
    Vote, Megaphone, Bell, User, ChevronRight,
    Clock, CheckCircle, Plus, Activity, Globe
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const UserDashboard = () => {
    const [votes, setVotes]                 = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]             = useState(true);
    const user    = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const h     = { headers: { Authorization: `Bearer ${token}` } };
        Promise.all([
            axios.get(`${API}/votes`, h),
            axios.get(`${API}/announcements`, h),
            axios.get(`${API}/notifications`, h),
        ]).then(([vr, ar, nr]) => {
            setVotes(vr.data);
            setAnnouncements(ar.data.slice(0, 4));
            setNotifications(nr.data.filter(n => !n.isRead).slice(0, 3));
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    const activeVotes = votes.filter(v => v.status === 'active');
    const getInitials = n => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : 'ME';

    if (loading) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
            <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <p style={{ color:'var(--text-muted)', fontWeight:600, fontSize:'0.875rem' }}>Loading your dashboard…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <>
        <style>{`
            .ud-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            /* Hero */
            .ud-hero { background:var(--bg-card); border:1px solid var(--border); border-radius:24px; padding:32px 36px; margin-bottom:28px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; position:relative; overflow:hidden; }
            .ud-hero::before { content:''; position:absolute; top:0; right:0; width:300px; height:100%; background:linear-gradient(135deg,rgba(99,102,241,0.07),rgba(168,85,247,0.07)); pointer-events:none; }
            .ud-hero-title { font-size:1.8rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.02em; }
            .ud-hero-sub { font-size:0.875rem; color:var(--text-muted); font-weight:500; margin-top:4px; }
            .ud-avatar { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--secondary)); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:800; color:white; flex-shrink:0; }
            /* quick stats */
            .ud-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
            @media(max-width:768px){ .ud-stats{ grid-template-columns:repeat(2,1fr); } }
            .ud-stat { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; display:flex; align-items:center; gap:14px; transition:all 0.2s; cursor:pointer; }
            .ud-stat:hover { transform:translateY(-2px); border-color:var(--primary); box-shadow:0 8px 24px rgba(99,102,241,0.1); }
            .ud-stat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .ud-stat-val { font-size:1.5rem; font-weight:800; font-family:var(--font-heading); color:var(--text-main); line-height:1; }
            .ud-stat-lbl { font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-top:3px; }
            /* quick actions */
            .ud-actions { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:20px 24px; margin-bottom:28px; }
            .ud-action-title { font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); margin-bottom:14px; }
            .ud-action-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
            .ud-action-btn { padding:14px 16px; border-radius:14px; border:1.5px solid var(--border); background:var(--bg-main); display:flex; align-items:center; gap:10px; font-weight:700; font-size:0.82rem; color:var(--text-main); cursor:pointer; transition:all 0.18s; }
            .ud-action-btn:hover { transform:translateY(-2px); border-color:var(--primary); color:var(--primary); background:rgba(99,102,241,0.04); }
            .ud-action-btn.primary { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; border:none; box-shadow:0 4px 16px rgba(99,102,241,0.3); }
            .ud-action-btn.primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,0.4); color:white; }
            /* grid */
            .ud-grid { display:grid; grid-template-columns:1fr 340px; gap:24px; }
            @media(max-width:900px){ .ud-grid{ grid-template-columns:1fr; } }
            /* vote cards */
            .ud-section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
            .ud-section-title { font-size:1rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:8px; }
            .live-dot { width:8px; height:8px; border-radius:50%; background:#10b981; animation:pulse-dot 1.5s ease-in-out infinite; }
            @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
            .ud-vote-cards { display:flex; flex-direction:column; gap:14px; }
            .ud-vote-card { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; overflow:hidden; transition:all 0.2s; display:flex; }
            .ud-vote-card:hover { transform:translateY(-2px); border-color:var(--primary); box-shadow:0 8px 28px rgba(99,102,241,0.1); }
            .ud-vote-stripe { width:4px; flex-shrink:0; background:linear-gradient(to bottom,var(--primary),var(--secondary)); }
            .ud-vote-body { flex:1; padding:20px 22px; }
            .ud-vote-meta { display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
            .ud-tag { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:3px 9px; border-radius:6px; }
            .ud-vote-title { font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:6px; }
            .ud-vote-desc { font-size:0.8rem; color:var(--text-muted); line-height:1.55; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
            .ud-vote-footer { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
            .ud-time { display:flex; align-items:center; gap:5px; font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; }
            .ud-vote-btn { padding:9px 20px; border-radius:10px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-weight:700; font-size:0.8rem; border:none; cursor:pointer; transition:all 0.18s; }
            .ud-vote-btn:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(99,102,241,0.35); }
            /* side */
            .ud-side { display:flex; flex-direction:column; gap:20px; }
            .ud-panel { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; overflow:hidden; }
            .ud-panel-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
            .ud-panel-title { font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); display:flex; align-items:center; gap:6px; }
            .ud-ann-item { padding:14px 18px; border-bottom:1px solid var(--border); display:flex; gap:12px; align-items:flex-start; cursor:pointer; transition:background 0.15s; }
            .ud-ann-item:last-child { border-bottom:none; }
            .ud-ann-item:hover { background:rgba(99,102,241,0.03); }
            .ud-ann-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .ud-ann-title-text { font-size:0.83rem; font-weight:700; color:var(--text-main); margin-bottom:2px; }
            .ud-ann-desc { font-size:0.72rem; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.4; }
            .ud-view-all { display:flex; align-items:center; justify-content:center; gap:6px; padding:13px; border-top:1px solid var(--border); font-size:0.78rem; font-weight:700; color:var(--primary); cursor:pointer; background:none; border-left:none; border-right:none; border-bottom:none; width:100%; transition:background 0.15s; }
            .ud-view-all:hover { background:rgba(99,102,241,0.04); }
            .ud-empty { padding:32px 16px; text-align:center; color:var(--text-muted); font-size:0.82rem; }
        `}</style>

        <div className="ud-page">
            {/* Hero */}
            <div className="ud-hero">
                <div>
                    <div className="ud-hero-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
                    <div className="ud-hero-sub">Here's what's happening in your campus today.</div>
                    <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--primary)', background:'rgba(99,102,241,0.1)', padding:'4px 12px', borderRadius:20 }}>🎓 {user?.department || 'Student'}</span>
                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#10b981', background:'rgba(16,185,129,0.1)', padding:'4px 12px', borderRadius:20 }}>✅ Verified Member</span>
                        {activeVotes.length > 0 && <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#f59e0b', background:'rgba(245,158,11,0.1)', padding:'4px 12px', borderRadius:20 }}>🗳️ {activeVotes.length} Active Election{activeVotes.length>1?'s':''}</span>}
                    </div>
                </div>
                <div className="ud-avatar">{getInitials(user?.name)}</div>
            </div>

            {/* Stats */}
            <div className="ud-stats">
                {[
                    { icon:Vote,       color:'#6366f1', label:'Active Elections',  value: activeVotes.length,   onClick:() => navigate('/student/active-votes') },
                    { icon:Megaphone,  color:'#a855f7', label:'Announcements',     value: announcements.length, onClick:() => navigate('/student/announcements') },
                    { icon:Bell,       color:'#ef4444', label:'Unread Alerts',      value: notifications.length, onClick:() => navigate('/student/notifications') },
                    { icon:CheckCircle,color:'#10b981', label:'Votes Cast',         value: '—',                  onClick:() => navigate('/student/history') },
                ].map(({ icon:Icon, color, label, value, onClick }) => (
                    <div className="ud-stat" key={label} onClick={onClick}>
                        <div className="ud-stat-icon" style={{ background:`${color}18` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                            <div className="ud-stat-val">{value}</div>
                            <div className="ud-stat-lbl">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="ud-actions">
                <div className="ud-action-title">Quick Actions</div>
                <div className="ud-action-grid">
                    <button className="ud-action-btn primary" onClick={() => navigate('/student/active-votes')}>
                        <Vote size={16} /> Vote Now
                    </button>
                    <button className="ud-action-btn" onClick={() => navigate('/student/announcements')}>
                        <Megaphone size={16} /> Notices
                    </button>
                    <button className="ud-action-btn" onClick={() => navigate('/student/results')}>
                        <CheckCircle size={16} /> Results
                    </button>
                    <button className="ud-action-btn" onClick={() => navigate('/student/request-election')}>
                        <Plus size={16} /> Request Election
                    </button>
                    <button className="ud-action-btn" onClick={() => navigate('/student/profile')}>
                        <User size={16} /> My Profile
                    </button>
                    <button className="ud-action-btn" onClick={() => navigate('/student/history')}>
                        <Activity size={16} /> My History
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="ud-grid">
                {/* Active Elections */}
                <div>
                    <div className="ud-section-header">
                        <div className="ud-section-title">
                            <div className="live-dot" /> Open Elections
                            <span style={{ fontSize:'0.72rem', fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(16,185,129,0.1)', color:'#10b981' }}>
                                {activeVotes.length} Live
                            </span>
                        </div>
                        <button onClick={() => navigate('/student/active-votes')} style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem', fontWeight:700, color:'var(--primary)', background:'none', border:'none', cursor:'pointer' }}>
                            View All <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="ud-vote-cards">
                        {activeVotes.length > 0 ? activeVotes.slice(0, 4).map(v => (
                            <div className="ud-vote-card" key={v._id}>
                                <div className="ud-vote-stripe" />
                                <div className="ud-vote-body">
                                    <div className="ud-vote-meta">
                                        <span className="ud-tag" style={{ background:'rgba(16,185,129,0.12)', color:'#10b981' }}>LIVE</span>
                                        <span className="ud-tag" style={{ background:'rgba(99,102,241,0.1)', color:'var(--primary)' }}>{v.votingType}</span>
                                        <span className="ud-tag" style={{ background:'var(--bg-main)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>
                                            <Globe size={10} style={{ display:'inline', marginRight:3 }} />{v.eligibleGroup}
                                        </span>
                                    </div>
                                    <div className="ud-vote-title">{v.title}</div>
                                    <div className="ud-vote-desc">{v.description}</div>
                                    <div className="ud-vote-footer">
                                        <span className="ud-time">
                                            <Clock size={12} /> Ends {new Date(v.endTime).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                                        </span>
                                        <button className="ud-vote-btn" onClick={() => navigate('/student/active-votes')}>
                                            Cast Ballot →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ background:'var(--bg-card)', border:'2px dashed var(--border)', borderRadius:18, padding:'60px 24px', textAlign:'center' }}>
                                <div style={{ fontSize:'3rem', marginBottom:12 }}>🗳️</div>
                                <p style={{ fontWeight:700, color:'var(--text-main)', marginBottom:6 }}>No Active Elections</p>
                                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Check back later or browse upcoming elections.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Column */}
                <div className="ud-side">
                    {/* Announcements */}
                    <div className="ud-panel">
                        <div className="ud-panel-header">
                            <div className="ud-panel-title"><Megaphone size={14} color="var(--primary)" /> Campus Notices</div>
                        </div>
                        {announcements.length > 0 ? announcements.map((a, i) => (
                            <div className="ud-ann-item" key={i} onClick={() => navigate('/student/announcements')}>
                                <div className="ud-ann-icon" style={{ background: a.priority==='Important' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', color: a.priority==='Important' ? '#ef4444' : 'var(--primary)' }}>
                                    {a.priority==='Important' ? '⚠️' : '📢'}
                                </div>
                                <div>
                                    <div className="ud-ann-title-text">{a.title}</div>
                                    <div className="ud-ann-desc">{a.description}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="ud-empty">No recent notices from administration.</div>
                        )}
                        <button className="ud-view-all" onClick={() => navigate('/student/announcements')}>
                            View All Notices <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Unread notifications */}
                    {notifications.length > 0 && (
                        <div className="ud-panel">
                            <div className="ud-panel-header">
                                <div className="ud-panel-title"><Bell size={14} color="#ef4444" /> Unread Alerts</div>
                                <span style={{ fontSize:'0.7rem', fontWeight:800, padding:'2px 8px', borderRadius:20, background:'rgba(239,68,68,0.1)', color:'#ef4444' }}>{notifications.length}</span>
                            </div>
                            {notifications.map(n => (
                                <div className="ud-ann-item" key={n._id} onClick={() => navigate('/student/notifications')}>
                                    <div className="ud-ann-icon" style={{ background:'rgba(99,102,241,0.1)', color:'var(--primary)' }}>
                                        {n.type==='election' ? '🗳️' : n.type==='result' ? '🏆' : '🔔'}
                                    </div>
                                    <div>
                                        <div className="ud-ann-title-text">{n.title}</div>
                                        <div className="ud-ann-desc">{n.description}</div>
                                    </div>
                                </div>
                            ))}
                            <button className="ud-view-all" onClick={() => navigate('/student/notifications')}>
                                View All <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default UserDashboard;
