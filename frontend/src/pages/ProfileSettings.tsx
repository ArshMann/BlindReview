import { useAuth } from '@/auth';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <div className="br-theme-page">
      <Navbar />

      <main className="br-page-container br-dashboard-main">
        <header className="br-dashboard-header">
          <h1 className="br-page-title">
            <span className="br-title-icon" aria-hidden="true">{'\u{1F464}'}</span>
            Profile Settings
          </h1>
        </header>

        <div className="br-dashboard-stack">
          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Account Information</h2>
            </div>

            <div className="br-form-grid br-form-grid-two">
              <div className="br-form-field">
                <label className="br-form-label" htmlFor="profile-name">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  className="br-auth-input br-readonly-input"
                  value={user?.name ?? 'Not available'}
                  readOnly
                />
              </div>

              <div className="br-form-field">
                <label className="br-form-label" htmlFor="profile-email">
                  Email
                </label>
                <input
                  id="profile-email"
                  className="br-auth-input br-readonly-input"
                  value={user?.email ?? 'Not available'}
                  readOnly
                />
              </div>

              <div className="br-form-field">
                <label className="br-form-label" htmlFor="profile-role">
                  Role
                </label>
                <input
                  id="profile-role"
                  className="br-auth-input br-readonly-input"
                  value={user?.role ?? 'Not available'}
                  readOnly
                />
              </div>

              <div className="br-form-field">
                <label className="br-form-label" htmlFor="profile-credits">
                  Credits
                </label>
                <input
                  id="profile-credits"
                  className="br-auth-input br-readonly-input"
                  value={user?.credits ?? 0}
                  readOnly
                />
              </div>
            </div>
          </section>

          <section className="br-panel">
            <div className="br-section-header">
              <h2 className="br-section-title">Preferences</h2>
              <p className="br-section-subtitle">Configuration options will appear here as they are added.</p>
            </div>

            <div className="br-pill-row" aria-label="Preference status">
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

