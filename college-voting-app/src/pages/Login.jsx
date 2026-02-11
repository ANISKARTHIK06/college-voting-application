import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            onLogin(email === 'admin@college.edu' ? 'Admin' : 'Student');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">College<span className="text-primary-600">Vote</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">Secure, Transparent, and Fair Academic Governance.</p>
                </div>

                <Card className="shadow-2xl border-slate-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-9 w-4 h-4 text-slate-400 z-10" />
                                <Input
                                    label="University Email"
                                    placeholder="name@college.edu"
                                    id="email"
                                    type="email"
                                    className="pl-10"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-9 w-4 h-4 text-slate-400 z-10" />
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    id="password"
                                    type="password"
                                    className="pl-10"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-100 transition-all" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 uppercase tracking-wider">Remember Me</span>
                            </label>
                            <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">Forgot Password?</a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 gap-2 shadow-lg shadow-primary-600/20"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </form>
                </Card>

                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <div className="h-px w-8 bg-slate-200"></div>
                        Academic Security Standard
                        <div className="h-px w-8 bg-slate-200"></div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium pb-8 leading-relaxed px-4">
                        By signing in, you agree to the <a href="#" className="underline decoration-slate-200 hover:text-slate-900 transition-colors">Voter Responsibility Policy</a> and acknowledge that all actions are recorded in the system audit log.
                    </p>
                </div>
            </div>

            {/* Demo Credentials Tip */}
            <div className="fixed bottom-6 right-6 bg-white border border-slate-200 p-3 rounded-xl shadow-lg animate-bounce hidden md:block">
                <span className="text-[10px] font-bold text-slate-900 uppercase block mb-1">Demo Credentials</span>
                <p className="text-[10px] text-slate-500 leading-tight font-medium">
                    Admin: admin@college.edu<br />
                    Student: student@college.edu
                </p>
            </div>
        </div>
    );
};

export default Login;
