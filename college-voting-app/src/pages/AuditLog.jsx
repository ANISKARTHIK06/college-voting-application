import React from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Shield, Clock, User, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const AuditLog = () => {
    const auditEntries = [
        {
            id: 'AUD-0128',
            action: 'Election Created',
            actor: 'Super Admin',
            time: '12:45 PM, Feb 10, 2026',
            status: 'Verified',
            details: 'New voting event "Campus Technology Fund" scheduled for rollout.'
        },
        {
            id: 'AUD-0125',
            action: 'Results Certified',
            actor: 'System Integrity Engine',
            time: '10:00 AM, Feb 10, 2026',
            status: 'Immutable',
            details: 'Department of CS: Board Member election results officially closed and hashes locked.'
        },
        {
            id: 'AUD-0122',
            action: 'Participation spike detected',
            actor: 'Fraud Guard',
            time: '09:15 AM, Feb 10, 2026',
            status: 'Investigated',
            details: 'Velocity alert triggered for Year 2 participation. Reviewed and cleared as valid bulk voting session.'
        },
        {
            id: 'AUD-0119',
            action: 'Access Granted: Faculty Role',
            actor: 'Security Controller',
            time: '08:30 AM, Feb 10, 2026',
            status: 'Secure',
            details: 'Department Head authorized for Proposal Submission rights.'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 bg-slate-900 rounded-lg text-white">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Security Controller</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit & Transparency Log</h1>
                    <p className="text-sm text-slate-500 font-medium italic">End-to-end verifiable system activity timeline.</p>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Audit ID..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-64 shadow-sm"
                    />
                </div>
            </header>

            <div className="relative space-y-8 before:absolute before:left-6 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                {auditEntries.map((entry, idx) => (
                    <div key={entry.id} className="relative pl-16 group">
                        {/* Timeline Indicator */}
                        <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ${idx === 0 ? 'ring-primary-600 bg-primary-600' : 'ring-slate-300 bg-slate-300'
                            }`}></div>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow border-slate-200 overflow-hidden" padding="p-0">
                            <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors uppercase">{entry.action}</span>
                                    <Badge variant={entry.status === 'Verified' ? 'success' : entry.status === 'Secure' ? 'primary' : 'slate'} className="text-[8px] leading-tight px-1.5 font-black uppercase">
                                        {entry.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <Clock className="w-3.5 h-3.5" />
                                    {entry.time}
                                </div>
                            </div>

                            <div className="p-5 bg-slate-50/10 space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{entry.details}</p>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.actor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-success-50 flex items-center justify-center">
                                            <CheckCircle className="w-2.5 h-2.5 text-success-600" />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">{entry.id}</span>
                                    </div>
                                </div>
                            </div>

                            {idx === 1 && (
                                <div className="px-5 py-3 bg-primary-900 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-primary-200 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-primary-400" />
                                        Cryptographic Anchor Confirmed
                                    </span>
                                    <button className="text-[9px] font-bold text-white hover:underline uppercase">View Chain</button>
                                </div>
                            )}
                        </Card>
                    </div>
                ))}
            </div>

            <div className="text-center py-6">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em]">Load Historical Logs</button>
            </div>
        </div>
    );
};

export default AuditLog;
