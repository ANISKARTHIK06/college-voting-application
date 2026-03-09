import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Megaphone, Search, Clock, Calendar, ChevronRight } from 'lucide-react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load announcements');
            setLoading(false);
        }
    };

    const filtered = filter === 'All' 
        ? announcements 
        : announcements.filter(a => a.priority === filter);

    return (
        <div className="page-wrapper animate-fadeIn p-8">
            <header className="mb-8">
                <h1 className="page-title">Campus Announcements</h1>
                <p className="page-subtitle">Stay updated with the latest governance and college news</p>
            </header>

            <div className="flex gap-4 mb-8">
                {['All', 'Normal', 'Important'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-xl border transition-all ${
                            filter === f 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                            : 'bg-glass-bg border-border text-muted hover:border-primary-light'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center p-12 text-muted">Loading announcements...</div>
                ) : filtered.length > 0 ? (
                    filtered.map(a => (
                        <div key={a._id} className="glass-panel group hover:border-primary-light transition-all cursor-pointer animate-slideUp overflow-hidden">
                            <div className="flex">
                                <div className={`w-2 ${a.priority === 'Important' ? 'bg-danger' : 'bg-primary'}`} />
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${a.priority === 'Important' ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'}`}>
                                                <Megaphone size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-main">{a.title}</h3>
                                        </div>
                                        <span className="flex items-center gap-1 text-xs text-muted">
                                            <Calendar size={14} /> {new Date(a.publishDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-muted leading-relaxed mb-6">{a.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs font-bold text-muted uppercase">
                                            <span className="bg-glass-bg px-3 py-1 rounded-lg border border-border">{a.department}</span>
                                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(a.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                            Read More <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-12 glass-panel">
                        <p className="text-muted">No announcements found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
