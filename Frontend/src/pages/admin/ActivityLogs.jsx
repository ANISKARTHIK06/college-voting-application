import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ClipboardList, Search, Filter, User, Clock, Shield, Globe } from 'lucide-react';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/activity', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load activity logs');
            setLoading(false);
        }
    };

    const filtered = logs.filter(log => 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        log.details?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-wrapper animate-fadeIn p-8">
            <header className="mb-8">
                <h1 className="page-title">Activity Logs</h1>
                <p className="page-subtitle">Monitor all administrative and user governance actions</p>
            </header>

            <div className="glass-panel p-4 mb-6 flex items-center gap-4">
                <Search className="text-muted" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by action, user, or details..." 
                    className="bg-transparent border-none outline-none w-full text-main"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-glass-bg border-b border-border">
                            <th className="p-4 text-xs font-bold text-muted uppercase">Action</th>
                            <th className="p-4 text-xs font-bold text-muted uppercase">User</th>
                            <th className="p-4 text-xs font-bold text-muted uppercase">Details</th>
                            <th className="p-4 text-xs font-bold text-muted uppercase">IP Address</th>
                            <th className="p-4 text-xs font-bold text-muted uppercase text-right">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="5" className="p-12 text-center text-muted">Loading logs...</td></tr>
                        ) : filtered.map(log => (
                            <tr key={log._id} className="hover:bg-glass-bg transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary-light text-primary">
                                            <Shield size={16} />
                                        </div>
                                        <span className="font-bold text-main">{log.action}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-main font-medium">{log.user?.name || 'System'}</span>
                                        <span className="text-[10px] text-muted uppercase font-bold">{log.user?.role}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-muted max-w-xs truncate">{log.details}</td>
                                <td className="p-4 text-sm font-mono text-muted">{log.ipAddress || '127.0.0.1'}</td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm text-main">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        <span className="text-xs text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center text-muted">No logs found.</div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
