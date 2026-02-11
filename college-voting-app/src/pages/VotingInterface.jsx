import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const VotingInterface = ({ election, onExit }) => {
    const [step, setStep] = useState(1); // 1: Selection, 2: Review, 3: Confirmation
    const [selection, setSelection] = useState(null);

    const candidates = [
        { id: 1, name: 'Saurav Joshi', department: 'CS', manifesto: 'Better lab facilities and more hackathons.' },
        { id: 2, name: 'Priya Sharma', department: 'ME', manifesto: 'Industry partnerships and industrial visits.' },
        { id: 3, name: 'Rahul Verma', department: 'EE', manifesto: 'Focus on renewable energy projects on campus.' },
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const SelectionStep = () => (
        <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex gap-3 items-start">
                <div className="bg-white p-1 rounded-full text-primary-600 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-primary-700">Voting Instructions</span>
                    <p className="text-xs text-primary-600 leading-relaxed font-medium">
                        Please select exactly one candidate from the list below. You will be able to review your selection in the next step.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {candidates.map((candidate) => (
                    <button
                        key={candidate.id}
                        onClick={() => setSelection(candidate)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selection?.id === candidate.id
                                ? 'border-primary-600 bg-primary-50/50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selection?.id === candidate.id ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                            }`}>
                            {selection?.id === candidate.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-slate-900">{candidate.name}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{candidate.department}</span>
                            <p className="text-xs text-slate-600 mt-1">{candidate.manifesto}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const ReviewStep = () => (
        <div className="space-y-8 py-4">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Review Your Ballot</h3>
                <p className="text-sm text-slate-500">Please confirm your selection before final submission.</p>
            </div>

            <Card className="border-t-4 border-t-primary-600 shadow-xl max-w-sm mx-auto">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
                        {selection?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                        <span className="text-xl font-bold text-slate-900">{selection?.name}</span>
                        <span className="block text-xs text-slate-500 font-bold uppercase">{selection?.department}</span>
                    </div>
                    <div className="w-full h-px bg-slate-100 my-2"></div>
                    <div className="flex items-center gap-2 text-success-600 font-bold text-xs uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4" />
                        Primary Choice
                    </div>
                </div>
            </Card>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl max-w-sm mx-auto">
                <p className="text-xs text-amber-700 leading-relaxed font-semibold text-center italic">
                    "I hereby confirm that this is my voluntary and final choice for this election."
                </p>
            </div>
        </div>
    );

    const ConfirmationStep = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Vote Recorded Successfully</h2>
            <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">
                Your vote has been anonymized and stored securely. Below is your cryptographic receipt ID.
            </p>

            <div className="bg-slate-100 p-4 rounded-lg w-full max-w-md font-mono text-xs text-slate-600 break-all border border-slate-200 shadow-inner">
                9e8f7a2d6c1b004a8b3c9d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x
            </div>

            <Button variant="secondary" className="mt-10 gap-2" onClick={onExit}>
                Return to Dashboard
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center overflow-y-auto pt-10 px-6 pb-20">
            <div className="w-full max-w-2xl">
                <header className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        {step < 3 && (
                            <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900">{election.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-success-600 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>
                    {step < 3 && (
                        <div className="flex items-center gap-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                            <div className="w-4 h-px bg-slate-200"></div>
                            <div className={`h-1.5 w-1.5 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                            <div className="w-4 h-px bg-slate-200"></div>
                            <div className={`h-1.5 w-1.5 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        </div>
                    )}
                </header>

                <main className="min-h-[400px]">
                    {step === 1 && <SelectionStep />}
                    {step === 2 && <ReviewStep />}
                    {step === 3 && <ConfirmationStep />}
                </main>

                {step < 3 && (
                    <footer className="mt-12 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 sticky bottom-6 shadow-lg shadow-slate-200/50">
                        <Button
                            variant="ghost"
                            onClick={step === 1 ? onExit : handleBack}
                            className="gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </Button>
                        <Button
                            disabled={!selection}
                            onClick={handleNext}
                            className="gap-2 shadow-sm"
                        >
                            {step === 1 ? 'Review Selection' : 'Confirm & Submit'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </footer>
                )}
            </div>
        </div>
    );
};

const X = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

export default VotingInterface;
