import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ShieldCheck, Eye, Check, Clock, Globe, ChevronDown,
    ChevronUp, Lock, CheckCircle
} from 'lucide-react';

const API = 'http://localhost:5000/api';

/* per-election: track which candidateId is selected */
const UserActiveVotes = () => {
    const [votes, setVotes]         = useState([]);
    const [loading, setLoading]     = useState(true);
    /* selections: { [voteId]: candidateId } */
    const [selections, setSelections]   = useState({});
    /* hasVoted: { [voteId]: true }  — populated from individual vote fetch */
    const [hasVoted, setHasVoted]       = useState({});
    /* expanded election detail (toggle description) */
    const [expanded, setExpanded]       = useState({});
    /* confirmation modal */
    const [confirmModal, setConfirmModal] = useState(null);  // { vote, candidate }
    const [submitting, setSubmitting]     = useState(false);
    const [lastVoted, setLastVoted]       = useState(null);  // voteId of last successful cast
    const navigate = useNavigate();

    useEffect(() => { fetchVotes(); }, []);

    const fetchVotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await axios.get(`${API}/votes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const activeOrEnded = res.data;
            setVotes(activeOrEnded);

            // Fetch hasVoted status for each election individually
            const votedMap = {};
            await Promise.all(activeOrEnded.map(async v => {
                try {
                    const r = await axios.get(`${API}/votes/${v._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (r.data.hasVoted) votedMap[v._id] = true;
                } catch {}
            }));
            setHasVoted(votedMap);
        } catch (err) {
            console.error('Failed to fetch active votes');
        } finally {
            setLoading(false);
        }
    };

    const selectCandidate = (voteId, candidateId) => {
        const vote = votes.find(v => v._id === voteId);
        // Don't allow selection if already voted or if vote is ended
        if (hasVoted[voteId] || (vote && vote.status !== 'active')) return;
        setSelections(prev => ({
            ...prev,
            [voteId]: prev[voteId] === candidateId ? null : candidateId  // toggle
        }));
    };

    const openConfirm = (vote, candidate) => {
        setConfirmModal({ vote, candidate });
    };

    const submitVote = async () => {
        if (!confirmModal) return;
        setSubmitting(true);
        const { vote, candidate } = confirmModal;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API}/votes/${vote._id}/cast`, {
                candidateId: candidate._id
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success(`✅ Voted for ${candidate.name}!`);
            setHasVoted(prev => ({ ...prev, [vote._id]: true }));
            setSelections(prev => ({ ...prev, [vote._id]: null }));
            setLastVoted(vote._id);
            setConfirmModal(null);

            // Clear success indicator after 4s
            setTimeout(() => setLastVoted(null), 4000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cast vote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = n => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : '?';

    if (loading) return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
            <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin-av 0.8s linear infinite' }} />
            <p style={{ color:'var(--text-muted)', fontWeight:600, fontSize:'0.875rem' }}>Opening the secure voting portal…</p>
            <style>{`@keyframes spin-av{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <>
        <style>{`
            .av-page { min-height:100vh; background:var(--bg-main); padding:32px; }
            .av-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
            .av-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .av-sub { color:var(--text-muted); font-size:0.875rem; margin-top:4px; font-weight:500; }
            /* election card */
            .av-election { background:var(--bg-card); border:1px solid var(--border); border-radius:22px; overflow:hidden; margin-bottom:28px; transition:box-shadow 0.2s; }
            .av-election.voted { border-color:#10b981; box-shadow:0 0 0 2px rgba(16,185,129,0.15); }
            .av-election.just-voted { border-color:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,0.2), 0 8px 32px rgba(16,185,129,0.15); animation:greenPulse 1.5s ease; }
            @keyframes greenPulse { 0%{box-shadow:0 0 0 4px rgba(16,185,129,0.3)} 100%{box-shadow:0 0 0 4px rgba(16,185,129,0.15)} }
            .av-el-header { padding:26px 30px; background:var(--bg-main); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; }
            .av-el-title { font-size:1.3rem; font-weight:800; color:var(--text-main); margin-bottom:5px; }
            .av-el-meta { font-size:0.78rem; color:var(--text-muted); font-weight:500; display:flex; gap:12px; flex-wrap:wrap; }
            .av-el-meta span { display:flex; align-items:center; gap:4px; }
            .av-tag { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:3px 9px; border-radius:6px; }
            .live-dot { width:8px; height:8px; border-radius:50%; background:#10b981; animation:puls 1.5s ease-in-out infinite; display:inline-block; margin-right:5px; }
            @keyframes puls { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
            .av-el-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
            /* toggle desc */
            .av-toggle-desc { font-size:0.75rem; color:var(--text-muted); background:none; border:1px solid var(--border); border-radius:8px; padding:5px 10px; cursor:pointer; display:flex; align-items:center; gap:4px; font-weight:600; transition:all 0.15s; }
            .av-toggle-desc:hover { border-color:var(--primary); color:var(--primary); }
            .av-desc { padding:16px 30px; background:rgba(99,102,241,0.03); border-bottom:1px solid var(--border); font-size:0.85rem; color:var(--text-muted); line-height:1.65; }
            /* already voted banner */
            .voted-banner { padding:16px 30px; background:rgba(16,185,129,0.07); border-bottom:1px solid rgba(16,185,129,0.2); display:flex; align-items:center; gap:10px; }
            .voted-banner-text { font-size:0.85rem; font-weight:700; color:#10b981; }
            /* candidates grid */
            .av-candidates { padding:24px 30px; display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
            /* candidate card */
            .av-cand-card { border-radius:16px; border:2px solid var(--border); background:var(--bg-main); padding:20px; cursor:pointer; transition:all 0.18s; display:flex; flex-direction:column; gap:14px; position:relative; }
            .av-cand-card:not(.voted-card):hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.12); }
            .av-cand-card.selected { border-color:var(--primary); background:rgba(99,102,241,0.05); box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
            .av-cand-card.voted-card { opacity:0.7; cursor:not-allowed; }
            .av-cand-card.winner-card { border-color:#10b981; background:rgba(16,185,129,0.05); opacity:1!important; cursor:default; }
            .selected-badge { position:absolute; top:12px; right:12px; width:26px; height:26px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; animation:popIn 0.2s ease; }
            @keyframes popIn { from{transform:scale(0)} to{transform:scale(1)} }
            .voted-badge { position:absolute; top:12px; right:12px; width:26px; height:26px; border-radius:50%; background:#10b981; display:flex; align-items:center; justify-content:center; }
            .av-cand-top { display:flex; gap:14px; align-items:center; }
            .av-cand-avatar { width:54px; height:54px; border-radius:14px; background:linear-gradient(135deg,var(--primary),var(--secondary)); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:800; color:white; flex-shrink:0; overflow:hidden; }
            .av-cand-name { font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:3px; }
            .av-cand-verified { display:flex; align-items:center; gap:4px; font-size:0.65rem; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; }
            .av-cand-desc { font-size:0.8rem; color:var(--text-muted); line-height:1.55; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
            .av-cand-actions { display:flex; gap:8px; }
            .av-btn-profile { flex:1; padding:9px; border-radius:10px; background:var(--bg-card); border:1px solid var(--border); font-weight:700; font-size:0.78rem; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.15s; }
            .av-btn-profile:hover { border-color:var(--primary); color:var(--primary); }
            .av-select-hint { font-size:0.72rem; color:var(--primary); font-weight:700; text-align:center; }
            /* submit row */
            .av-submit-row { padding:0 30px 24px; display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
            .av-submit-btn { padding:14px 28px; border-radius:14px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-weight:800; font-size:0.9rem; border:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.2s; box-shadow:0 4px 16px rgba(99,102,241,0.35); }
            .av-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,0.5); }
            .av-submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
            .av-submit-hint { font-size:0.78rem; color:var(--text-muted); font-weight:500; }
            /* confirmation modal */
            .av-modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.65); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:24px; animation:fdIn2 0.18s ease; }
            @keyframes fdIn2 { from{opacity:0} to{opacity:1} }
            .av-modal { background:var(--bg-card); border:1px solid var(--border); border-radius:24px; padding:36px; max-width:420px; width:100%; text-align:center; animation:slUp2 0.22s ease; }
            @keyframes slUp2 { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
            .av-modal-lock { width:72px; height:72px; border-radius:20px; background:linear-gradient(135deg,var(--primary),var(--secondary)); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
            .av-modal-title { font-size:1.2rem; font-weight:800; color:var(--text-main); margin-bottom:12px; }
            .av-modal-detail { background:var(--bg-main); border:1px solid var(--border); border-radius:14px; padding:16px 20px; margin-bottom:20px; }
            .av-modal-cand { font-size:1rem; font-weight:800; color:var(--text-main); }
            .av-modal-election { font-size:0.78rem; color:var(--text-muted); margin-top:4px; }
            .av-modal-warn { font-size:0.78rem; color:var(--text-muted); margin-bottom:24px; line-height:1.6; }
            .av-modal-actions { display:flex; gap:10px; }
            .av-modal-cancel { flex:1; padding:13px; border-radius:12px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-muted); font-weight:700; cursor:pointer; transition:all 0.15s; }
            .av-modal-cancel:hover { border-color:var(--primary); color:var(--primary); }
            .av-modal-confirm { flex:2; padding:13px; border-radius:12px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-weight:800; font-size:0.9rem; border:none; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 16px rgba(99,102,241,0.3); }
            .av-modal-confirm:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,0.45); }
            .av-modal-confirm:disabled { opacity:0.6; cursor:not-allowed; }
            /* empty */
            .av-empty { display:flex; flex-direction:column; align-items:center; padding:80px 24px; gap:14px; text-align:center; background:var(--bg-card); border:2px dashed var(--border); border-radius:24px; }
        `}</style>

        <div className="av-page">
            <div className="av-header">
                <div>
                    <h1 className="av-title">🏛️ Secure Voting Booth</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{ padding: '4px 10px', background: 'var(--primary-glow)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--primary)' }}>
                            <ShieldCheck size={14} color="var(--primary)" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End-to-End Encrypted</span>
                        </div>
                        <p className="av-sub" style={{ margin: 0 }}>Select a candidate to cast your secure ballot. Your choice is private and immutable.</p>
                    </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span className="av-tag" style={{ background:'rgba(16,185,129,0.1)', color:'#10b981' }}>
                        <span className="live-dot" />{votes.filter(v => v.status === 'active').length} Live Election{votes.filter(v => v.status === 'active').length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {votes.length === 0 ? (
                <div className="av-empty">
                    <div style={{ fontSize:'3.5rem' }}>🗳️</div>
                    <p style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text-main)' }}>No Active Elections</p>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', maxWidth:320 }}>
                        There are no open elections right now. Check back later or browse results.
                    </p>
                </div>
            ) : votes.map((vote, i) => {
                const alreadyVoted    = !!hasVoted[vote._id];
                const selectedCandId  = selections[vote._id];
                const selectedCand    = vote.candidates.find(c => c._id === selectedCandId);
                const isJustVoted     = lastVoted === vote._id;
                const isExpanded      = !!expanded[vote._id];

                return (
                    <div
                        key={vote._id}
                        className={`av-election ${alreadyVoted ? 'voted' : ''} ${isJustVoted ? 'just-voted' : ''}`}
                        style={{ animationDelay:`${i*0.08}s` }}
                    >
                        {/* Election Header */}
                        <div className="av-el-header">
                            <div>
                                <div className="av-el-title">{vote.title}</div>
                                <div className="av-el-meta">
                                    <span title="Target Audience"><Globe size={12} />{vote.eligibleGroup}</span>
                                    <span title="Commencement"><Clock size={12} />Starts: {new Date(vote.startTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    <span title="Conclusion" style={{ color: 'var(--primary)', fontWeight: 700 }}><Lock size={12} />Ends: {new Date(vote.endTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <div className="av-el-right">
                                {alreadyVoted && <span className="av-tag" style={{ background:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:'0.72rem', marginRight: '8px' }}>✅ VOTED</span>}
                                {vote.status !== 'active'
                                    ? <span className="av-tag" style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444' }}>ENDED</span>
                                    : <span className="av-tag" style={{ background:'rgba(16,185,129,0.1)', color:'#10b981' }}><span className="live-dot" />LIVE</span>
                                }
                                <button className="av-toggle-desc" onClick={() => setExpanded(p=>({...p,[vote._id]:!p[vote._id]}))}>
                                    {isExpanded ? <><ChevronUp size={13} /> Hide</> : <><ChevronDown size={13} /> Details</>}
                                </button>
                            </div>
                        </div>

                        {/* Expandable description */}
                        {isExpanded && <div className="av-desc">{vote.description}</div>}

                        {/* Already voted banner */}
                        {alreadyVoted && (
                            <div className="voted-banner">
                                <CheckCircle size={18} color="#10b981" />
                                <span className="voted-banner-text">You have already cast your ballot for this election.</span>
                            </div>
                        )}

                        {/* Candidates Grid */}
                        <div className="av-candidates">
                            {vote.candidates.length === 0 ? (
                                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', gridColumn:'1/-1' }}>
                                    No candidates have been registered for this election yet.
                                </p>
                            ) : vote.candidates.map(cand => {
                                const isSelected = selectedCandId === cand._id;
                                return (
                                    <div
                                        key={cand._id}
                                        className={`av-cand-card ${isSelected ? 'selected' : ''} ${alreadyVoted || vote.status !== 'active' ? 'voted-card' : ''}`}
                                        onClick={() => selectCandidate(vote._id, cand._id)}
                                        title={alreadyVoted ? 'You already voted in this election' : vote.status !== 'active' ? 'Election has ended' : `Click to select ${cand.name}`}
                                    >
                                        {/* Selection indicator */}
                                        {isSelected && !alreadyVoted && (
                                            <div className="selected-badge">
                                                <Check size={14} color="white" strokeWidth={3} />
                                            </div>
                                        )}

                                        {/* Candidate info */}
                                        <div className="av-cand-top">
                                            <div className="av-cand-avatar">
                                                {cand.image
                                                    ? <img src={cand.image} alt={cand.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                                    : getInitials(cand.name)
                                                }
                                            </div>
                                            <div>
                                                <div className="av-cand-name">{cand.name}</div>
                                                <div className="av-cand-verified">
                                                    <ShieldCheck size={11} /> Verified
                                                </div>
                                            </div>
                                        </div>

                                        <p className="av-cand-desc">
                                            {cand.description || 'No manifesto provided for this candidate.'}
                                        </p>

                                        {/* Actions */}
                                        <div className="av-cand-actions" onClick={e => e.stopPropagation()}>
                                            <button
                                                className="av-btn-profile"
                                                onClick={() => navigate(`/student/candidate/${cand._id}`)}
                                            >
                                                <Eye size={14} /> View Profile
                                            </button>
                                        </div>

                                        {isSelected && !alreadyVoted && (
                                            <div className="av-select-hint">✓ Selected — submit below</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Submit row */}
                        {!alreadyVoted && vote.status === 'active' && (
                            <div className="av-submit-row">
                                <button
                                    className="av-submit-btn"
                                    disabled={!selectedCandId}
                                    onClick={() => openConfirm(vote, selectedCand)}
                                >
                                    <Lock size={16} />
                                    {selectedCandId ? `Submit Vote for "${selectedCand?.name}"` : 'Select a Candidate'}
                                </button>
                                {!selectedCandId && (
                                    <span className="av-submit-hint">👆 Click any candidate card above to make your selection</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Confirmation Modal */}
        {confirmModal && (
            <div className="av-modal-overlay" onClick={e => e.target===e.currentTarget && !submitting && setConfirmModal(null)}>
                <div className="av-modal">
                    <div className="av-modal-lock">
                        <Lock size={30} color="white" />
                    </div>
                    <div className="av-modal-title">Confirm Your Ballot</div>
                    <div className="av-modal-detail">
                        <div className="av-modal-cand">🗳️ {confirmModal.candidate?.name}</div>
                        <div className="av-modal-election">{confirmModal.vote?.title}</div>
                    </div>
                    <p className="av-modal-warn">
                        You are about to securely submit your vote. This action is <strong>final and cannot be reversed.</strong> Please confirm your choice.
                    </p>
                    <div className="av-modal-actions">
                        <button className="av-modal-cancel" onClick={() => setConfirmModal(null)} disabled={submitting}>
                            Cancel
                        </button>
                        <button className="av-modal-confirm" onClick={submitVote} disabled={submitting}>
                            {submitting
                                ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', animation:'spin-av 0.7s linear infinite' }} /> Encrypting…</>
                                : <><Check size={16} strokeWidth={3} /> Confirm Vote</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default UserActiveVotes;
