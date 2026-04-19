import React, { useState, useEffect } from 'react';
import http from '@/config/http';
import { 
    Megaphone, Users, LineChart, ShieldCheck, Check, X, 
    MessageSquare, List, Clock, LayoutDashboard, Plus, 
    Search, Bell, Activity, Globe, ChevronRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import StatCard from '../../components/shared/StatCard';
import AnalyticsSection from '../../components/shared/AnalyticsSection';
import { getCurrentUser } from '../../services/authService';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [elections, setElections] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [annRes, reqRes, eleRes, stuRes] = await Promise.all([
        http.get('/announcements'),
        http.get('/election-requests'),
        http.get('/votes'),
        http.get('/users/students')
      ]);
      setAnnouncements(annRes.data.slice(0, 3));
      setRequests(reqRes.data);
      setElections(eleRes.data);
      setStudents(stuRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (id, action) => {
    try {
      await http.patch(`/election-requests/${id}`, {
        status: action,
        reviewNote: action === 'approved' ? 'Approved by faculty' : 'Rejected by faculty'
      });
      toast.success(action === 'approved' ? 'Request Approved!' : 'Request Rejected.');
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const getInitials = n => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : 'ST';

  if (loading) return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
          <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          <p style={{ color:'var(--text-muted)', fontWeight:600, fontSize:'0.875rem' }}>Loading Portal Dashboard…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
  );

  return (
    <>
    <style>{`
        .fd-page { padding: 32px; min-height: 100vh; background: var(--bg-main); }
        .fd-hero { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 36px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden; }
        .fd-hero::after { content: ''; position: absolute; top: 0; right: 0; width: 350px; height: 100%; background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08)); pointer-events: none; }
        .fd-hero-title { font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .fd-hero-sub { color: var(--text-muted); font-size: 0.95rem; margin-top: 6px; font-weight: 500; }
        .fd-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; color: white; border: 3px solid var(--bg-main); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        
        .fd-action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 32px; }
        .fd-action-btn { padding: 18px 20px; border-radius: 18px; border: 1.5px solid var(--border); background: var(--bg-card); display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 0.88rem; color: var(--text-main); cursor: pointer; transition: all 0.2s; }
        .fd-action-btn:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: 0 12px 32px -12px rgba(99,102,241,0.3); color: var(--primary); }
        .fd-action-btn.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; box-shadow: 0 4px 16px rgba(99,102,241,0.25); }
        
        .fd-main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }
        @media(max-width: 1024px) { .fd-main-grid { grid-template-columns: 1fr; } }
        
        .fd-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 28px; margin-bottom: 24px; }
        .fd-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .fd-section-title { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); display: flex; align-items: center; gap: 10px; }
        
        .fd-item { display: flex; gap: 16px; padding: 18px; border-radius: 18px; background: var(--bg-main); border: 1px solid var(--border); margin-bottom: 12px; transition: 0.15s; }
        .fd-item:hover { border-color: var(--primary); background: rgba(99,102,241,0.02); }
        .fd-item-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        
        .badge { font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .badge-pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .badge-active { background: rgba(16,185,129,0.1); color: #10b981; }
    `}</style>

    <div className="fd-page">
        {/* Hero Section */}
        <div className="fd-hero">
            <div>
                <h1 className="fd-hero-title">Institution Portal, {user?.name?.split(' ')[0]}</h1>
                <p className="fd-hero-sub">Overseeing {user?.department || 'Administration'} Governance & Integrity</p>
                <div style={{ display:'flex', gap:10, marginTop:16, flexWrap:'wrap' }}>
                    <span className="badge" style={{ background:'rgba(99,102,241,0.1)', color:'var(--primary)', padding:'6px 14px' }}>🛡️ Authorized Staff</span>
                    <span className="badge" style={{ background:'rgba(16,185,129,0.1)', color:'#10b981', padding:'6px 14px' }}>📡 System Live</span>
                    <span className="badge" style={{ background:'rgba(255,255,255,0.05)', color:'var(--text-muted)', padding:'6px 14px' }}>🆔 {user?.registerNumber}</span>
                    <span className="badge" style={{ background:'rgba(255,255,255,0.05)', color:'var(--text-muted)', padding:'6px 14px' }}>✉️ {user?.email}</span>
                </div>
            </div>
            <div className="fd-avatar" style={{ cursor:'pointer' }} onClick={() => navigate('/faculty/profile')}>{getInitials(user?.name)}</div>
        </div>

        {/* Quick Tools */}
        <div className="fd-action-grid">
            <button className="fd-action-btn primary" onClick={() => navigate('/faculty/create-election')}>
                <Plus size={18} /> Launch Election
            </button>
            <button className="fd-action-btn" onClick={() => navigate('/faculty/approve-proposals')}>
                <ShieldCheck size={18} /> Approve Proposals
            </button>
            <button className="fd-action-btn" onClick={() => navigate('/faculty/monitoring')}>
                <Activity size={18} /> Observation
            </button>
            <button className="fd-action-btn" onClick={() => navigate('/faculty/announcements')}>
                <Megaphone size={18} /> Send Notice
            </button>
        </div>

        <div className="fd-main-grid">
            <div className="fd-content-col">
                {/* 📩 Incoming Proposals */}
                <div className="fd-section">
                    <div className="fd-section-head">
                        <h3 className="fd-section-title"><Clock size={16} color="#f59e0b" /> Incoming Proposals</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/faculty/approve-proposals')}>Review All <ChevronRight size={14}/></button>
                    </div>
                    {requests.filter(r => r.status === 'pending').length > 0 ? (
                        requests.filter(r => r.status === 'pending').slice(0, 3).map(r => (
                            <div key={r._id} className="fd-item">
                                <div className="fd-item-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>📩</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{r.title}</div>
                                        <span className="badge badge-pending">Pending</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        From {r.requestedBy?.name || 'Student'} • {r.eligibleGroup}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-sm" style={{ padding:'6px', background:'rgba(16,185,129,0.1)', color:'#10b981' }} onClick={() => handleReview(r._id, 'approved')}><Check size={14}/></button>
                                    <button className="btn btn-sm" style={{ padding:'6px', background:'rgba(239,68,68,0.1)', color:'#ef4444' }} onClick={() => handleReview(r._id, 'rejected')}><X size={14}/></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>No pending request to review.</p>
                    )}
                </div>

                {/* 🗳️ Live Elections */}
                <div className="fd-section">
                    <div className="fd-section-head">
                        <h3 className="fd-section-title"><Globe size={16} color="var(--primary)" /> Live Governance</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/faculty/monitoring')}>Observation Deck <ChevronRight size={14}/></button>
                    </div>
                    {elections.filter(e => e.status === 'active').slice(0, 3).map(e => (
                        <div key={e._id} className="fd-item">
                            <div className="fd-item-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>🗳️</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{e.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    {e.eligibleGroup} • {Math.round((new Date(e.endTime) - new Date()) / (1000*60*60*24))} days remaining
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/faculty/statistics/${e._id}`)}>Audit</button>
                        </div>
                    ))}
                    {elections.filter(e => e.status === 'active').length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>No live campaigns.</p>}
                </div>

                {/* 👥 Student Directory */}
                <div className="fd-section">
                    <div className="fd-section-head">
                        <h3 className="fd-section-title"><Users size={16} color="var(--primary)" /> Student Directory</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-main)', padding: '4px 12px', borderRadius: 12, border: '1px solid var(--border)' }}>
                            <Search size={14} color="var(--text-muted)" />
                            <input 
                                type="text" 
                                placeholder="Search students..." 
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none', width: 150 }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
                        {students.filter(s => 
                            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length > 0 ? (
                            students.filter(s => 
                                s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(s => (
                                <div key={s.registerNumber} className="fd-item" style={{ padding: '14px 18px', marginBottom: 8 }}>
                                    <div className="topbar-avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>{s.name[0]}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{s.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                            Reg: {s.registerNumber} • Dept: {s.department}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.05)', color: 'var(--primary)', fontWeight: 700 }}>STUDENT</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>{searchTerm ? 'No matching students found.' : 'Loading student directory...'}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="fd-side-col">
                <div className="fd-section">
                    <div className="fd-section-head">
                        <h3 className="fd-section-title"><Megaphone size={16} color="var(--primary)" /> Institutional Broadcasts</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {announcements.map((a, i) => (
                            <div key={i} style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: a.priority === 'Important' ? '#ef4444' : 'var(--primary)', color: 'white', textTransform: 'uppercase' }}>{a.priority}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(a.publishDate).toLocaleDateString()}</span>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.82rem' }}>{a.title}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }} className="truncate">{a.description}</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/faculty/announcements')}>Manage Communication</button>
                </div>
                
                <div className="fd-section" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))' }}>
                    <div className="fd-section-title" style={{ marginBottom: 12 }}><ShieldCheck size={16} color="var(--primary)" /> Integrity Audit</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>All faculty actions are cryptographically signed and logged for audit purposes to ensure election neutrality.</p>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default FacultyDashboard;
