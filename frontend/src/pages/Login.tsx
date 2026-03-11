import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@auth';
import api from '@/api/axiosInstance';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/Login', { email, password });
            const { Token, User } = response.data;

            login(Token, User);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="br-theme-page">
            <Navbar />

            <main className="br-page-container br-auth-main">
                <section className="br-auth-card" aria-labelledby="login-title">
                    <div className="br-auth-brand">
                        <span className="br-logo-badge">BR</span>
                        <p className="br-logo-text">BlindReview</p>
                    </div>

                    <h1 id="login-title" className="br-auth-title">Welcome back</h1>
                    <p className="br-auth-subtitle">Sign in to continue with anonymous peer review.</p>

                    {error && (
                        <div className="br-error-banner" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="br-auth-form">
                        <div className="br-form-field">
                            <label className="br-form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isSubmitting}
                                className="br-auth-input"
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="br-btn-primary br-auth-submit">
                            {isSubmitting ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>

                    <p className="br-auth-footer">
                        No account yet?{' '}
                        <Link to="/register" className="br-inline-link">
                            Register
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
};

export default Login;

