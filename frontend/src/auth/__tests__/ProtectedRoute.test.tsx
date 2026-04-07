import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test/utils';

import ProtectedRoute from '../components/ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to /login when not authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({
      id: '1', name: 'Test', email: 'test@test.com',
      role: 'Student', credits: 0, createdAt: '2024-01-01'
    }));

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
