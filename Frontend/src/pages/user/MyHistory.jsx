import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    History, CheckCircle, Clock, Globe, Vote,
    User2, Trophy, ChevronRight, BarChart2, Calendar, AlertCircle, RefreshCw
} from 'lucide-react';

const API = API_BASE_URL;

const STATUS_META = {
    active:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  label: 'Active'    },
    ended:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Ended'     },
    published: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', label: 'Published' },
    draft:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',label: 'Draft'     },
};

const MyHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res   = await axios.get(`${API}/votes/my-history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to load voting history', err);
            setError(err.response?.data?.message || 'Could not load your voting history. The backend may need to be restarted.');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = n => n ? n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2) : '?';

    if (loading) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
            <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin-h 0.8s linear infinite' }} />
            <p style={{ color:'var(--text-muted)', fontWeight:600 }}>Loading your voting history…</p>
            <style>{`@keyframes spin-h{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16, padding:32, textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <AlertCircle size={26} color="#ef4444" />
            </div>
            <p style={{ fontWeight:700, color:'var(--text-main)', fontSize:'1rem' }}>Could Not Load History</p>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', maxWidth:360 }}>{error}</p>
            <button onClick={fetchHistory} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:12, background:'linear-gradient(135deg,var(--primary),var(--secondary))', color:'white', border:'none', fontWeight:700, cursor:'pointer' }}>
                <RefreshCw size={15} /> Retry
            </button>
        </div>
    );

    return (
        <>
        <style>{`
            .mh-page { min-height:100vh; background:var(--bg-main); padding:32px; max-width:860px; margin:0 auto; }
            .mh-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .mh-sub { color:var(--text-muted); font-size:0.875rem; margin-top:4px; margin-bottom:28px; }
            /* summary bar */
            .mh-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:28px; }
            .mh-sum-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; }
            .mh-sum-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .mh-sum-val { font-size:1.4rem; font-weight:800; font-family:var(--font-heading); color:var(--text-main); line-height:1; }
            .mh-sum-lbl { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-top:2px; }
            /* timeline */
            .mh-timeline { display:flex; flex-direction:column; gap:14px; }
            .mh-card { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; overflow:hidden; transition:border-color 0.18s; }
            .mh-card:hover { border-color:rgba(99,102,241,0.3); }
            .mh-card-top { padding:18px 22px; display:flex; gap:14px; align-items:flex-start; cursor:pointer; }
            .mh-voted-av { width:46px; height:46px; border-radius:13px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-size:1rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .mh-card-content { flex:1; min-width:0; }
            .mh-card-title { font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:5px; }
            .mh-card-meta { display:flex; gap:10px; flex-wrap:wrap; font-size:0.72rem; color:var(--text-muted); }
            .mh-card-meta span { display:flex; align-items:center; gap:3px; }
            .mh-tag { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:3px 9px; border-radius:6px; }
            .mh-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
            /* voted for section */
            .mh-voted-for { border-top:1px solid var(--border); background:rgba(99,102,241,0.03); padding:14px 22px; display:flex; align-items:center; gap:12px; }
            .mh-cand-av { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-size:0.75rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .mh-cand-name { font-size:0.9rem; font-weight:700; color:var(--text-main); }
            .mh-cand-lbl { font-size:0.7rem; color:var(--text-muted); margin-top:2px; display:flex; align-items:center; gap:4px; }
            /* other candidates */
            .mh-cands-expand { border-top:1px solid var(--border); padding:12px 22px; background:var(--bg-main); }
            .mh-cands-label { font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); margin-bottom:10px; }
            .mh-cands-grid { display:flex; gap:8px; flex-wrap:wrap; }
            .mh-cand-chip { display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; border:1px solid var(--border); background:var(--bg-card); font-size:0.78rem; font-weight:600; color:var(--text-muted); }
            .mh-cand-chip.mine { border-color:var(--primary); background:rgba(99,102,241,0.06); color:var(--primary); }
            /* empty */
            .mh-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; gap:14px; text-align:center; background:var(--bg-card); border:2px dashed var(--border); border-radius:22px; }
            @media(max-width:600px){ .mh-summary{ grid-template-columns:1fr 1fr; } }
        `}</style>

        <div className="mh-page">
            <h1 className="mh-title">📋 My Voting History</h1>
            <p className="mh-sub">A complete record of all elections you've participated in.</p>

            {/* Summary bar */}
            <div className="mh-summary">
                {[
                    { icon:Vote,       color:'#6366f1', label:'Elections\nVoted In', value: history.length },
                    { icon:CheckCircle,color:'#10b981', label:'Votes\nCast',         value: history.length },
                    { icon:Calendar,   color:'#a855f7', label:'Most Recent',
                      value: history.length ? new Date(history[0].votedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—' },
                ].map(({ icon:Icon, color, label, value }) => (
                    <div className="mh-sum-card" key={label}>
                        <div className="mh-sum-icon" style={{ background:`${color}18` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                            <div className="mh-sum-val">{value}</div>
                            <div className="mh-sum-lbl">{label.replace('\n',' ')}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            {history.length === 0 ? (
                <div className="mh-empty">
                    <div style={{ fontSize:'3.5rem' }}>🗳️</div>
                    <p style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--text-main)' }}>No Votes Yet</p>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', maxWidth:320 }}>
                        Your voting activity will appear here after you cast your first ballot.
                    </p>
                    <button
                        onClick={() => navigate('/student/active-votes')}
                        style={{ padding:'10px 24px', borderRadius:12, background:'linear-gradient(135deg,var(--primary),var(--secondary))', color:'white', border:'none', fontWeight:700, cursor:'pointer' }}
                    >
                        View Active Elections →
                    </button>
                </div>
            ) : (
                <div className="mh-timeline">
                    {history.map((h, i) => {
                        const s = STATUS_META[h.status] || STATUS_META.ended;
                        const isOpen = expanded === i;
                        return (
                            <div className="mh-card" key={h.voteId}>
                                {/* Top row */}
                                <div className="mh-card-top" onClick={() => setExpanded(isOpen ? null : i)}>
                                    <div className="mh-voted-av">
                                        {h.votedFor ? getInitials(h.votedFor.name) : '🗳️'}
                                    </div>
                                    <div className="mh-card-content">
                                        <div className="mh-card-title">{h.title}</div>
                                        <div className="mh-card-meta">
                                            <span><Globe size={11} />{h.eligibleGroup}</span>
                                            <span><Clock size={11} />Voted {new Date(h.votedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                                        </div>
                                    </div>
                                    <div className="mh-card-right">
                                        <span className="mh-tag" style={{ background:s.bg, color:s.color }}>{s.label}</span>
                                        {(h.status === 'ended' || h.status === 'published') && (
                                            <button
                                                onClick={e => { e.stopPropagation(); navigate('/student/results'); }}
                                                style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--primary)', background:'none', border:'1px solid rgba(99,102,241,0.25)', borderRadius:8, padding:'4px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}
                                            >
                                                <BarChart2 size={12} /> Results
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Voted for */}
                                <div className="mh-voted-for">
                                    <CheckCircle size={16} color="#10b981" style={{ flexShrink:0 }} />
                                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:600, marginRight:8 }}>You voted for:</div>
                                    {h.votedFor ? (
                                        <>
                                        <div className="mh-cand-av">{getInitials(h.votedFor.name)}</div>
                                        <div>
                                            <div className="mh-cand-name">{h.votedFor.name}</div>
                                            <div className="mh-cand-lbl">
                                                <CheckCircle size={11} color="#10b981" /> Ballot recorded
                                            </div>
                                        </div>
                                        </>
                                    ) : (
                                        <span style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Candidate info unavailable</span>
                                    )}
                                </div>

                                {/* Expanded: all candidates in this election */}
                                {isOpen && h.candidates.length > 0 && (
                                    <div className="mh-cands-expand">
                                        <div className="mh-cands-label">All candidates in this election</div>
                                        <div className="mh-cands-grid">
                                            {h.candidates.map(c => (
                                                <div key={c._id} className={`mh-cand-chip ${h.votedFor?._id===c._id?'mine':''}`}>
                                                    {h.votedFor?._id===c._id && <CheckCircle size={12} />}
                                                    {c.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
        </>
    );
};

export default MyHistory;
