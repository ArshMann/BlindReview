import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

vi.mock('../../components/ui/dashboardTheme.css', () => ({}));

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form with email and password fields', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders welcome heading', () => {
    render(<Login />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('has a link to register page', () => {
    render(<Login />);

    const registerLinks = screen.getAllByRole('link', { name: /register/i });
    const inlineLink = registerLinks.find(el => el.classList.contains('br-inline-link'));
    expect(inlineLink).toBeInTheDocument();
    expect(inlineLink).toHaveAttribute('href', '/register');
  });

  it('allows typing in email and password fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('disables button while submitting', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(submitButton).toBeEnabled();
  });
});
