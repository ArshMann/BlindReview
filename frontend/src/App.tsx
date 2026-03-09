import { Link, Route, Routes } from "react-router-dom";
import { useAuth, ProtectedRoute } from "./auth";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import MySubmissions from "./pages/MySubmissions";
import ReviewAssignments from "./pages/ReviewAssignments";
import ProfileSettings from "./pages/ProfileSettings";
import "./App.css";


function App() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>BlindReview</h1>
                {isAuthenticated && (
                    <div>
                        <span>Hello, <strong>{user?.name}</strong></span>
                        <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
                    </div>
                )}
            </div>

            <nav style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                <Link to="/">Home</Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/my-submissions">My Submissions</Link>
                        <Link to="/review-assignments">Review Assignments</Link>
                        <Link to="/profile">Profile Settings</Link>
                    </>
                ) : (
                    <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </>
                )}
            </nav>

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/my-submissions" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
                <Route path="/review-assignments" element={<ProtectedRoute><ReviewAssignments /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}
export default App;
