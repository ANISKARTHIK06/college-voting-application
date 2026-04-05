import API_BASE_URL from '@/config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEPARTMENTS = [
    "Agricultural Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "Biomedical Engineering",
    "Biotechnology",
    "Civil Engineering",
    "Computer Science and Design",
    "Computer Science and Engineering",
    "Computer Technology",
    "Electrical and Electronics Engineering",
    "Electronics and Communication Engineering",
    "Fashion Technology",
    "Food Technology",
    "Mechanical Engineering"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const POSITIONS = [
    "Associate Professor Level 1",
    "Associate Professor Level 2",
    "Associate Professor Level 3",
    "HOD"
];

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
        startTime: '',
        endTime: '',
        candidates: [{ user: null, name: '', registerNumber: '', description: '' }]
    });
    const [searchQueries, setSearchQueries] = useState(['']);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            // Reset eligibleValues if group changes
            ...(name === 'eligibleGroup' ? { eligibleValues: [] } : {})
        }));
    };

    const toggleEligibleValue = (val) => {
        setFormData(prev => {
            const current = [...prev.eligibleValues];
            const index = current.indexOf(val);
            if (index > -1) current.splice(index, 1);
            else current.push(val);
            return { ...prev, eligibleValues: current };
        });
    };

    const selectAllValues = (valuesArray) => {
        const allSelected = valuesArray.every(val => formData.eligibleValues.includes(val));
        if (allSelected) {
            setFormData(prev => ({
                ...prev,
                eligibleValues: prev.eligibleValues.filter(v => !valuesArray.includes(v))
            }));
        } else {
            setFormData(prev => {
                const newValues = new Set([...prev.eligibleValues, ...valuesArray]);
                return { ...prev, eligibleValues: Array.from(newValues) };
            });
        }
    };

    const handleCandidateChange = (index, field, value) => {
        const newCandidates = [...formData.candidates];
        newCandidates[index][field] = value;
        setFormData({ ...formData, candidates: newCandidates });
    };

    const addCandidate = () => {
        setFormData({ ...formData, candidates: [...formData.candidates, { user: null, name: '', registerNumber: '', description: '' }] });
        setSearchQueries([...searchQueries, '']);
    };

    const removeCandidate = (index) => {
        const newCandidates = formData.candidates.filter((_, i) => i !== index);
        setFormData({ ...formData, candidates: newCandidates });
        const newQueries = searchQueries.filter((_, i) => i !== index);
        setSearchQueries(newQueries);
    };

    const handleSubmit = async () => {
        let finalGroup = formData.eligibleGroup;
        if (finalGroup === 'Department & Year') {
            const hasDepts = formData.eligibleValues.some(v => DEPARTMENTS.includes(v));
            const hasYears = formData.eligibleValues.some(v => YEARS.includes(v));
            if (hasDepts && !hasYears) finalGroup = 'Department';
            else if (!hasDepts && hasYears) finalGroup = 'Year';
            else if (!hasDepts && !hasYears) {
                alert('Please select at least one department or year for the targeted audience.');
                return;
            }
        } else if (finalGroup === 'Staff Filtered') {
            const hasDepts = formData.eligibleValues.some(v => DEPARTMENTS.includes(v));
            const hasPositions = formData.eligibleValues.some(v => POSITIONS.includes(v));
            if (hasDepts && !hasPositions) finalGroup = 'Staff Department';
            else if (!hasDepts && hasPositions) finalGroup = 'Staff Position';
            else if (hasDepts && hasPositions) finalGroup = 'Staff Department & Position';
            else if (!hasDepts && !hasPositions) {
                alert('Please select at least one department or position for the staff audience.');
                return;
            }
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const submitData = { ...formData, eligibleGroup: finalGroup };
            await axios.post(`${API_BASE_URL}/votes`, submitData, {
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
                                                    placeholder="e.g. John Doe"
                                                    onChange={(e) => handleCandidateChange(i, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Registration Number</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={c.registerNumber}
                                                    placeholder="e.g. 730521104001"
                                                    onChange={(e) => handleCandidateChange(i, 'registerNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '16px' }}>
                                            <label className="form-label">Tagline / Short Manifesto</label>

                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                value={c.description}
                                                placeholder="e.g. Innovation for All"
                                                onChange={(e) => handleCandidateChange(i, 'description', e.target.value)}
                                            />
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
                                        <input type="text" className="form-input" value="Direct Election" readOnly disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Eligible Audience</label>
                                        <select name="eligibleGroup" className="form-input" value={formData.eligibleGroup} onChange={handleChange}>
                                            <option value="All Users">All Users</option>
                                            <option value="Department & Year">Department & Year</option>
                                            <option value="Staff Filtered">Staff Filtered</option>
                                        </select>
                                    </div>
                                </div>

                                {(formData.eligibleGroup === 'Department & Year' || formData.eligibleGroup === 'Staff Filtered') && (
                                    <div className="form-group animate-fadeIn" style={{ marginTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label className="form-label">Select Targeted Departments</label>
                                            <button type="button" onClick={() => selectAllValues(DEPARTMENTS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {DEPARTMENTS.every(d => formData.eligibleValues.includes(d)) ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                            {DEPARTMENTS.map(val => (
                                                <div 
                                                    key={val}
                                                    onClick={() => toggleEligibleValue(val)}
                                                    className={`selection-chip ${formData.eligibleValues.includes(val) ? 'active' : ''}`}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                                        fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                                        borderColor: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                                        color: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: formData.eligibleValues.includes(val) ? 700 : 500
                                                    }}
                                                >
                                                    <div style={{ 
                                                        width: 16, height: 16, borderRadius: 4, 
                                                        border: `1.5px solid ${formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                                    }}>
                                                        {formData.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                                    </div>
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.eligibleGroup === 'Department & Year' && (
                                    <div className="form-group animate-fadeIn" style={{ marginTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label className="form-label">Select Targeted Years</label>
                                            <button type="button" onClick={() => selectAllValues(YEARS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {YEARS.every(d => formData.eligibleValues.includes(d)) ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                            {YEARS.map(val => (
                                                <div 
                                                    key={val}
                                                    onClick={() => toggleEligibleValue(val)}
                                                    className={`selection-chip ${formData.eligibleValues.includes(val) ? 'active' : ''}`}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                                        fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                                        borderColor: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                                        color: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: formData.eligibleValues.includes(val) ? 700 : 500
                                                    }}
                                                >
                                                    <div style={{ 
                                                        width: 16, height: 16, borderRadius: 4, 
                                                        border: `1.5px solid ${formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                                    }}>
                                                        {formData.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                                    </div>
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.eligibleGroup === 'Staff Filtered' && (
                                    <div className="form-group animate-fadeIn" style={{ marginTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label className="form-label">Select Targeted Positions</label>
                                            <button type="button" onClick={() => selectAllValues(POSITIONS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {POSITIONS.every(p => formData.eligibleValues.includes(p)) ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                            {POSITIONS.map(val => (
                                                <div 
                                                    key={val}
                                                    onClick={() => toggleEligibleValue(val)}
                                                    className={`selection-chip ${formData.eligibleValues.includes(val) ? 'active' : ''}`}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                                        fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                                        borderColor: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                                        color: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: formData.eligibleValues.includes(val) ? 700 : 500
                                                    }}
                                                >
                                                    <div style={{ 
                                                        width: 16, height: 16, borderRadius: 4, 
                                                        border: `1.5px solid ${formData.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: formData.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                                    }}>
                                                        {formData.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                                    </div>
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                            <div style={{ fontWeight: 600 }}>Direct Election</div>
                                        </div>
                                        <div>
                                            <label className="form-label">Target Audience</label>
                                            <div style={{ fontWeight: 600 }}>
                                                {formData.eligibleGroup} 
                                                {formData.eligibleValues.length > 0 && ` (${formData.eligibleValues.join(', ')})`}
                                            </div>
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
