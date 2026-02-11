import React, { useState } from 'react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Send, Info, FileText } from 'lucide-react';

const ProposalSubmission = () => {
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        description: '',
        impact: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Proposal Submitted for Review!');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Propose an Initiative</h1>
                <p className="text-sm text-slate-500 font-medium">Faculty and students can submit proposals for institutional improvements.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="shadow-xl border-slate-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Proposal Title"
                                placeholder="e.g., Solar Panel Installation in Block C"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Department / Category"
                                    placeholder="e.g., Sustainability"
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                                <Input
                                    label="Target Audience"
                                    placeholder="e.g., All Students"
                                    id="audience"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Description</label>
                                <textarea
                                    className="min-h-[150px] p-4 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-600 transition-all placeholder:text-slate-400"
                                    placeholder="Describe the problem and your proposed solution..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Impact</label>
                                <textarea
                                    className="min-h-[100px] p-4 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-600 transition-all placeholder:text-slate-400"
                                    placeholder="How will this benefit the college community?"
                                    value={formData.impact}
                                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                                ></textarea>
                            </div>

                            <Button type="submit" className="w-full gap-2 py-3">
                                <Send className="w-4 h-4" />
                                Submit Proposal for Review
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-0 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-primary-600" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Submission Rules</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Proposals must align with the college ethics policy.</p>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Needs a minimum of 25 student endorsements to be considered.</p>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Review period typically takes 5-7 business days.</p>
                            </li>
                        </ul>
                    </Card>

                    <Card className="border-slate-200 border-dashed bg-slate-50/50">
                        <div className="flex flex-col items-center text-center p-4">
                            <FileText className="w-8 h-8 text-slate-300 mb-3" />
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Upload Supporting Doc</h4>
                            <p className="text-[10px] text-slate-500 font-medium mb-4">PDF, JPG up to 10MB</p>
                            <Button variant="secondary" size="sm">Select File</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProposalSubmission;
