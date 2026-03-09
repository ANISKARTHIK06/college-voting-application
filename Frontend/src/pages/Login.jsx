import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Auth.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: 'admin@college.com',
        password: 'admin123'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(formData);
            
            if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.role === 'faculty') {
                navigate('/faculty/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fadeIn">
            <div className="auth-card glass-panel animate-slideUp">
                <div className="auth-header">
                    <div className="auth-brand animate-float">🗳️</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Secure access to the Governance Platform</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="error-box">{error}</div>}

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Work Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="name@college.edu"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="form-label" htmlFor="password">Password</label>
                            <Link to="#" className="auth-link" style={{ fontSize: '0.75rem', textDecoration: 'none' }}>Forgot?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    padding: 0
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="auth-footer">
                    New to the platform? <Link to="/register" className="auth-link">Create an Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
