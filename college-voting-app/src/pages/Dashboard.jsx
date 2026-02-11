import React, { useState } from 'react';
import ElectionCard from '../components/election/ElectionCard';
import VotingInterface from './VotingInterface';

const Dashboard = () => {
    const [activeElection, setActiveElection] = useState(null);

    const elections = [
        {
            id: 1,
            title: 'Student Body President 2026',
            description: 'Vote for the next representative of the student union. Decision impacts campus life and events.',
            deadline: 'Feb 15, 2026',
            participants: 1240,
            type: 'Single Choice',
            status: 'Active'
        },
        {
            id: 2,
            title: 'New Campus Gym Equipment',
            description: 'Choose which department gets the new equipment priority. Approval voting for proposed options.',
            deadline: 'Feb 18, 2026',
            participants: 856,
            type: 'Approval',
            status: 'Active'
        },
        {
            id: 3,
            title: 'Department of CS: Board Member',
            description: 'Ranked choice voting for the new student board representative for the CS department.',
            deadline: 'Feb 10, 2026',
            participants: 520,
            type: 'Ranked Choice',
            status: 'Ended'
        }
    ];

    if (activeElection) {
        return (
            <VotingInterface
                election={activeElection}
                onExit={() => setActiveElection(null)}
            />
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back, Anis</h1>
                <p className="text-slate-500 font-medium">You have 2 active elections requiring your attention.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Participation</span>
                    <span className="text-3xl font-extrabold text-slate-900">84%</span>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-primary-600 h-full w-[84%]"></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Votes Cast</span>
                    <span className="text-3xl font-extrabold text-slate-900">12</span>
                    <div className="flex -space-x-2 mt-4">
                        {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">V</div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">+8</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Score</span>
                    <span className="text-3xl font-extrabold text-success-600">99.8</span>
                    <span className="text-xs font-medium text-slate-400 mt-4 underline decoration-slate-200 cursor-help">How is this calculated?</span>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Available Elections</h2>
                    <button className="text-sm font-semibold text-primary-600 hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {elections.map(election => (
                        <ElectionCard
                            key={election.id}
                            election={election}
                            onVote={setActiveElection}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
