import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import api from '@/api/axiosInstance';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/CreateUser', formData);

            const loginRes = await api.post('/Login', {
                email: formData.email,
                password: formData.password
            });

            const { Token, User } = loginRes.data;
            login(Token, User);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. User might already exist.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="br-theme-page">
            <Navbar />

            <main className="br-page-container br-auth-main">
                <section className="br-auth-card" aria-labelledby="register-title">
                    <div className="br-auth-brand">
                        <span className="br-logo-badge">BR</span>
                        <p className="br-logo-text">BlindReview</p>
                    </div>

                    <h1 id="register-title" className="br-auth-title">Create account</h1>
                    <p className="br-auth-subtitle">Join the platform and start submitting anonymously.</p>

                    {error && (
                        <div className="br-error-banner" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="br-auth-form">
                        <div className="br-form-field">
                            <label className="br-form-label" htmlFor="name">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                required
                                disabled={isSubmitting}
                                className="br-auth-input"
                            />
                        </div>

                        <div className="br-form-field">
                            <label className="br-form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                disabled={isSubmitting}
                                className="br-auth-input"
                            />
                        </div>

                        <div className="br-form-field">
                            <label className="br-form-label" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                disabled={isSubmitting}
                                className="br-auth-input"
                            />
                        </div>

                        <div className="br-form-field">
                            <label className="br-form-label" htmlFor="role">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="br-auth-input"
                            >
                                <option value="Student">Student</option>
                                <option value="Reviewer">Reviewer</option>
                            </select>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="br-btn-primary br-auth-submit">
                            {isSubmitting ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="br-auth-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="br-inline-link">
                            Login
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
};

export default Register;

