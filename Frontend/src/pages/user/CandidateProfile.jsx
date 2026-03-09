import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, BookOpen, Award, Target, ArrowLeft, Trophy, Star } from 'lucide-react';

const CandidateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/candidates/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCandidate(res.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load candidate profile');
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) return <div className="p-12 text-center text-muted">Loading profile...</div>;
    if (!candidate) return <div className="p-12 text-center text-muted">Candidate not found</div>;

    return (
        <div className="page-wrapper animate-fadeIn p-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
                <ArrowLeft size={20} /> Back to Election
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Side */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 text-center animate-slideUp">
                        <div className="w-32 h-32 rounded-full bg-primary-light mx-auto mb-6 flex items-center justify-center text-primary border-4 border-primary/20">
                            {candidate.image ? (
                                <img src={candidate.image} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User size={64} />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-main mb-1">{candidate.name}</h1>
                        <p className="text-primary font-bold uppercase tracking-wider text-sm mb-4">{candidate.department}</p>
                        <div className="flex justify-center gap-2">
                            <span className="px-3 py-1 bg-glass-bg border border-border rounded-full text-xs text-muted">Candidate ID: {id.slice(-6)}</span>
                        </div>
                    </div>

                    <div className="glass-panel p-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
                             <Trophy size={18} className="text-warning" /> Personal Motto
                        </h3>
                        <p className="text-muted italic border-l-4 border-warning pl-4 bg-warning/5 py-3 rounded-r-xl">
                            "Committed to bringing positive change and empowering every voice in our department."
                        </p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                            <BookOpen size={22} className="text-primary" /> My Manifesto
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-muted leading-relaxed whitespace-pre-wrap">
                                {candidate.manifesto}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-panel p-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                                <Award size={22} className="text-success" /> Key Achievements
                            </h2>
                            <ul className="space-y-4">
                                {candidate.achievements?.map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0 mt-0.5">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                        <span className="text-muted">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-panel p-8 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                                <Target size={22} className="text-secondary" /> Promises to You
                            </h2>
                            <ul className="space-y-4">
                                {candidate.promises?.map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        </div>
                                        <span className="text-muted">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
