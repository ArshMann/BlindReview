import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MySubmissions from './pages/MySubmissions';
import ReviewAssignments from './pages/ReviewAssignments';
import SubmitReview from './pages/SubmitReview';
import ProfileSettings from './pages/ProfileSettings';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/my-submissions" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
            <Route path="/review-assignments" element={<ProtectedRoute><ReviewAssignments /></ProtectedRoute>} />
            <Route path="/review/:assignmentId" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;
