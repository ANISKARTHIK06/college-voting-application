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

    return (
        <div className="create-vote-page animate-slideUp">
            <div className="section-header">
                <h2 className="section-title">Initiate New Voting Campaign</h2>
                <div className="step-progress">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`}>
                            {s}
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                {step === 1 && (
                    <div className="step-content">
                        <h3>1. Basic Information</h3>
                        <div className="form-group">
                            <label>Campaign Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="auth-input" 
                                placeholder="e.g. Student Council 2026" 
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description & Objectives</label>
                            <textarea 
                                name="description" 
                                className="auth-input" 
                                rows="5" 
                                placeholder="Describe the purpose of this vote..."
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h3>2. Candidates & Options</h3>
                        {formData.candidates.map((c, i) => (
                            <div key={i} className="candidate-form-row glass-card" style={{ padding: '20px', marginBottom: '16px', position: 'relative' }}>
                                <div className="form-group">
                                    <label>Candidate {i + 1} Name</label>
                                    <input 
                                        type="text" 
                                        className="auth-input" 
                                        value={c.name}
                                        onChange={(e) => handleCandidateChange(i, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Brief Manifesto</label>
                                    <input 
                                        type="text" 
                                        className="auth-input" 
                                        value={c.description}
                                        onChange={(e) => handleCandidateChange(i, 'description', e.target.value)}
                                    />
                                </div>
                                {formData.candidates.length > 1 && (
                                    <button className="remove-btn" onClick={() => removeCandidate(i)}>✕</button>
                                )}
                            </div>
                        ))}
                        <button className="btn-small glass-card" style={{ width: '100%' }} onClick={addCandidate}>
                            + Add Candidate
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h3>3. Configuration & Target</h3>
                        <div className="register-grid">
                            <div className="form-group">
                                <label>Voting Methodology</label>
                                <select name="votingType" className="auth-input" value={formData.votingType} onChange={handleChange}>
                                    <option>Election</option>
                                    <option>Approval</option>
                                    <option>Ranked</option>
                                    <option>Weighted</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Eligible Audience</label>
                                <select name="eligibleGroup" className="auth-input" value={formData.eligibleGroup} onChange={handleChange}>
                                    <option>All Users</option>
                                    <option>Department</option>
                                    <option>Year</option>
                                    <option>Staff Only</option>
                                </select>
                            </div>
                        </div>
                        <div className="register-grid">
                            <div className="form-group">
                                <label>Launch Time</label>
                                <input type="datetime-local" name="startTime" className="auth-input" value={formData.startTime} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Conclusion Time</label>
                                <input type="datetime-local" name="endTime" className="auth-input" value={formData.endTime} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h3>4. Final Review</h3>
                        <div className="review-summary glass-card" style={{ padding: '24px' }}>
                            <p><strong>Title:</strong> {formData.title}</p>
                            <p><strong>Type:</strong> {formData.votingType}</p>
                            <p><strong>Audience:</strong> {formData.eligibleGroup}</p>
                            <p><strong>Candidates:</strong> {formData.candidates.length}</p>
                        </div>
                        <div className="disclaimer" style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ℹ️ Once launched, parameters cannot be modified to ensure integrity.
                        </div>
                    </div>
                )}

                <div className="wizard-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <button 
                        className="btn-auth glass-card" 
                        style={{ background: 'transparent', margin: 0, opacity: step === 1 ? 0 : 1 }}
                        disabled={step === 1}
                        onClick={prevStep}
                    >
                        Previous
                    </button>
                    {step < 4 ? (
                        <button className="btn-auth" style={{ margin: 0 }} onClick={nextStep}>
                            Next Step
                        </button>
                    ) : (
                        <button className="btn-auth" style={{ margin: 0 }} onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Launching...' : 'Launch Campaign'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateVote;
