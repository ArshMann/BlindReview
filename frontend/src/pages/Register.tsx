import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/auth';
import api from '@/api/axiosInstance';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/CreateUser', formData);
            // Add logic later if you want to show a success message or auto-login after registration

            const loginRes = await api.post('/Login', {
                email: formData.email,
                password: formData.password
            });

            const { Token, User } = loginRes.data;
            login(Token, User);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. User might already exist.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

                    <select name="role" onChange={handleChange} style={styles.input}>
                        <option value="Student">Student</option>
                        <option value="Reviewer">Reviewer</option>
                    </select>

                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
    card: { padding: '30px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', maxWidth: '400px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '10px', textAlign: 'center' }
};

export default Register;