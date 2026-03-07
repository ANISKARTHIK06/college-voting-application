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
                const res = await axios.get(`http://localhost:5000/api/votes/${id}`, {
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
            await axios.post(`http://localhost:5000/api/votes/${id}/cast`, {
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

    if (loading) return <div className="loader">Securing connection...</div>;
    if (!vote) return null;

    return (
        <div className="voting-interface animate-slideUp">
            <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px' }}>
                <div className="booth-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span className="status-pill active">Official Ballot</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '16px' }}>{vote.title}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{vote.description}</p>
                </div>

                <div className="candidates-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    {vote.candidates.map(candidate => (
                        <div 
                            key={candidate._id} 
                            className={`candidate-card glass-card ${selection === candidate._id ? 'selected' : ''}`}
                            onClick={() => setSelection(candidate._id)}
                            style={{ 
                                padding: '32px', 
                                textAlign: 'center', 
                                cursor: 'pointer',
                                border: selection === candidate._id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                background: selection === candidate._id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)'
                            }}
                        >
                            <div className="candidate-avatar" style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: 'var(--primary-light)', 
                                borderRadius: '50%', 
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'white',
                                fontWeight: 700
                            }}>
                                {candidate.name[0]}
                            </div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{candidate.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{candidate.description}</p>
                        </div>
                    ))}
                </div>

                <div className="booth-footer" style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '32px', textAlign: 'center' }}>
                    <div className="security-notice" style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        🔒 Encryption active. Your identity is anonymized in the final tally.
                    </div>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-auth glass-card" style={{ background: 'transparent', width: '200px' }} onClick={() => navigate('/user/dashboard')}>
                            Cancel
                        </button>
                        <button className="btn-auth" style={{ width: '200px' }} onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Encrypting...' : 'Cast Secret Ballot'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingInterface;
