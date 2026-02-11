import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApiStatus from "./pages/ApiStatus";
import SubmitPaper from "./pages/SubmitPaper";
import MySubmissions from "./pages/MySubmissions";
import ReviewAssignments from "./pages/ReviewAssignments";
import SubmitReview from "./pages/SubmitReview";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import "./App.css";

function App() {
    return (
        <div style={{ padding: 24 }}>
            <h1>BlindReview</h1>

            <nav style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                <Link to="/">Home</Link>
                <Link to="/status">API Status</Link>
                <Link to="/submit-paper">Submit Paper</Link>
                <Link to="/my-submissions">My Submissions</Link>
                <Link to="/review-assignments">Review Assignments</Link>
                <Link to="/submit-review">Submit Review</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile Settings</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/status" element={<ApiStatus />} />
                <Route path="/submit-paper" element={<SubmitPaper />} />
                <Route path="/my-submissions" element={<MySubmissions />} />
                <Route path="/review-assignments" element={<ReviewAssignments />} />
                <Route path="/submit-review" element={<SubmitReview />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfileSettings />} />
            </Routes>
        </div>
    );
}

export default App;
