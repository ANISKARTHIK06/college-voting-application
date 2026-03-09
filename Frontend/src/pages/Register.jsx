import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { toast } from 'react-hot-toast';
import '../styles/Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: 'Demo Student',
        email: `demo.student${Math.floor(Math.random() * 10000)}@college.edu`,
        password: 'password123',
        confirmPassword: 'password123',
        userType: 'student',
        department: 'Computer Science',
        position: '2nd Year'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...userData } = formData;
            await register({ ...userData, role: 'student' });
            navigate('/student/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please check the information.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fadeIn">
            <div className="auth-card register-card glass-panel animate-slideUp">
                <div className="auth-header">
                    <div className="auth-brand animate-float">🗳️</div>
                    <h1 className="auth-title">Join CollegeVote</h1>
                    <p className="auth-subtitle">Empowering your voice in college governance</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="error-box">{error}</div>}

                    <div className="register-grid">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="name@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">I am a</label>
                            <select
                                id="role-selector"
                                name="userType"
                                className="form-input"
                                value={formData.userType}
                                onChange={handleChange}
                                required
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff Member</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="form-input"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Position / Year</label>
                            <input
                                type="text"
                                name="position"
                                className="form-input"
                                placeholder="e.g. 3rd Year / Professor"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading} style={{ marginTop: '12px' }}>
                        {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
