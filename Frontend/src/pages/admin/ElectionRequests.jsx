import React, { useState, useEffect } from 'react';
import http from '@/config/http';
import { toast } from 'react-hot-toast';
import {
    Vote, Clock, Check, X, ChevronDown, ChevronUp,
    User, Mail, BookOpen, Calendar, AlertCircle, Filter
} from 'lucide-react';

// API usage will now use http instance

const STATUS_META = {
    pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'Pending Review' },
    approved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Approved'        },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Rejected'        },
};

const ElectionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [filter, setFilter]     = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [reviewModal, setReviewModal] = useState(null); // { id, action: 'approved'|'rejected' }
    const [reviewNote, setReviewNote]   = useState('');
    const [submitting, setSubmitting]   = useState(false);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await http.get('/election-requests');
            setRequests(res.data);
        } catch (err) { 
            console.error('Fetch error:', err);
            toast.error('Failed to load election requests'); 
        } finally  { setLoading(false); }
    };

    const handleReview = async () => {
        if (!reviewModal) return;
        setSubmitting(true);
        try {
            await http.patch(`/election-requests/${reviewModal.id}`, {
                status: reviewModal.action,
                reviewNote,
            });
            toast.success(reviewModal.action === 'approved'
                ? '✅ Request approved! Draft election created.'
                : '❌ Request rejected. Student notified.');
            setReviewModal(null);
            setReviewNote('');
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally { setSubmitting(false); }
    };

    const filtered = requests.filter(r =>
        filter === 'all' ? true : r.status === filter
    );

    const counts = {
        all:      requests.length,
        pending:  requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    return (
        <>
        <style>{`
            .er-admin-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            .era-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; gap:16px; flex-wrap:wrap; }
            .era-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .era-sub { color:var(--text-muted); font-size:0.875rem; margin-top:4px; font-weight:500; }
            /* stats row */
            .era-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
            @media(max-width:768px){ .era-stats{ grid-template-columns:repeat(2,1fr); } }
            .era-stat { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:all 0.18s; }
            .era-stat:hover { transform:translateY(-2px); border-color:var(--primary); }
            .era-stat.active { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .era-stat-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .era-stat-val { font-size:1.4rem; font-weight:800; font-family:var(--font-heading); color:var(--text-main); line-height:1; }
            .era-stat-lbl { font-size:0.68rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-top:2px; }
            /* cards */
            .era-list { display:flex; flex-direction:column; gap:14px; }
            .era-card { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; overflow:hidden; transition:border-color 0.18s; }
            .era-card:hover { border-color:rgba(99,102,241,0.3); }
            .era-card-top { padding:20px 24px; display:flex; gap:16px; align-items:flex-start; }
            .era-card-left { flex:1; min-width:0; }
            .era-card-title { font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:6px; }
            .era-card-badges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
            .era-badge { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:3px 9px; border-radius:6px; }
            .era-meta { display:flex; gap:16px; font-size:0.75rem; color:var(--text-muted); flex-wrap:wrap; }
            .era-meta-item { display:flex; align-items:center; gap:5px; }
            .era-card-right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; flex-shrink:0; }
            .era-status-badge { padding:5px 12px; border-radius:8px; font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; }
            /* expand zone */
            .era-expand { border-top:1px solid var(--border); background:var(--bg-main); padding:16px 24px; display:flex; gap:32px; flex-wrap:wrap; }
            .era-expand-field { display:flex; flex-direction:column; gap:3px; min-width:150px; }
            .era-expand-lbl { font-size:0.66rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); }
            .era-expand-val { font-size:0.82rem; font-weight:600; color:var(--text-main); }
            .era-expand-desc { font-size:0.82rem; color:var(--text-muted); line-height:1.6; max-width:600px; }
            /* requester */
            .requester-chip { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; background:var(--bg-main); border:1px solid var(--border); border-radius:20px; }
            .req-avatar { width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-size:0.65rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            /* action buttons */
            .era-actions { display:flex; gap:8px; flex-wrap:wrap; }
            .btn-approve { padding:8px 16px; border-radius:10px; background:rgba(16,185,129,0.1); color:#10b981; border:1px solid rgba(16,185,129,0.3); font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s; }
            .btn-approve:hover { background:rgba(16,185,129,0.18); border-color:#10b981; }
            .btn-reject { padding:8px 16px; border-radius:10px; background:rgba(239,68,68,0.08); color:#ef4444; border:1px solid rgba(239,68,68,0.25); font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s; }
            .btn-reject:hover { background:rgba(239,68,68,0.15); border-color:#ef4444; }
            .btn-expand { padding:8px 12px; border-radius:10px; background:var(--bg-main); color:var(--text-muted); border:1px solid var(--border); cursor:pointer; display:flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:700; transition:all 0.15s; }
            .btn-expand:hover { border-color:var(--primary); color:var(--primary); }
            /* modal */
            .modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn 0.18s ease; }
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            .modal-box { background:var(--bg-card); border:1px solid var(--border); border-radius:22px; padding:32px; width:100%; max-width:460px; animation:slideUp 0.22s ease; }
            @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
            .modal-title { font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:8px; }
            .modal-sub { font-size:0.82rem; color:var(--text-muted); margin-bottom:20px; line-height:1.5; }
            .modal-lbl { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); margin-bottom:7px; }
            .modal-ctrl { width:100%; padding:12px 15px; background:var(--bg-main); border:1.5px solid var(--border); border-radius:12px; color:var(--text-main); font-family:var(--font-body); font-size:0.875rem; outline:none; resize:none; line-height:1.6; transition:border-color 0.15s; }
            .modal-ctrl:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .modal-actions { display:flex; gap:10px; margin-top:20px; }
            .modal-confirm { flex:1; padding:13px; border-radius:12px; font-weight:700; font-size:0.875rem; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.18s; }
            /* empty */
            .era-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; gap:14px; text-align:center; background:var(--bg-card); border:2px dashed var(--border); border-radius:22px; }
            .spin { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation:spin 0.8s linear infinite; }
            @keyframes spin { to{ transform:rotate(360deg); } }
        `}</style>

        <div className="er-admin-page">
            <div className="era-header">
                <div>
                    <h1 className="era-title">Election Requests</h1>
                    <p className="era-sub">Review and approve student-proposed elections.</p>
                </div>
            </div>

            {/* Stats / Filters */}
            <div className="era-stats">
                {[
                    { key:'all',      label:'Total',    color:'#6366f1' },
                    { key:'pending',  label:'Pending',  color:'#f59e0b' },
                    { key:'approved', label:'Approved', color:'#10b981' },
                    { key:'rejected', label:'Rejected', color:'#ef4444' },
                ].map(({ key, label, color }) => (
                    <div
                        key={key}
                        className={`era-stat ${filter===key?'active':''}`}
                        onClick={() => setFilter(key)}
                    >
                        <div className="era-stat-icon" style={{ background:`${color}18` }}>
                            <Filter size={18} style={{ color }} />
                        </div>
                        <div>
                            <div className="era-stat-val">{counts[key]}</div>
                            <div className="era-stat-lbl">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px', gap:14 }}>
                    <div className="spin" />
                    <p style={{ color:'var(--text-muted)', fontWeight:600, fontSize:'0.875rem' }}>Loading requests…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="era-empty">
                    <div style={{ width:64, height:64, borderRadius:18, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Vote size={28} color="var(--primary)" />
                    </div>
                    <p style={{ fontWeight:700, color:'var(--text-main)' }}>No Requests Here</p>
                    <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>No election proposals match this filter.</p>
                </div>
            ) : (
                <div className="era-list">
                    {filtered.map(r => {
                        const s  = STATUS_META[r.status];
                        const isOpen = expanded === r._id;
                        const getInitials = n => n ? n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2) : '??';
                        return (
                            <div className="era-card" key={r._id}>
                                <div className="era-card-top">
                                    <div className="era-card-left">
                                        <div className="era-card-title">{r.title}</div>
                                        <div className="era-card-badges">
                                            <span className="era-badge" style={{ background:'var(--bg-main)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>{r.eligibleGroup}</span>
                                        </div>
                                        <div className="era-meta">
                                            <span className="era-meta-item">
                                                <div className="requester-chip">
                                                    <div className="req-avatar">{getInitials(r.requestedBy?.name)}</div>
                                                    <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-main)' }}>{r.requestedBy?.name || 'Unknown'}</span>
                                                    <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{r.requestedBy?.department || ''}</span>
                                                </div>
                                            </span>
                                            <span className="era-meta-item"><Calendar size={12} />{new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="era-card-right">
                                        <span className="era-status-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                                        <div className="era-actions">
                                            {r.status === 'pending' && (
                                                <>
                                                <button className="btn-approve" onClick={() => { setReviewModal({ id:r._id, action:'approved', title:r.title }); setReviewNote(''); }}>
                                                    <Check size={14} /> Approve
                                                </button>
                                                <button className="btn-reject" onClick={() => { setReviewModal({ id:r._id, action:'rejected', title:r.title }); setReviewNote(''); }}>
                                                    <X size={14} /> Reject
                                                </button>
                                                </>
                                            )}
                                            <button className="btn-expand" onClick={() => setExpanded(isOpen ? null : r._id)}>
                                                Details {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="era-expand">
                                        <div className="era-expand-field" style={{ flex:2, minWidth:200 }}>
                                            <div className="era-expand-lbl">Description / Rationale</div>
                                            <div className="era-expand-desc">{r.description}</div>
                                        </div>
                                        <div className="era-expand-field">
                                            <div className="era-expand-lbl">Proposed Start</div>
                                            <div className="era-expand-val">{new Date(r.startTime).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                                        </div>
                                        <div className="era-expand-field">
                                            <div className="era-expand-lbl">Proposed End</div>
                                            <div className="era-expand-val">{new Date(r.endTime).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                                        </div>
                                        {r.eligibleValues?.length > 0 && (
                                            <div className="era-expand-field">
                                                <div className="era-expand-lbl">Target Values</div>
                                                <div className="era-expand-val">{r.eligibleValues.join(', ')}</div>
                                            </div>
                                        )}
                                        {r.candidates?.length > 0 && (
                                            <div className="era-expand-field" style={{ flex: '1 1 100%' }}>
                                                <div className="era-expand-lbl">Proposed Candidates</div>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                                    {r.candidates.map((c, idx) => (
                                                        <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}>
                                                            <div style={{ fontWeight: 700 }}>{c.name}</div>
                                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reg: {c.registerNumber}</div>
                                                            {c.description && <div style={{ fontStyle: 'italic', marginTop: '4px' }}>"{c.description}"</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {r.reviewNote && (
                                            <div className="era-expand-field" style={{ flex:2 }}>
                                                <div className="era-expand-lbl">Admin Review Note</div>
                                                <div className="era-expand-desc" style={{ fontStyle:'italic' }}>"{r.reviewNote}"</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Review Modal */}
        {reviewModal && (
            <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setReviewModal(null)}>
                <div className="modal-box">
                    <div className="modal-title">
                        {reviewModal.action === 'approved' ? '✅ Approve Request' : '❌ Reject Request'}
                    </div>
                    <div className="modal-sub">
                        {reviewModal.action === 'approved'
                            ? `Approving "${reviewModal.title}" will auto-create a draft election. You can then add candidates and launch it from the Elections page.`
                            : `Rejecting "${reviewModal.title}" will notify the student. Please provide a reason.`
                        }
                    </div>
                    <div className="modal-lbl">Review Note {reviewModal.action==='rejected'&&'*'}</div>
                    <textarea
                        rows={4}
                        className="modal-ctrl"
                        placeholder={reviewModal.action === 'approved' ? 'Optional message to the student…' : 'Explain the reason for rejection…'}
                        value={reviewNote}
                        onChange={e => setReviewNote(e.target.value)}
                    />
                    <div className="modal-actions">
                        <button className="modal-confirm" style={{ background:'var(--bg-main)', color:'var(--text-muted)', border:'1px solid var(--border)' }} onClick={() => setReviewModal(null)}>
                            Cancel
                        </button>
                        <button
                            className="modal-confirm"
                            style={{ background: reviewModal.action==='approved' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color:'white', border:'none', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}
                            onClick={handleReview}
                            disabled={submitting || (reviewModal.action==='rejected' && !reviewNote.trim())}
                        >
                            {submitting ? 'Processing…' : reviewModal.action==='approved' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ElectionRequests;
