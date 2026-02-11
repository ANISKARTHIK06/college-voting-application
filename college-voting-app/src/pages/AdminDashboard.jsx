import React from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    Users,
    Vote,
    AlertCircle,
    FileText
} from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Registered Voters', value: '4,850', change: '+12%', icon: Users, color: 'text-primary-600' },
        { label: 'Total Ballots Cast', value: '3,210', change: '+5%', icon: Vote, color: 'text-success-600' },
        { label: 'Pending Proposals', value: '24', change: '-2', icon: FileText, color: 'text-warning-600' },
        { label: 'System Alerts', value: '1', change: 'Normal', icon: AlertCircle, color: 'text-error-600' },
    ];

    const elections = [
        {
            id: 'EVT-2026-001',
            title: 'Student Body President 2026',
            status: 'Active',
            starts: 'Feb 01, 2026',
            ends: 'Feb 15, 2026',
            participation: '42%'
        },
        {
            id: 'EVT-2026-002',
            title: 'New Campus Gym Equipment',
            status: 'Active',
            starts: 'Feb 10, 2026',
            ends: 'Feb 18, 2026',
            participation: '12%'
        },
        {
            id: 'EVT-2025-089',
            title: 'Department of CS: Board Member',
            status: 'Ended',
            starts: 'Jan 25, 2026',
            ends: 'Feb 10, 2026',
            participation: '89%'
        },
    ];

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Control Center</h1>
                    <p className="text-sm text-slate-500 font-medium">System-wide management and real-time monitoring.</p>
                </div>
                <Button onClick={() => setIsWizardOpen(true)} className="gap-2 shadow-lg shadow-primary-600/20">
                    <Plus className="w-4 h-4" />
                    Create New Event
                </Button>
            </header>

            {isWizardOpen && (
                <CreateElectionWizard
                    onCancel={() => setIsWizardOpen(false)}
                    onSave={(data) => {
                        console.log('Election Scheduled:', data);
                        setIsWizardOpen(false);
                    }}
                />
            )}

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} padding="p-5" className="border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.change.includes('+') ? 'bg-success-50 text-success-600' :
                                stat.change.includes('-') ? 'bg-red-50 text-error-600' : 'bg-slate-50 text-slate-500'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    </Card>
                ))}
            </section>

            {/* Main Management Section */}
            <Card className="border-slate-200 shadow-xl overflow-hidden" padding="p-0">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Election Management</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-64"
                            />
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/10 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Election Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participation</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {elections.map((election) => (
                                <tr key={election.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{election.title}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{election.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={election.status === 'Active' ? 'success' : 'slate'}>{election.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-600">{election.starts}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">TO {election.ends}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-grow bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                                                <div className={`h-full ${election.status === 'Active' ? 'bg-primary-600' : 'bg-slate-400'}`} style={{ width: election.participation }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{election.participation}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                    <span>Showing 3 of 15 elections</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled className="px-4">Prev</Button>
                        <Button variant="secondary" size="sm" className="px-4">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
