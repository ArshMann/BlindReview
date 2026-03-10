import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth';
import './dashboardTheme.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/my-submissions', label: 'My Submissions' },
  { to: '/review-assignments', label: 'Review Assignments' },
  { to: '/profile', label: 'Profile' },
];

const isRouteActive = (pathname: string, route: string) => {
  if (route === '/') {
    return pathname === route;
  }

  return pathname.startsWith(route);
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.add('br-hide-legacy-shell');

    return () => {
      document.body.classList.remove('br-hide-legacy-shell');
    };
  }, []);

  return (
    <header className="br-navbar">
      <div className="br-navbar-inner">
        <Link to="/" className="br-navbar-brand" aria-label="BlindReview Home">
          <span className="br-navbar-brand-mark">BR</span>
          <span className="br-navbar-brand-text">BlindReview</span>
        </Link>

        <nav className="br-navbar-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`br-navbar-link ${isRouteActive(location.pathname, link.to) ? 'br-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="br-navbar-controls">
          {isAuthenticated ? (
            <>
              <span className="br-user-chip" title={user?.name ?? 'User'}>
                {user?.name ?? 'User'}
              </span>
              <button type="button" className="br-btn-secondary br-btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="br-navbar-control-link">
                Login
              </Link>
              <Link to="/register" className="br-btn-secondary br-btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="br-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="br-mobile-menu">
          <nav className="br-mobile-links" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.to}`}
                to={link.to}
                className={`br-mobile-link ${isRouteActive(location.pathname, link.to) ? 'br-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="br-mobile-controls">
            {isAuthenticated ? (
              <>
                <span className="br-user-chip" title={user?.name ?? 'User'}>
                  {user?.name ?? 'User'}
                </span>
                <button type="button" className="br-btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="br-mobile-control-link">
                  Login
                </Link>
                <Link to="/register" className="br-btn-secondary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
