import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidateManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vote, setVote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchVote();
    }, [id]);

    const fetchVote = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/votes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVote(res.data);
        } catch (error) {
            console.error('Failed to fetch vote');
            navigate('/admin/active-votes');
        } finally {
            setLoading(false);
        }
    };

    const handleCandidateChange = (index, field, value) => {
        const newCandidates = [...vote.candidates];
        newCandidates[index][field] = value;
        setVote({ ...vote, candidates: newCandidates });
    };

    const addCandidate = () => {
        setVote({ 
            ...vote, 
            candidates: [...vote.candidates, { name: '', description: '', image: '' }] 
        });
    };

    const removeCandidate = (index) => {
        const newCandidates = vote.candidates.filter((_, i) => i !== index);
        setVote({ ...vote, candidates: newCandidates });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/votes/${id}`, { candidates: vote.candidates }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Candidates updated successfully');
        } catch (error) {
            alert('Failed to update candidates');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader-spinner"></div>
                <p className="loader-text">Loading candidate roster...</p>
            </div>
        );
    }

    return (
        <div className="candidate-manager-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Candidate Management</h1>
                    <p className="page-subtitle">Configure participants and manifestos for <strong>{vote.title}</strong></p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/active-votes')}>Back</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main-col">
                    <div className="elections-grid" style={{ gridTemplateColumns: '1fr' }}>
                        {vote.candidates.map((c, i) => (
                            <div key={i} className="glass-panel animate-slideUp" style={{ padding: '32px', marginBottom: '24px', animationDelay: `${i * 0.1}s` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <h3 className="section-title">Candidate #{i + 1}</h3>
                                    {vote.candidates.length > 1 && (
                                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => removeCandidate(i)}>
                                            Remove Profile
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '32px' }}>
                                    <div style={{ flexShrink: 0 }}>
                                        <div 
                                            style={{ 
                                                width: '120px', 
                                                height: '120px', 
                                                background: 'var(--border-subtle)', 
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '3rem',
                                                overflow: 'hidden',
                                                border: '2px dashed var(--border)',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                const url = prompt('Enter image URL for candidate (mocking file upload):');
                                                if (url) handleCandidateChange(i, 'image', url);
                                            }}
                                        >
                                            {c.image ? <img src={c.image} alt="Candidate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                            {!c.image && <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>UPLOAD</div>}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                value={c.name}
                                                placeholder="Candidate full name"
                                                onChange={(e) => handleCandidateChange(i, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Manifesto / Mission Statement</label>
                                            <textarea 
                                                className="form-input" 
                                                rows="4"
                                                value={c.description}
                                                placeholder="Enter the candidate's manifesto or a short description..."
                                                onChange={(e) => handleCandidateChange(i, 'description', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button 
                            className="btn btn-secondary" 
                            style={{ width: '100%', padding: '24px', borderStyle: 'dashed', borderRadius: 'var(--radius-lg)' }}
                            onClick={addCandidate}
                        >
                            + Integrate New Candidate Profile
                        </button>
                    </div>
                </div>

                <div className="dashboard-side-col">
                    <div className="dashboard-card glass-panel">
                        <h3 className="section-title">Candidate Guidelines</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <p><strong>Imagery:</strong> Professional headshots increase candidate trust. Recommended size: 400x400px.</p>
                            <p><strong>Manifestos:</strong> Keep descriptions between 100-300 words for optimal readability in the voting booth.</p>
                            <p><strong>Equality:</strong> Ensure all candidates have similar lengths of manifestos to avoid biased presentation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateManager;
