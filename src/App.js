import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FontMatcher from "./components/FontMatcher";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Results from "./components/Results";
import FontsPage from "./components/FontsPage";
import FeedbackForm from "./components/FeedbackForm";
import Footer from "./components/Footer";
import Logout from "./components/Logout";
import Feedback from "./components/FeedbackForm";

const App = () => {
    // ✅ Ensure the default authentication state is "guest"
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        return storedAuth === "true" ? "true" : "guest"; // Default to guest
    });

    // ✅ Persist authentication across refreshes
    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

            <Routes>
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/login" element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/results" element={<Results isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/contact" element={<Contact isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/get-fonts" element={<FontsPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/feedback" element={<FeedbackForm isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/logout" element={<Logout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/submit-feedback" element={<Feedback isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />

                {/* ✅ Allow Guests to Access FontMatcher */}
                <Route path="/font-matcher" element={<FontMatcher isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />

                {/* ✅ Redirect unknown routes to Home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default App;
