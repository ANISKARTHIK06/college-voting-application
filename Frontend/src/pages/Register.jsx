import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registerNumber: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
        department: '',
        position: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset position if userType changes
            ...(name === 'userType' ? { position: '' } : {})
        }));
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
            // Map 'staff' userType to 'faculty' role for backend consistency
            const finalRole = formData.userType === 'staff' ? 'faculty' : 'student';
            const data = await register({ ...userData, role: finalRole });
            
            if (data.role === 'faculty') {
                navigate('/faculty/dashboard');
            } else {
                navigate('/student/dashboard');
            }
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
                            <label className="form-label">Register Number</label>
                            <input
                                type="text"
                                name="registerNumber"
                                className="form-input"
                                placeholder="e.g. 7306211..."
                                value={formData.registerNumber}
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
                            <select
                                name="department"
                                className="form-input"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="Agricultural Engineering">Agricultural Engineering</option>
                                <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
                                <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
                                <option value="Biomedical Engineering">Biomedical Engineering</option>
                                <option value="Biotechnology">Biotechnology</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Computer Science and Design">Computer Science and Design</option>
                                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                <option value="Computer Technology">Computer Technology</option>
                                <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                                <option value="Fashion Technology">Fashion Technology</option>
                                <option value="Food Technology">Food Technology</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Position / Year</label>
                            <select
                                name="position"
                                className="form-input"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Position</option>
                                {formData.userType === 'student' ? (
                                    <>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Associate Professor Level 1">Associate Professor Level 1</option>
                                        <option value="Associate Professor Level 2">Associate Professor Level 2</option>
                                        <option value="Associate Professor Level 3">Associate Professor Level 3</option>
                                        <option value="HOD">HOD</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
