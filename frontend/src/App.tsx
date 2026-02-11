import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApiStatus from "./pages/ApiStatus";
import "./App.css";

function App() {
    return (
        <div style={{ padding: 24 }}>
            <h1>BlindReview</h1>

            <nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <Link to="/">Home</Link>
                <Link to="/status">API Status</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/status" element={<ApiStatus />} />
            </Routes>
        </div>
    );
}

export default App;
