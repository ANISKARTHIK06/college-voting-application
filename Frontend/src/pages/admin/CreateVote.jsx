import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateVote = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        votingType: 'Election',
        eligibleGroup: 'All Users',
        eligibleValues: [],
        startTime: '',
        endTime: '',
        candidates: [{ name: '', description: '' }]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCandidateChange = (index, field, value) => {
        const newCandidates = [...formData.candidates];
        newCandidates[index][field] = value;
        setFormData({ ...formData, candidates: newCandidates });
    };

    const addCandidate = () => {
        setFormData({ ...formData, candidates: [...formData.candidates, { name: '', description: '' }] });
    };

    const removeCandidate = (index) => {
        const newCandidates = formData.candidates.filter((_, i) => i !== index);
        setFormData({ ...formData, candidates: newCandidates });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/votes', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/active-votes');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create vote');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const steps = [
        { num: 1, label: 'Objective', desc: 'Campaign details' },
        { num: 2, label: 'Candidates', desc: 'Options & manifestos' },
        { num: 3, label: 'Logistics', desc: 'Eligibility & timing' },
        { num: 4, label: 'Verification', desc: 'Final review' },
    ];

    return (
        <div className="create-vote-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Initiate Voting Campaign</h1>
                    <p className="page-subtitle">Configure a secure and transparent election</p>
                </div>
            </div>

            {/* Stepper Logic */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
                    {steps.map((s) => (
                        <div 
                            key={s.num} 
                            style={{ 
                                padding: '24px', 
                                borderBottom: step === s.num ? '3px solid var(--primary)' : '1.5px solid var(--border)',
                                background: step === s.num ? 'var(--primary-glow)' : 'transparent',
                                transition: 'var(--transition)',
                                opacity: step >= s.num ? 1 : 0.5
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                    width: '24px', height: '24px', borderRadius: '50%', 
                                    background: step >= s.num ? 'var(--primary)' : 'var(--text-muted)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 800
                                }}>
                                    {s.num}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: step === s.num ? 'var(--primary)' : 'var(--text-main)' }}>{s.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main-col">
                    <div className="dashboard-card glass-panel animate-slideUp">
                        {step === 1 && (
                            <div className="step-content">
                                <h3 className="section-title">Step 1: Campaign Fundamentals</h3>
                                <div className="form-group">
                                    <label className="form-label">Campaign Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        className="form-input" 
                                        placeholder="e.g. Student Council President 2026" 
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>A clear, concise title for the ballot.</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description & Context</label>
                                    <textarea 
                                        name="description" 
                                        className="form-input" 
                                        rows="6" 
                                        placeholder="Explain the purpose of this vote and any relevant rules..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <h3 className="section-title">Step 2: Candidate Profiles</h3>
                                {formData.candidates.map((c, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '24px', marginBottom: '16px', position: 'relative' }}>
                                        <div className="form-grid-2">
                                            <div className="form-group">
                                                <label className="form-label">Candidate {i + 1} Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    value={c.name}
                                                    placeholder="Enter name"
                                                    onChange={(e) => handleCandidateChange(i, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Tagline / Short Manifesto</label>
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    value={c.description}
                                                    placeholder="e.g. Innovation for All"
                                                    onChange={(e) => handleCandidateChange(i, 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {formData.candidates.length > 1 && (
                                            <button 
                                                style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', color: 'var(--danger)' }}
                                                onClick={() => removeCandidate(i)}
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }} onClick={addCandidate}>
                                    + Add Candidate Profile
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <h3 className="section-title">Step 3: Governance Configuration</h3>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Voting Methodology</label>
                                        <select name="votingType" className="form-input" value={formData.votingType} onChange={handleChange}>
                                            <option>Election</option>
                                            <option>Approval</option>
                                            <option>Ranked</option>
                                            <option>Weighted</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Eligible Audience</label>
                                        <select name="eligibleGroup" className="form-input" value={formData.eligibleGroup} onChange={handleChange}>
                                            <option>All Users</option>
                                            <option>Department</option>
                                            <option>Year</option>
                                            <option>Staff Only</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Election Commencement</label>
                                        <input type="datetime-local" name="startTime" className="form-input" value={formData.startTime} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Election Conclusion</label>
                                        <input type="datetime-local" name="endTime" className="form-input" value={formData.endTime} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="step-content">
                                <h3 className="section-title">Step 4: Audit & Verification</h3>
                                <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                                        <label className="form-label">Campaign</label>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{formData.title || 'Untitled'}</div>
                                    </div>
                                    <div className="form-grid-2">
                                        <div>
                                            <label className="form-label">Methodology</label>
                                            <div style={{ fontWeight: 600 }}>{formData.votingType}</div>
                                        </div>
                                        <div>
                                            <label className="form-label">Target Audience</label>
                                            <div style={{ fontWeight: 600 }}>{formData.eligibleGroup}</div>
                                        </div>
                                    </div>
                                    <div className="form-grid-2">
                                        <div>
                                            <label className="form-label">Candidates</label>
                                            <div style={{ fontWeight: 600 }}>{formData.candidates.length} Registered</div>
                                        </div>
                                        <div>
                                            <label className="form-label">Status</label>
                                            <div className="badge badge-draft">Draft Analysis</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    🛡️ Ensuring blockchain-ready integrity seals...
                                </div>
                            </div>
                        )}

                        <div className="wizard-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                            <button 
                                className="btn btn-secondary" 
                                style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
                                onClick={prevStep}
                            >
                                Back
                            </button>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {step < 4 ? (
                                    <button className="btn btn-primary" onClick={nextStep}>
                                        Continue ⚡
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                        {loading ? 'Committing...' : 'Finalize & Launch'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="dashboard-side-col">
                    <div className="dashboard-card glass-panel">
                        <h4 className="section-title">Governance Tips</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p><strong>Methodology:</strong> Standardized "Election" is best for high-stakes leadership roles.</p>
                            <p><strong>Window:</strong> We recommend a 3-5 day voting window to maximize participation without losing momentum.</p>
                            <p><strong>Manifestos:</strong> Detailed manifestos increase voter confidence by 40%.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateVote;
