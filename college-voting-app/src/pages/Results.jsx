import React from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { BarChart3, PieChart, Users, Download, Info, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';

const Results = () => {
    const resultData = {
        electionTitle: 'Department of CS: Board Member',
        totalVotes: 520,
        turnout: '89.2%',
        winners: ['Rahul Verma'],
        candidates: [
            { name: 'Rahul Verma', votes: 245, percentage: 47 },
            { name: 'Sneha Kapur', votes: 180, percentage: 35 },
            { name: 'Amit Das', votes: 95, percentage: 18 },
        ]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="slate">Certified Result</Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Election ID: EVT-2025-089</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{resultData.electionTitle}</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Verified results as of Feb 10, 2026</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                </div>
            </header>

            {/* High-Level Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-slate-900">{resultData.totalVotes}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Ballots Cast</span>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-success-50 text-success-600">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-slate-900">{resultData.turnout}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Voter Turnout</span>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-slate-900">463</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Eligible Voters</span>
                    </div>
                </Card>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section */}
                <Card className="lg:col-span-2 shadow-xl border-slate-200" padding="p-0">
                    <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Breakdown by Candidate</h3>
                        <Badge variant="primary">Plurality Count</Badge>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {resultData.candidates.map((c) => (
                            <div key={c.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">{c.name}</span>
                                        {resultData.winners.includes(c.name) && (
                                            <Badge variant="success" className="text-[8px] px-1.5 leading-tight uppercase font-black">Winner</Badge>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-extrabold text-slate-900">{c.votes} votes</span>
                                        <span className="text-[10px] text-slate-400 font-bold block">{c.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${resultData.winners.includes(c.name) ? 'bg-primary-600' : 'bg-slate-300'}`}
                                        style={{ width: `${c.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                        <Info className="w-4 h-4 text-slate-400" />
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            Results are immutable and have been verified against the cryptographic ledger. Final count includes all valid ballots cast before the deadline.
                        </p>
                    </div>
                </Card>

                {/* Participation Analytics */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-lg">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Department Participation</h4>
                        <div className="space-y-4">
                            {[
                                { dept: 'Year 1', val: 95 },
                                { dept: 'Year 2', val: 82 },
                                { dept: 'Year 3', val: 91 },
                                { dept: 'Year 4', val: 88 },
                            ].map(item => (
                                <div key={item.dept} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-slate-600">{item.dept}</span>
                                        <span className="text-slate-400">{item.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-slate-400 h-full" style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-slate-900 text-white border-0 shadow-lg p-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security Validation</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-success-600"></div>
                                <span className="text-[10px] font-medium text-slate-300">All hashes verified</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-success-600"></div>
                                <span className="text-[10px] font-medium text-slate-300">Integrity check passed</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-success-600"></div>
                                <span className="text-[10px] font-medium text-slate-300">No double-votes detected</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Results;
