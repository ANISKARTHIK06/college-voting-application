import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { X, Users, Mail, BookOpen, Clock } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';

const API = API_BASE_URL;

const ActiveVotes = () => {
    const [votes, setVotes]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [filter, setFilter]       = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [voterDrawer, setVoterDrawer]     = useState(null);
    const [voters, setVoters]               = useState([]);
    const [votersLoading, setVotersLoading] = useState(false);
    const user = getCurrentUser();
    const rolePrefix = user?.role === 'faculty' ? '/faculty' : '/admin';

    useEffect(() => { fetchVotes(); }, []);

    const fetchVotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await axios.get(`${API}/votes`, { headers: { Authorization: `Bearer ${token}` } });
            setVotes(res.data);
        } catch { console.error('Failed to fetch votes'); }
        finally  { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API}/votes/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchVotes();
        } catch { alert('Failed to update election status'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Archive this voting event? Cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API}/votes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setVotes(votes.filter(v => v._id !== id));
        } catch (err) { alert(err.response?.data?.message || 'Failed to delete vote'); }
    };

    const openVoterDrawer = async (vote) => {
        setVoterDrawer({ voteId: vote._id, title: vote.title });
        setVoters([]);
        setVotersLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await axios.get(`${API}/votes/${vote._id}/voters`, { headers: { Authorization: `Bearer ${token}` } });
            setVoters(res.data.voters || []);
        } catch { setVoters([]); }
        finally  { setVotersLoading(false); }
    };

    const filteredVotes = votes.filter(v => {
        const matchSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filter === 'all' || v.status === filter;
        return matchSearch && matchStatus;
    });

    const getInitials = n => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : '??';

    if (loading) return (
        <div className="loader-wrapper">
            <div className="loader-spinner" />
            <p className="loader-text">Syncing with governance vaults...</p>
        </div>
    );

    return (
        <>
        <style>{`
            .voters-drawer-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); display:flex; justify-content:flex-end; animation:fdIn 0.2s ease; }
            @keyframes fdIn { from{opacity:0} to{opacity:1} }
            .voters-drawer { background:var(--bg-sidebar); border-left:1px solid var(--border); width:100%; max-width:440px; height:100%; display:flex; flex-direction:column; animation:slLeft 0.25s cubic-bezier(0.16,1,0.3,1); }
            @keyframes slLeft { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
            .vd-header { padding:24px 28px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; }
            .vd-title { font-size:1rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading); }
            .vd-sub { font-size:0.75rem; color:var(--text-muted); margin-top:3px; font-weight:500; max-width:340px; }
            .vd-close { width:32px; height:32px; border-radius:9px; border:1px solid var(--border); background:var(--bg-main); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-muted); transition:all 0.15s; flex-shrink:0; }
            .vd-close:hover { background:rgba(239,68,68,0.1); border-color:#ef4444; color:#ef4444; }
            .vd-body { flex:1; overflow-y:auto; padding:16px 0; }
            .vd-count { padding:0 20px 14px; font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); display:flex; align-items:center; gap:8px; }
            .voter-item { padding:14px 20px; display:flex; gap:14px; align-items:center; border-bottom:1px solid var(--border); transition:background 0.15s; }
            .voter-item:last-child { border-bottom:none; }
            .voter-item:hover { background:rgba(99,102,241,0.03); }
            .voter-av { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-size:0.75rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .voter-name { font-size:0.88rem; font-weight:700; color:var(--text-main); margin-bottom:3px; }
            .voter-detail { font-size:0.72rem; color:var(--text-muted); display:flex; gap:10px; flex-wrap:wrap; }
            .voter-detail span { display:flex; align-items:center; gap:3px; }
            .vd-spin { display:flex; flex-direction:column; align-items:center; padding:48px; gap:12px; }
            .vd-spinner { width:32px; height:32px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation:sp 0.8s linear infinite; }
            @keyframes sp { to { transform:rotate(360deg); } }
            .vd-empty { display:flex; flex-direction:column; align-items:center; padding:48px 24px; gap:10px; text-align:center; }
            .who-voted-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; background:rgba(99,102,241,0.09); color:var(--primary); border:1px solid rgba(99,102,241,0.25); font-weight:700; font-size:0.78rem; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
            .who-voted-btn:hover { background:rgba(99,102,241,0.16); border-color:var(--primary); }
        `}</style>

        <div className="active-votes-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{user?.role === 'faculty' ? 'Election Monitoring Console' : 'Election Management Console'}</h1>
                    <p className="page-subtitle">Full lifecycle control for voting campaigns</p>
                </div>
                <div className="page-header-actions">
                    <div className="glass-panel" style={{ padding:'0 16px', display:'flex', alignItems:'center', gap:'8px' }}>
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search elections..."
                            className="form-input"
                            style={{ border:'none', background:'transparent', width:'200px', padding:'8px 0', fontSize:'0.85rem' }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="glass-panel" style={{ padding:'4px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
                        {['all','active','draft','ended','published'].map(f => (
                            <button
                                key={f}
                                className={`btn btn-sm ${filter===f?'btn-primary':'btn-ghost'}`}
                                onClick={() => setFilter(f)}
                                style={{ textTransform:'capitalize' }}
                            >{f}</button>
                        ))}
                    </div>
                    {user?.role === 'admin' ? (
                        <Link to="/admin/create-vote" className="btn btn-primary">+ New Election</Link>
                    ) : user?.role === 'faculty' ? (
                        <Link to="/faculty/create-election" className="btn btn-primary">+ Launch Election</Link>
                    ) : null}
                </div>
            </div>

            <div className="dashboard-card glass-panel animate-slideUp" style={{ padding:'0' }}>
                <div className="table-scroll-container" style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid var(--border)' }}>
                                <th style={{ padding:'20px 24px', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Election Details</th>
                                <th style={{ padding:'20px 24px', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Status</th>
                                <th style={{ padding:'20px 24px', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Voters</th>
                                <th style={{ padding:'20px 24px', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Schedule</th>
                                <th style={{ padding:'20px 24px', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', textAlign:'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVotes.map(vote => (
                                <tr key={vote._id} className="table-row-hover" style={{ borderBottom:'1px solid var(--border-subtle)', transition:'var(--transition)' }}>
                                    <td style={{ padding:'24px' }}>
                                        <div style={{ fontWeight:600, color:'var(--text-main)', marginBottom:'4px' }}>{vote.title}</div>
                                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{vote.eligibleGroup}</div>
                                    </td>
                                    <td style={{ padding:'24px' }}>
                                        <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                                            <span className={`badge ${vote.status==='active'?'badge-active':vote.status==='published'?'badge-published':'badge-ended'}`}>
                                                {vote.status}
                                            </span>
                                            {vote.status==='active' && <span style={{ fontSize:'0.65rem', color:'var(--success)', fontWeight:600 }}>● RECEIVING BALLOTS</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding:'24px' }}>
                                        {vote.status !== 'draft' ? (
                                            <button className="who-voted-btn" onClick={() => openVoterDrawer(vote)}>
                                                <Users size={14} /> Who Voted
                                            </button>
                                        ) : (
                                            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600 }}>Waiting for Launch</span>
                                        )}
                                    </td>
                                    <td style={{ padding:'24px', fontSize:'0.8rem', color:'var(--text-muted)' }}>
                                        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                                            <span>Start: {new Date(vote.startTime).toLocaleDateString()}</span>
                                            <span>End: {new Date(vote.endTime).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding:'24px', textAlign:'right' }}>
                                        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', flexWrap:'wrap' }}>
                                            {vote.status!=='active' && vote.status!=='published' && (
                                                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(vote._id,'active')}>Publish to Students ⚡</button>
                                            )}
                                            {vote.status==='active' && (
                                                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(vote._id,'ended')}>End Election 🛑</button>
                                            )}
                                            {vote.status==='ended' && (user?.role === 'admin' || user?.role === 'faculty') && (
                                                <button className="btn btn-primary btn-sm" onClick={() => updateStatus(vote._id,'published')}>Finalize Results 📜</button>
                                            )}
                                            <Link to={`${rolePrefix}/candidates/${vote._id}`} className="btn btn-secondary btn-sm">Candidates 👥</Link>
                                            <Link to={user?.role === 'faculty' ? `/faculty/statistics/${vote._id}` : `/admin/analytics/${vote._id}`} className="btn btn-ghost btn-sm">Monitoring 📊</Link>
                                            {(user?.role === 'admin' || (user?.role === 'faculty' && (!vote.createdBy || vote.createdBy === user?._id))) && vote.status !== 'active' && (
                                                <button className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} onClick={() => handleDelete(vote._id)}>Archive</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredVotes.length === 0 && (
                    <div className="empty-state" style={{ border:'none' }}>
                        <div className="empty-state-icon">📂</div>
                        <p className="empty-state-text">No elections match the selected filter.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Voter Tracking Drawer */}
        {voterDrawer && (
            <div className="voters-drawer-overlay" onClick={e => e.target===e.currentTarget && setVoterDrawer(null)}>
                <div className="voters-drawer">
                    <div className="vd-header">
                        <div>
                            <div className="vd-title">Voter Tracking</div>
                            <div className="vd-sub" title={voterDrawer.title}>{voterDrawer.title}</div>
                        </div>
                        <button className="vd-close" onClick={() => setVoterDrawer(null)}><X size={15} /></button>
                    </div>
                    <div className="vd-body">
                        {votersLoading ? (
                            <div className="vd-spin">
                                <div className="vd-spinner" />
                                <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', fontWeight:600 }}>Fetching voter records…</p>
                            </div>
                        ) : voters.length === 0 ? (
                            <div className="vd-empty">
                                <div style={{ fontSize:'2.5rem' }}>🗳️</div>
                                <p style={{ fontWeight:700, color:'var(--text-main)' }}>No Votes Cast Yet</p>
                                <p style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Voter data appears here once ballots are submitted.</p>
                            </div>
                        ) : (
                            <>
                            <div className="vd-count">
                                <Users size={14} color="var(--primary)" /> {voters.length} voter{voters.length!==1?'s':''} recorded
                            </div>
                            {voters.map((v, i) => (
                                <div className="voter-item" key={v._id || i}>
                                    <div className="voter-av">{getInitials(v.user?.name)}</div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div className="voter-name">{v.user?.name || 'Anonymous'}</div>
                                        <div className="voter-detail">
                                            {v.user?.email      && <span><Mail size={10} /> {v.user.email}</span>}
                                            {v.user?.department && <span><BookOpen size={10} /> {v.user.department}</span>}
                                            {v.votedAt          && <span><Clock size={10} /> {new Date(v.votedAt).toLocaleString('en-IN',{ day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ActiveVotes;
