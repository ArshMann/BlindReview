import { Link } from 'react-router-dom';
import { useAuth } from '@/auth';
import Navbar from '../components/ui/Navbar';
import '../components/ui/dashboardTheme.css';

const authenticatedTiles = [
    {
        to: '/my-submissions',
        icon: '\u{1F4C4}',
        title: 'My Submissions',
        description: 'Upload files and track what you have submitted for peer feedback.',
    },
    {
        to: '/review-assignments',
        icon: '\u{1F50D}',
        title: 'Review Assignments',
        description: 'Open your assigned papers and complete reviews before the deadline.',
    },
    {
        to: '/profile',
        icon: '\u{1F464}',
        title: 'Profile Settings',
        description: 'Check account details and update your profile preferences.',
    },
];

const guestTiles = [
    {
        to: '/login',
        icon: '\u{1F511}',
        title: 'Login',
        description: 'Sign in to access submissions, assignments, and profile tools.',
    },
    {
        to: '/register',
        icon: '\u{1F4DD}',
        title: 'Create Account',
        description: 'Register as a student or reviewer to start collaborating anonymously.',
    },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const tiles = isAuthenticated ? authenticatedTiles : guestTiles;

    return (
        <div className="br-theme-page">
            <Navbar />

            <main className="br-page-container br-dashboard-main">
                <header className="br-dashboard-header">
                    <h1 className="br-page-title">
                        <span className="br-title-icon" aria-hidden="true">{'\u{1F512}'}</span>
                        BlindReview Platform
                    </h1>
                </header>

                <div className="br-dashboard-stack">
                    <section className="br-panel">
                        <div className="br-section-header">
                            <h2 className="br-section-title">
                                <span className="br-inline-icon" aria-hidden="true">{'\u{1F4C1}'}</span>
                                Quick Navigation
                            </h2>
                        </div>

                        <div className="br-link-tile-grid">
                            {tiles.map((tile) => (
                                <Link key={tile.title} to={tile.to} className="br-link-tile">
                                    <h3 className="br-link-tile-title">
                                        <span className="br-inline-icon" aria-hidden="true">{tile.icon}</span>
                                        {tile.title}
                                    </h3>
                                    <p className="br-link-tile-text">{tile.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

