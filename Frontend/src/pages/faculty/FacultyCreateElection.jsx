import API_BASE_URL from '@/config/api';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    Vote, Calendar, Users, Zap, Weight, CheckSquare,
    Clock, Send, Plus, ChevronRight, Info, Star
} from 'lucide-react';

const API = API_BASE_URL;

const TYPE_META = {
    Election: { icon: Vote,        color: '#6366f1', label: 'Direct Election'    },
    Approval: { icon: CheckSquare, color: '#10b981', label: 'Approval Vote'      },
    Ranked:   { icon: Star,        color: '#f59e0b', label: 'Ranked Choice'      },
    Weighted: { icon: Weight,      color: '#a855f7', label: 'Weighted Voting'    },
};

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

const FacultyCreateElection = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '', description: '', votingType: 'Election',
        eligibleGroup: 'All Users', eligibleValues: [],
        startTime: '', endTime: '',
        candidates: []
    });

    const [searchQuery, setSearchQuery] = useState('');

    const toggleEligibleValue = (val) => {
        setForm(prev => {
            const current = [...prev.eligibleValues];
            const index = current.indexOf(val);
            if (index > -1) current.splice(index, 1);
            else current.push(val);
            return { ...prev, eligibleValues: current };
        });
    };

    const selectAllValues = (valuesArray) => {
        const allSelected = valuesArray.every(val => form.eligibleValues.includes(val));
        if (allSelected) {
            setForm(prev => ({
                ...prev,
                eligibleValues: prev.eligibleValues.filter(v => !valuesArray.includes(v))
            }));
        } else {
            setForm(prev => {
                const newValues = new Set([...prev.eligibleValues, ...valuesArray]);
                return { ...prev, eligibleValues: Array.from(newValues) };
            });
        }
    };

    const handleGroupChange = (e) => {
        setForm(prev => ({
            ...prev,
            eligibleGroup: e.target.value,
            eligibleValues: []
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (new Date(form.endTime) <= new Date(form.startTime)) {
            toast.error('End time must be after start time');
            return;
        }

        let finalGroup = form.eligibleGroup;
        if (finalGroup === 'Department & Year') {
            const hasDepts = form.eligibleValues.some(v => DEPARTMENTS.includes(v));
            const hasYears = form.eligibleValues.some(v => YEARS.includes(v));
            if (hasDepts && !hasYears) finalGroup = 'Department';
            else if (!hasDepts && hasYears) finalGroup = 'Year';
            else if (!hasDepts && !hasYears) {
                toast.error('Please select at least one department or year.');
                return;
            }
        } else if (finalGroup === 'Staff Filtered') {
            const hasDepts = form.eligibleValues.some(v => DEPARTMENTS.includes(v));
            const hasPositions = form.eligibleValues.some(v => POSITIONS.includes(v));
            if (hasDepts && !hasPositions) finalGroup = 'Staff Department';
            else if (!hasDepts && hasPositions) finalGroup = 'Staff Position';
            else if (hasDepts && hasPositions) finalGroup = 'Staff Department & Position';
            else if (!hasDepts && !hasPositions) {
                toast.error('Please select at least one department or position.');
                return;
            }
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const payload = { ...form, eligibleGroup: finalGroup };
            await axios.post(`${API}/votes`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Draft election created successfully!');
            navigate('/faculty/monitoring');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create election');
        } finally {
            setSubmitting(false);
        }
    };

    const addCandidate = () => {
        if (!searchQuery.trim()) return;
        setForm(prev => ({
            ...prev,
            candidates: [...prev.candidates, {
                user: null, name: searchQuery.trim(), registerNumber: '', description: ''
            }]
        }));
        setSearchQuery('');
    };

    const removeCandidate = (index) => {
        setForm(prev => ({
            ...prev,
            candidates: prev.candidates.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
        <style>{`
            .er-page { min-height:100vh; background:var(--bg-main); padding:32px; max-width:900px; margin:0 auto; }
            .er-title { font-size:2rem; font-weight:800; font-family:var(--font-heading); background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.03em; }
            .er-sub { color:var(--text-muted); font-size:0.875rem; margin-top:4px; font-weight:500; margin-bottom:28px; }
            .info-banner { display:flex; gap:10px; align-items:flex-start; padding:14px 18px; background:rgba(99,102,241,0.07); border:1px solid rgba(99,102,241,0.2); border-radius:14px; margin-bottom:28px; }
            .er-form-card { background:var(--bg-card); border:1px solid var(--border); border-radius:22px; overflow:hidden; margin-bottom:32px; }
            .er-form-head { padding:22px 28px; border-bottom:1px solid var(--border); background:var(--bg-main); }
            .er-form-head-title { font-size:1rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:8px; }
            .er-body { padding:28px; display:flex; flex-direction:column; gap:20px; }
            .er-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
            @media(max-width:600px){ .er-row { grid-template-columns:1fr; } }
            .er-field { display:flex; flex-direction:column; gap:7px; }
            .er-lbl { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); }
            .er-ctrl { width:100%; padding:12px 15px; background:var(--bg-main); border:1.5px solid var(--border); border-radius:12px; color:var(--text-main); font-size:0.875rem; font-family:var(--font-body); outline:none; transition:all 0.15s; }
            .er-ctrl:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
            .er-ctrl::placeholder { color:var(--text-muted); opacity:0.7; }
            textarea.er-ctrl { resize:none; line-height:1.6; }
            .submit-btn { width:100%; padding:15px; border-radius:14px; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; font-weight:700; font-size:0.9rem; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; box-shadow:0 4px 16px rgba(99,102,241,0.3); }
            .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,0.45); }
            .submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
        `}</style>

        <div className="er-page">
            <h1 className="er-title">Create an Election</h1>
            <p className="er-sub">Safely prepare and save an election configuration as a draft.</p>

            <div className="info-banner">
                <Info size={18} color="var(--primary)" style={{ flexShrink:0, marginTop:1 }} />
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', lineHeight:1.6, fontWeight:500 }}>
                    As a staff member, your election will be securely stored as a draft. It will NOT be visible to students until you manually publish/launch it from your Monitoring console, or until its scheduled Start Time arrives.
                </p>
            </div>

            <div className="er-form-card">
                <div className="er-form-head">
                    <div className="er-form-head-title">
                        <Plus size={16} color="var(--primary)" /> Election Campaign Details
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="er-body">
                    <div className="er-field">
                        <label className="er-lbl">Election Title *</label>
                        <input required className="er-ctrl" placeholder="e.g., Department Head Election 2026"
                            value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    </div>
                    <div className="er-field">
                        <label className="er-lbl">Description / Rationale *</label>
                        <textarea required rows={4} className="er-ctrl"
                            placeholder="Explain the purpose of this election and why it should be held..."
                            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </div>

                    <div className="er-field">
                        <label className="er-lbl">Voting Methodology</label>
                        <input type="text" className="er-ctrl" value="Direct Election" readOnly disabled />
                    </div>

                    <div className="er-row">
                        <div className="er-field">
                            <label className="er-lbl">Eligible Audience</label>
                            <select className="er-ctrl" value={form.eligibleGroup} onChange={handleGroupChange}>
                                <option value="All Users">All Users</option>
                                <option value="Department & Year">Department & Year</option>
                                <option value="Staff Filtered">Staff Filtered</option>
                            </select>
                        </div>
                    </div>

                    {(form.eligibleGroup === 'Department & Year' || form.eligibleGroup === 'Staff Filtered') && (
                        <div className="er-field" style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="er-lbl">Select Targeted Departments</label>
                                <button type="button" onClick={() => selectAllValues(DEPARTMENTS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    {DEPARTMENTS.every(d => form.eligibleValues.includes(d)) ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                {DEPARTMENTS.map(val => (
                                    <div 
                                        key={val}
                                        onClick={() => toggleEligibleValue(val)}
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                            fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                            borderColor: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                            color: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: form.eligibleValues.includes(val) ? 700 : 500
                                        }}
                                    >
                                        <div style={{ 
                                            width: 16, height: 16, borderRadius: 4, 
                                            border: `1.5px solid ${form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                        }}>
                                            {form.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                        </div>
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {form.eligibleGroup === 'Department & Year' && (
                        <div className="er-field" style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="er-lbl">Select Targeted Years</label>
                                <button type="button" onClick={() => selectAllValues(YEARS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    {YEARS.every(d => form.eligibleValues.includes(d)) ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                {YEARS.map(val => (
                                    <div 
                                        key={val}
                                        onClick={() => toggleEligibleValue(val)}
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                            fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                            borderColor: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                            color: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: form.eligibleValues.includes(val) ? 700 : 500
                                        }}
                                    >
                                        <div style={{ 
                                            width: 16, height: 16, borderRadius: 4, 
                                            border: `1.5px solid ${form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                        }}>
                                            {form.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                        </div>
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {form.eligibleGroup === 'Staff Filtered' && (
                        <div className="er-field" style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="er-lbl">Select Targeted Positions</label>
                                <button type="button" onClick={() => selectAllValues(POSITIONS)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    {POSITIONS.every(p => form.eligibleValues.includes(p)) ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '8px' }}>
                                {POSITIONS.map(val => (
                                    <div 
                                        key={val}
                                        onClick={() => toggleEligibleValue(val)}
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)',
                                            fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary-glow)' : 'var(--bg-main)',
                                            borderColor: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)',
                                            color: form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: form.eligibleValues.includes(val) ? 700 : 500
                                        }}
                                    >
                                        <div style={{ 
                                            width: 16, height: 16, borderRadius: 4, 
                                            border: `1.5px solid ${form.eligibleValues.includes(val) ? 'var(--primary)' : 'var(--border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: form.eligibleValues.includes(val) ? 'var(--primary)' : 'transparent'
                                        }}>
                                            {form.eligibleValues.includes(val) && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                        </div>
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="er-row">
                        <div className="er-field">
                            <label className="er-lbl">Official Start Time *</label>
                            <input required type="datetime-local" className="er-ctrl"
                                value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
                        </div>
                        <div className="er-field">
                            <label className="er-lbl">Official End Time *</label>
                            <input required type="datetime-local" className="er-ctrl"
                                value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
                        </div>
                    </div>

                    <div className="er-field" style={{ position: 'relative' }}>
                        <label className="er-lbl">Candidates / Bidding Options</label>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                                className="er-ctrl" 
                                placeholder="Candidate Name (e.g. John Doe)"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button 
                                type="button" 
                                className="submit-btn"
                                style={{ padding: '12px 20px', width: 'auto' }}
                                onClick={addCandidate}
                            >
                                Add Option
                            </button>
                        </div>
                        
                        {form.candidates.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                {form.candidates.map((c, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-main)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                                            {c.name}
                                        </div>
                                        <input className="er-ctrl" style={{ padding: '6px 10px', fontSize: '0.8rem', width: '30%' }} placeholder="Reg No. (optional)" 
                                            value={c.registerNumber} onChange={e => {
                                                const newCands = [...form.candidates];
                                                newCands[idx].registerNumber = e.target.value;
                                                setForm({...form, candidates: newCands});
                                            }} />
                                        <input className="er-ctrl" style={{ padding: '6px 10px', fontSize: '0.8rem', width: '40%' }} placeholder="Short manifesto/description" 
                                            value={c.description} onChange={e => {
                                                const newCands = [...form.candidates];
                                                newCands[idx].description = e.target.value;
                                                setForm({...form, candidates: newCands});
                                            }} />
                                        <button type="button" onClick={() => removeCandidate(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitting}>
                        <Send size={16} /> {submitting ? 'Saving Draft…' : 'Save Election as Draft'}
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default FacultyCreateElection;
