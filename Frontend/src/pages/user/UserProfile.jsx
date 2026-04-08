import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import {
    User, Mail, BookOpen, Calendar, Award, CheckCircle,
    Shield, Phone, MapPin, Clock, Edit3, Key, LogOut,
    Vote, Bell, Star, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ME';

const ROLE_CONFIG = {
    admin:   { label: 'Administrator', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   badge: '🛡️ Admin'    },
    faculty: { label: 'Faculty',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', badge: '🎓 Faculty'  },
    student: { label: 'Student',       color: '#6366f1', bg: 'rgba(99,102,241,0.1)', badge: '🎓 Student'  },
};

const MOCK_HISTORY = [
    { id: 1, title: 'Cultural Head Election 2026', date: 'Oct 15, 2025', candidate: 'Priya Patel' },
    { id: 2, title: 'Department Representative',  date: 'Sep 01, 2025', candidate: 'Rahul Sharma' },
];

const UserProfile = () => {
    const navigate   = useNavigate();
    const [user, setUser]       = useState(null);
    const [history]             = useState(MOCK_HISTORY);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const u = getCurrentUser();
        setUser(u);
        setEditData({ name: u?.name || '', email: u?.email || '', phone: u?.phone || '', department: u?.department || '', position: u?.position || '' });
    }, []);

    if (!user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    );

    const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.student;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const accountDetails = [
        { icon: Mail,      label: 'Email Address',   value: user.email },
        { icon: Phone,     label: 'Phone',            value: user.phone || 'Not provided' },
        { icon: BookOpen,  label: 'Department',       value: user.department || 'General' },
        { icon: MapPin,    label: 'Position / Year',  value: user.position || 'N/A' },
        { icon: Calendar,  label: 'Member Since',     value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
        { icon: Shield,    label: 'Role',             value: role.label },
        { icon: Activity,  label: 'Account Status',   value: 'Active & Verified' },
        { icon: Key,       label: 'Auth Provider',    value: 'Email / Password' },
    ];

    return (
        <>
        <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            .profile-page { min-height: 100vh; background: var(--bg-main); padding: 32px; }
            .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: 28px; align-items: start; }
            @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }
            /* Left card */
            .profile-identity { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 36px 28px; text-align: center; position: relative; overflow: hidden; }
            .profile-identity::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 100px; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0.08; }
            .profile-avatar-wrap { position: relative; display: inline-block; margin-bottom: 20px; }
            .profile-avatar { width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 8px 32px rgba(99,102,241,0.35); border: 4px solid var(--bg-card); }
            .profile-edit-avatar { position: absolute; bottom: 4px; right: 4px; width: 30px; height: 30px; border-radius: 50%; background: var(--primary); color: white; border: 2px solid var(--bg-card); display: flex; align-items: center; justify-content: center; cursor: pointer; }
            .profile-name { font-size: 1.35rem; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin-bottom: 6px; }
            .role-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 14px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 28px; }
            .profile-quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
            .pqs-card { background: var(--bg-main); border: 1px solid var(--border); border-radius: 14px; padding: 14px; text-align: center; }
            .pqs-val { font-size: 1.4rem; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); }
            .pqs-lbl { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }
            .profile-actions { display: flex; flex-direction: column; gap: 10px; }
            .profile-btn { width: 100%; padding: 11px 16px; border-radius: 12px; font-weight: 700; font-size: 0.82rem; border: 1.5px solid var(--border); background: var(--bg-main); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.18s; }
            .profile-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(99,102,241,0.05); }
            .profile-btn.danger:hover { border-color: var(--danger); color: var(--danger); background: rgba(239,68,68,0.05); }
            .profile-btn.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
            .profile-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); border: none; color: white; background: linear-gradient(135deg, var(--primary), var(--secondary)); }
            /* Right side */
            .profile-right { display: flex; flex-direction: column; gap: 20px; }
            .detail-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
            .detail-card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-main); }
            .detail-card-title { font-size: 0.85rem; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.07em; display: flex; align-items: center; gap: 8px; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
            @media (max-width: 600px) { .detail-grid { grid-template-columns: 1fr; } }
            .detail-row { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 14px; }
            .detail-row:last-child { border-bottom: none; }
            .detail-row:nth-child(even) { border-left: 1px solid var(--border); }
            @media (max-width: 600px) { .detail-row:nth-child(even) { border-left: none; } }
            .detail-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(99,102,241,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary); }
            .detail-label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 3px; }
            .detail-value { font-size: 0.875rem; font-weight: 600; color: var(--text-main); word-break: break-word; }
            /* Edit form */
            .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
            .edit-field { padding: 14px 20px; border-bottom: 1px solid var(--border); }
            .edit-field:nth-child(even) { border-left: 1px solid var(--border); }
            .edit-field:last-child { border-bottom: none; }
            .edit-lbl { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 6px; }
            .edit-ctrl { width: 100%; background: var(--bg-main); border: 1.5px solid var(--border); border-radius: 9px; padding: 9px 12px; color: var(--text-main); font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
            .edit-ctrl:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99,102,241,0.1); }
            .edit-actions { padding: 16px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
            /* History */
            .history-item { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 12px; transition: background 0.15s; }
            .history-item:last-child { border-bottom: none; }
            .history-item:hover { background: rgba(99,102,241,0.03); }
            .history-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(99,102,241,0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .history-title { font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-bottom: 3px; }
            .history-sub { font-size: 0.75rem; color: var(--text-muted); }
            .voted-badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; padding: 4px 10px; border-radius: 6px; background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); white-space: nowrap; }
        `}</style>

        <div className="profile-page">
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>
                    My Profile
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4, fontWeight: 500 }}>
                    Manage your account details and view your activity.
                </p>
            </div>

            <div className="profile-grid">
                {/* ── Left: Identity ── */}
                <div className="profile-identity">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{getInitials(user.name)}</div>
                        <div className="profile-edit-avatar" onClick={() => setEditMode(true)}>
                            <Edit3 size={13} />
                        </div>
                    </div>
                    <div className="profile-name">{user.name}</div>
                    <div className="role-badge" style={{ background: role.bg, color: role.color }}>
                        {role.badge}
                    </div>

                    <div className="profile-quick-stats">
                        <div className="pqs-card">
                            <div className="pqs-val">{history.length}</div>
                            <div className="pqs-lbl">Votes Cast</div>
                        </div>
                        <div className="pqs-card">
                            <div className="pqs-val" style={{ color: '#f59e0b' }}>{history.length * 50}</div>
                            <div className="pqs-lbl">Civic Score</div>
                        </div>
                        <div className="pqs-card">
                            <div className="pqs-val" style={{ color: '#10b981' }}>100%</div>
                            <div className="pqs-lbl">Integrity</div>
                        </div>
                        <div className="pqs-card">
                            <div className="pqs-val" style={{ color: 'var(--primary)' }}>#{Math.floor(Math.random()*900)+100}</div>
                            <div className="pqs-lbl">Member ID</div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="profile-btn primary" onClick={() => setEditMode(true)}>
                            <Edit3 size={15} /> Edit Profile
                        </button>
                        <button className="profile-btn danger" onClick={handleLogout}>
                            <LogOut size={15} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* ── Right ── */}
                <div className="profile-right">
                    {/* Account Details */}
                    <div className="detail-card">
                        <div className="detail-card-header">
                            <div className="detail-card-title">
                                <User size={15} color="var(--primary)" /> Account Details
                            </div>
                            <button
                                className="profile-btn"
                                style={{ width: 'auto', padding: '7px 14px' }}
                                onClick={() => setEditMode(!editMode)}
                            >
                                <Edit3 size={13} /> {editMode ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {editMode ? (
                            <>
                            <div className="edit-grid">
                                {[
                                    { key: 'name',       label: 'Full Name'   },
                                    { key: 'email',      label: 'Email'       },
                                    { key: 'phone',      label: 'Phone'       },
                                    { key: 'department', label: 'Department'  },
                                    { key: 'position',   label: 'Position / Year' },
                                ].map(f => (
                                    <div className="edit-field" key={f.key}>
                                        <div className="edit-lbl">{f.label}</div>
                                        <input
                                            className="edit-ctrl"
                                            value={editData[f.key] || ''}
                                            onChange={e => setEditData({ ...editData, [f.key]: e.target.value })}
                                            placeholder={`Enter ${f.label.toLowerCase()}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="edit-actions">
                                <button className="profile-btn" style={{ width: 'auto' }} onClick={() => setEditMode(false)}>Cancel</button>
                                <button
                                    className="profile-btn primary"
                                    style={{ width: 'auto' }}
                                    onClick={() => {
                                        const updated = { ...user, ...editData };
                                        localStorage.setItem('user', JSON.stringify(updated));
                                        setUser(updated);
                                        setEditMode(false);
                                    }}
                                >
                                    <CheckCircle size={14} /> Save Changes
                                </button>
                            </div>
                            </>
                        ) : (
                            <div className="detail-grid">
                                {accountDetails.map(({ icon: Icon, label, value }) => (
                                    <div className="detail-row" key={label}>
                                        <div className="detail-icon"><Icon size={16} /></div>
                                        <div>
                                            <div className="detail-label">{label}</div>
                                            <div className="detail-value">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Voting History */}
                    <div className="detail-card">
                        <div className="detail-card-header">
                            <div className="detail-card-title">
                                <Vote size={15} color="var(--primary)" /> Voting History
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{history.length} records</span>
                        </div>
                        {history.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                No voting records yet.
                            </div>
                        ) : (
                            history.map(h => (
                                <div className="history-item" key={h.id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div className="history-icon"><Vote size={18} /></div>
                                        <div>
                                            <div className="history-title">{h.title}</div>
                                            <div className="history-sub">Voted for: <strong style={{ color: 'var(--primary)' }}>{h.candidate}</strong></div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div className="voted-badge">✓ Voted</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>{h.date}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default UserProfile;
