import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VotingInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vote, setVote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchVote = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/votes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVote(res.data);
            } catch (error) {
                alert('Election not found or access denied');
                navigate('/user/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchVote();
    }, [id]);

    const handleSubmit = async () => {
        if (!selection) return alert('Please select a candidate');
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/votes/${id}/cast`, {
                candidateId: selection
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Your vote has been securely cast!');
            navigate('/user/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cast vote');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
      return (
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <p className="loader-text">Securing end-to-end connection...</p>
        </div>
      );
    }
    
    if (!vote) return null;

    return (
        <div className="voting-interface-page">
            <div className="page-header" style={{ marginBottom: '48px', textAlign: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '700px' }}>
                    <span className="badge badge-published" style={{ marginBottom: '16px' }}>Official Secure Ballot</span>
                    <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{vote.title}</h1>
                    <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>{vote.description}</p>
                </div>
            </div>

            <div className="voting-booth-container animate-slideUp" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="candidates-selection-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '24px' 
                }}>
                    {vote.candidates.map(candidate => (
                        <div 
                            key={candidate._id} 
                            className={`candidate-card glass-panel ${selection === candidate._id ? 'selected' : ''}`}
                            onClick={() => setSelection(candidate._id)}
                            style={{ 
                                padding: '40px 32px', 
                                textAlign: 'center', 
                                cursor: 'pointer',
                                border: selection === candidate._id ? '3px solid var(--primary)' : '1px solid var(--glass-border)',
                                transform: selection === candidate._id ? 'translateY(-8px)' : 'none',
                                background: selection === candidate._id ? 'var(--primary-glow)' : 'var(--bg-card)',
                                boxShadow: selection === candidate._id ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        >
                            <div className="candidate-avatar animate-float" style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: selection === candidate._id ? 'var(--primary)' : 'var(--border-subtle)', 
                                borderRadius: '50%', 
                                margin: '0 auto 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: selection === candidate._id ? 'white' : 'var(--text-muted)',
                                fontWeight: 800,
                                border: `4px solid ${selection === candidate._id ? 'white' : 'var(--border)'}`,
                                transition: 'var(--transition)'
                            }}>
                                {candidate.name[0]}
                            </div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>{candidate.name}</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{candidate.description}</p>
                            
                            {selection === candidate._id && (
                              <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <span>✓ SELECTED</span>
                              </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="booth-footer glass-panel animate-slideUp" style={{ 
                    marginTop: '48px', 
                    padding: '32px', 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔒</span>
                        <span>Multi-layer encryption is active. Your identity is anonymized and your selection is private.</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/user/dashboard')}>
                            Exit Booth
                        </button>
                        <button 
                            className="btn btn-primary btn-lg" 
                            style={{ minWidth: '240px' }}
                            onClick={handleSubmit} 
                            disabled={submitting || !selection}
                        >
                            {submitting ? 'Sealing Ballot...' : 'Cast Secret Ballot ⚡'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingInterface;
