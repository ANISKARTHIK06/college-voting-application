import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../../components/shared/CountdownTimer';
import { Eye, ShieldCheck } from 'lucide-react';

const UserActiveVotes = () => {
    // ... existing state
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [votedSuccess, setVotedSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVotes();
    }, []);

    const fetchVotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/votes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter active votes
            setVotes(res.data.filter(v => v.status === 'active'));
        } catch (error) {
            console.error('Failed to fetch active votes');
        } finally {
            setLoading(false);
        }
    };

    const handleVoteClick = (election, candidate) => {
        setSelectedElection(election);
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    const confirmVote = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/votes/${selectedElection._id}/cast`, {
                candidateId: selectedCandidate._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVotedSuccess(true);
            setShowModal(false);
            // Refresh votes after a short delay
            setTimeout(() => {
              setVotedSuccess(false);
              fetchVotes();
            }, 3000);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to record vote');
            setShowModal(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader-spinner"></div>
                <p className="loader-text">Opening the secure voting portal...</p>
            </div>
        );
    }

    if (votedSuccess) {
        return (
            <div className="voting-success-overlay animate-fadeIn">
                <div className="success-content glass-panel animate-float">
                    <div className="success-icon">✅</div>
                    <h2 className="page-title">Ballot Successfully Cast</h2>
                    <p className="page-subtitle">Your vote has been securely recorded and encrypted.</p>
                    <div style={{ marginTop: '32px' }}>
                        <button className="btn btn-primary" onClick={() => setVotedSuccess(false)}>Continue Browsing</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="active-voting-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Secure Voting Booth</h1>
                    <p className="page-subtitle">Exercise your right to institutional governance</p>
                </div>
                <div className="page-header-actions">
                    <div className="badge badge-active">Live Sessions</div>
                </div>
            </div>

            <div className="elections-stack">
                {votes.length > 0 ? votes.map((vote, i) => (
                    <div key={vote._id} className="election-booth-card glass-panel animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, marginBottom: '48px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--glass-bg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{vote.title}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{vote.department || 'All Departments'} • {vote.votingType}</p>
                                </div>
                                <div className="animate-pulse">
                                    <CountdownTimer endTime={vote.endTime} onExpire={fetchVotes} />
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-main)', opacity: 0.8, lineHeight: '1.6', maxWidth: '800px' }}>{vote.description}</p>
                        </div>

                        <div style={{ padding: '32px' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Select Your Candidate</h4>
                            <div className="candidates-roster" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                {vote.candidates.map((candidate) => (
                                    <div key={candidate._id} className="candidate-booth-item glass-card hover-lift" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div className="candidate-avatar" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white', fontWeight: 800, flexShrink: 0 }}>
                                                {candidate.image ? <img src={candidate.image} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} /> : candidate.name[0]}
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{candidate.name}</h4>
                                                <div className="flex items-center gap-1 text-[0.65rem] text-primary font-bold uppercase">
                                                    <ShieldCheck size={10} /> Verified Identity
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', height: '68px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                                            {candidate.description || "No manifesto provided for this candidate."}
                                        </p>
                                        <div className="flex gap-3">
                                            <button 
                                                className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-2"
                                                onClick={() => navigate(`/user/candidate/${candidate._id}`)}
                                            >
                                                <Eye size={14} /> Profile
                                            </button>
                                            <button 
                                                className="btn btn-primary btn-sm flex-[2] flex items-center justify-center gap-2 shadow-lg shadow-primary/20" 
                                                onClick={() => handleVoteClick(vote, candidate)}
                                            >
                                                ⚡ Vote
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏛️</div>
                        <p className="empty-state-text">There are no active elections in your department at this time.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay animate-fadeIn">
                    <div className="modal-content glass-panel animate-slideUp" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔐</div>
                        <h3 className="section-title">Confirm Secure Ballot</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
                            You are about to cast your vote for <strong>{selectedCandidate.name}</strong> in the <strong>{selectedElection.title}</strong>. 
                            <br /><br />
                            This action is final and cannot be reversed.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmVote} disabled={submitting}>
                                {submitting ? 'Encrypting...' : 'Yes, Confirm Vote'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserActiveVotes;
