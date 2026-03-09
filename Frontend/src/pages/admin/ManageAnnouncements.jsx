import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Megaphone, Plus, Search, Trash2, AlertCircle, Clock, History, X, Target, Save } from 'lucide-react';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Global'); // Global, Targeted, Archived
    const [showCreate, setShowCreate] = useState(false);
    
    // Audit Modal State
    const [showAudit, setShowAudit] = useState(false);
    const [auditData, setAuditData] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [selectedAnnouncementTitle, setSelectedAnnouncementTitle] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Normal',
        targetType: 'Global',
        targetValues: ''
    });

    useEffect(() => {
        fetchAnnouncements();
    }, [filter]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            let url = 'http://localhost:5000/api/announcements';
            if (filter === 'Archived') {
                url += '?isArchived=true';
            }
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load announcements');
            setLoading(false);
        }
    };

    const fetchAuditHistory = async (id, title) => {
        try {
            setSelectedAnnouncementTitle(title);
            setShowAudit(true);
            setAuditLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/announcements/${id}/revisions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuditData(res.data);
        } catch (error) {
            toast.error('Failed to load revision history');
        } finally {
            setAuditLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                targetValues: formData.targetValues.split(',').map(v => v.trim()).filter(v => v)
            };
            await axios.post('http://localhost:5000/api/announcements', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Announcement published');
            setShowCreate(false);
            setFormData({ title: '', description: '', priority: 'Normal', targetType: 'Global', targetValues: '' });
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to archive this announcement?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Announcement archived securely');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to archive');
        }
    };

    const filtered = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'Archived' ? true : (filter === 'Global' ? a.targetType === 'Global' : a.targetType !== 'Global');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="page-wrapper animate-fadeIn p-8" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="page-title text-3xl font-bold text-main">Governance Announcements</h1>
                    <p className="page-subtitle text-muted mt-1">Manage and audit targeted institutional communications.</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-indigo-600">
                    <Megaphone size={18} /> Compose Broadcast
                </button>
            </header>

            {/* Segmented Controls & Search */}
            <div className="glass-panel p-2 mb-8 flex justify-between items-center rounded-2xl shadow-md border border-border/50">
                <div className="flex gap-2">
                    {['Global', 'Targeted', 'Archived'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${filter === tab ? 'bg-primary text-white shadow-md' : 'text-muted hover:bg-white/5 hover:text-main'}`}
                        >
                            {tab} {filter === tab && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{filtered.length}</span>}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 bg-bg-main px-4 py-2 rounded-xl border border-border w-1/3 mr-2">
                    <Search className="text-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search broadcasts..." 
                        className="bg-transparent border-none outline-none w-full text-sm text-main"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid gap-5">
                {loading ? (
                    <div className="text-center p-12 text-muted animate-pulse">Synchronizing Records...</div>
                ) : filtered.length > 0 ? (
                    filtered.map(a => (
                        <div key={a._id} className="glass-card hover-lift p-6 flex justify-between items-start animate-slideUp border border-border/40 relative overflow-hidden">
                            {/* Decorative gradient for urgent ones */}
                            {a.priority === 'Important' && <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>}
                            {a.priority === 'Normal' && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                            
                            <div className="flex gap-5">
                                <div className={`p-4 rounded-2xl flex items-center justify-center shadow-inner ${a.priority === 'Important' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                    {a.targetType === 'Global' ? <Megaphone size={24} /> : <Target size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-main tracking-tight">{a.title}</h3>
                                        {a.priority === 'Important' && (
                                            <span className="px-2.5 py-1 rounded-md bg-danger/20 text-danger text-[10px] uppercase font-bold tracking-wider border border-danger/30">Urgent</span>
                                        )}
                                        {a.targetType !== 'Global' && (
                                            <span className="px-2.5 py-1 rounded-md bg-accent/20 text-accent text-[10px] uppercase font-bold tracking-wider border border-accent/30">Targeted</span>
                                        )}
                                    </div>
                                    <p className="text-muted text-sm mb-4 max-w-3xl leading-relaxed">{a.description}</p>
                                    
                                    <div className="flex items-center gap-5 text-xs font-medium text-muted/80 bg-bg-main/50 px-3 py-2 rounded-lg inline-flex border border-border/30">
                                        <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(a.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1.5"><Target size={14}/> {a.targetType} {a.targetValues?.length > 0 ? `(${a.targetValues.join(', ')})` : ''}</span>
                                        <span className="flex items-center gap-1.5 text-main/70">By: {a.createdBy?.name || 'System'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 flex-col">
                                <button 
                                    onClick={() => fetchAuditHistory(a._id, a.title)} 
                                    className="p-2.5 text-secondary hover:bg-secondary/10 rounded-xl transition-all border border-transparent hover:border-secondary/20 tooltip"
                                    title="Revision History & Audit Log"
                                >
                                    <History size={18} />
                                </button>
                                {filter !== 'Archived' && (
                                    <button 
                                        onClick={() => handleDelete(a._id)} 
                                        className="p-2.5 text-danger hover:bg-danger/10 rounded-xl transition-all border border-transparent hover:border-danger/20 tooltip"
                                        title="Archive Announcement"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-16 glass-panel rounded-3xl border border-dashed border-border flex flex-col items-center justify-center">
                        <div className="bg-bg-main p-4 rounded-full mb-4 shadow-inner border border-border">
                            <AlertCircle className="text-muted/50" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-main mb-1">No Records Found</h3>
                        <p className="text-muted text-sm max-w-sm">There are no announcements matching your current filters and search criteria.</p>
                    </div>
                )}
            </div>

            {/* Advanced Creation Sidebar */}
            {showCreate && (
                <div className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-md transition-all">
                    <div className="bg-bg-main h-full w-full max-w-md shadow-2xl border-l border-border/50 animate-slideLeft flex flex-col pb-0">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-glass-bg">
                            <div>
                                <h2 className="text-2xl font-bold text-main">Compose Broadcast</h2>
                                <p className="text-xs text-muted mt-1">Multi-level targeting & delivery</p>
                            </div>
                            <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-main/90 ml-1">Headline</label>
                                <input 
                                    required
                                    className="w-full bg-black/20 border border-border rounded-xl p-3.5 text-main text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                    placeholder="e.g., Campus Maintenance Scheduled"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-main/90 ml-1">Message Body</label>
                                <textarea 
                                    required
                                    rows="5"
                                    className="w-full bg-black/20 border border-border rounded-xl p-3.5 text-main text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                                    placeholder="Provide detailed instructions or updates..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="p-5 bg-gradient-to-br from-glass-bg to-transparent border border-border/50 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={64}/></div>
                                <h4 className="text-sm font-bold text-main mb-4 relative z-10 flex items-center gap-2"><Target size={16} className="text-primary"/> Delivery Targeting</h4>
                                
                                <div className="space-y-4 relative z-10">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted ml-1">Audience Level</label>
                                        <select 
                                            className="w-full bg-black/40 border border-border/60 rounded-lg p-2.5 text-main text-sm outline-none focus:border-primary transition-colors cursor-pointer"
                                            value={formData.targetType}
                                            onChange={e => setFormData({...formData, targetType: e.target.value})}
                                        >
                                            <option value="Global">Global (All Users)</option>
                                            <option value="Role">Specific Role (e.g., Faculty)</option>
                                            <option value="Department">Specific Department</option>
                                            <option value="Organization">Specific Organization/Club</option>
                                        </select>
                                    </div>

                                    {formData.targetType !== 'Global' && (
                                        <div className="space-y-1.5 animate-fadeIn">
                                            <label className="text-xs font-semibold text-muted ml-1 flex justify-between">
                                                <span>Target Values</span>
                                                <span className="text-[10px] font-normal opacity-70">Comma separated</span>
                                            </label>
                                            <input 
                                                required
                                                className="w-full bg-black/40 border border-border/60 rounded-lg p-2.5 text-main text-sm outline-none focus:border-primary transition-colors placeholder-muted/30"
                                                placeholder={formData.targetType === 'Department' ? 'CS, Mechanical, Arts' : formData.targetType === 'Role' ? 'Student, Admin' : 'Debate Club'}
                                                value={formData.targetValues}
                                                onChange={e => setFormData({...formData, targetValues: e.target.value})}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-main/90 ml-1">Priority Status</label>
                                <div className="flex gap-3">
                                    {['Normal', 'Important'].map(p => (
                                        <button
                                            type="button"
                                            key={p}
                                            onClick={() => setFormData({...formData, priority: p})}
                                            className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${formData.priority === p 
                                                ? (p === 'Important' ? 'bg-danger/20 border-danger text-danger' : 'bg-primary/20 border-primary text-primary') 
                                                : 'bg-black/20 border-border text-muted hover:bg-white/5'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border/50">
                                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                                    <Megaphone size={16}/> Deploy Broadcast
                                </button>
                                <p className="text-center text-[10px] text-muted mt-3">All broadcasts are permanently logged with your user ID.</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Audit History Modal */}
            {showAudit && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="bg-bg-main w-full max-w-2xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-6 bg-glass-bg border-b border-border/50 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-main flex items-center gap-2"><History className="text-secondary" size={24}/> Revision Audit Trail</h3>
                                <p className="text-sm text-muted mt-1 truncate max-w-sm">Record for: <span className="text-main font-medium">{selectedAnnouncementTitle}</span></p>
                            </div>
                            <button onClick={() => setShowAudit(false)} className="relative z-10 p-2 bg-black/20 hover:bg-danger/20 hover:text-danger rounded-full transition-colors text-muted border border-border/50">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-transparent to-black/20">
                            {auditLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-muted text-sm font-medium animate-pulse">Decrypting secure logs...</p>
                                </div>
                            ) : auditData.length > 0 ? (
                                <div className="space-y-4">
                                    {auditData.map((rev, idx) => (
                                        <div key={rev._id} className="relative pl-6 pb-2 border-l border-border/50 last:border-0 last:pb-0">
                                            <div className={`absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-bg-main ${rev.action === 'Archive' ? 'bg-danger' : 'bg-secondary'}`}></div>
                                            <div className="bg-black/30 border border-border/30 rounded-2xl p-4 shadow-inner">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${rev.action === 'Archive' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-secondary/20 text-secondary border border-secondary/30'}`}>
                                                            {rev.action}
                                                        </span>
                                                        <span className="text-sm font-semibold text-main/90">{rev.changedBy?.name || 'Unknown User'}</span>
                                                    </div>
                                                    <span className="text-xs font-mono text-muted/70 bg-bg-main/50 px-2 py-1 rounded-md border border-border/20">
                                                        {new Date(rev.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted font-mono bg-black/40 p-3 rounded-xl border border-border/20 max-h-32 overflow-y-auto custom-scrollbar">
                                                    {rev.action === 'Archive' ? (
                                                        <span className="text-danger/80">User initiated soft-delete sequence. Document archived.</span>
                                                    ) : (
                                                        <pre className="text-main/60 m-0 w-full overflow-x-hidden whitespace-pre-wrap leading-relaxed">{JSON.stringify(rev.changes, null, 2)}</pre>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 flex flex-col items-center justify-center">
                                    <Shield className="text-muted/30 mb-4" size={48} />
                                    <p className="text-muted text-sm font-medium">This document has not been modified since creation.</p>
                                    <p className="text-xs text-muted/50 mt-1">Initial creation logs are stored in the core DB, not the revision table.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAnnouncements;
