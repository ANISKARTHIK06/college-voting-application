import React, { useState } from 'react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
    ChevronRight,
    ChevronLeft,
    Save,
    Settings,
    Users,
    CheckSquare,
    Type,
    ArrowRight
} from 'lucide-react';

const CreateElectionWizard = ({ onCancel, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        votingType: 'Single Choice',
        eligibility: 'All Students',
        candidates: [{ name: '', bio: '' }]
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const addCandidate = () => {
        setFormData({
            ...formData,
            candidates: [...formData.candidates, { name: '', bio: '' }]
        });
    };

    const updateCandidate = (index, field, value) => {
        const newCandidates = [...formData.candidates];
        newCandidates[index][field] = value;
        setFormData({ ...formData, candidates: newCandidates });
    };

    const BasicInfo = () => (
        <div className="space-y-6">
            <Input
                label="Election Title"
                placeholder="e.g., Student Union President 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea
                    className="min-h-[100px] p-4 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-600 transition-all"
                    placeholder="Purpose and scope of this election..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
            </div>
        </div>
    );

    const VotingRules = () => (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Voting System</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Single Choice', 'Ranked Choice', 'Approval Voting', 'Instant Runoff'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFormData({ ...formData, votingType: type })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${formData.votingType === type
                                    ? 'border-primary-600 bg-primary-50 text-slate-900'
                                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <span className="text-sm font-bold uppercase tracking-wide block mb-1">{type}</span>
                            <p className="text-[10px] leading-relaxed opacity-70">
                                {type === 'Single Choice' ? 'Select only one preferred candidate.' :
                                    type === 'Ranked Choice' ? 'Rank candidates by preference order.' :
                                        'Select any number of acceptable candidates.'}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Eligibility Rule</label>
                <select
                    className="p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 outline-none"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                >
                    <option>All Students</option>
                    <option>Undergraduate Only</option>
                    <option>Postgraduate Only</option>
                    <option>Departmental Only</option>
                </select>
            </div>
        </div>
    );

    const CandidatesStep = () => (
        <div className="space-y-6">
            {formData.candidates.map((c, idx) => (
                <Card key={idx} className="bg-slate-50 border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate #{idx + 1}</span>
                        {formData.candidates.length > 1 && (
                            <button
                                className="text-xs font-bold text-error-600 hover:text-red-700 uppercase"
                                onClick={() => {
                                    const newC = formData.candidates.filter((_, i) => i !== idx);
                                    setFormData({ ...formData, candidates: newC });
                                }}
                            >Remove</button>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Input
                            placeholder="Candidate Name"
                            value={c.name}
                            onChange={(e) => updateCandidate(idx, 'name', e.target.value)}
                        />
                        <textarea
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-100 outline-none min-h-[60px]"
                            placeholder="Short bio or manifesto summary..."
                            value={c.bio}
                            onChange={(e) => updateCandidate(idx, 'bio', e.target.value)}
                        ></textarea>
                    </div>
                </Card>
            ))}
            <Button variant="secondary" className="w-full border-dashed py-3 border-slate-300" onClick={addCandidate}>
                Add Another Candidate
            </Button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden" padding="p-0">
                <header className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Configure New Election</h2>
                            <p className="text-xs text-slate-500 font-medium">Step {step} of 3</p>
                        </div>
                    </div>

                    <div className="flex gap-1.5">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary-600' : 'bg-slate-100'}`}></div>
                        ))}
                    </div>
                </header>

                <main className="p-8 min-h-[400px] max-h-[60vh] overflow-y-auto bg-slate-50/10">
                    {step === 1 && <BasicInfo />}
                    {step === 2 && <VotingRules />}
                    {step === 3 && <CandidatesStep />}
                </main>

                <footer className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
                    <Button variant="ghost" onClick={step === 1 ? onCancel : prevStep}>
                        {step === 1 ? 'Discard' : 'Back'}
                    </Button>

                    <div className="flex gap-3">
                        {step < 3 ? (
                            <Button onClick={nextStep} className="gap-2">
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button onClick={() => onSave(formData)} className="gap-2 shadow-lg shadow-primary-600/20">
                                Schedule Election
                                <Save className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </footer>
            </Card>
        </div>
    );
};

export default CreateElectionWizard;
