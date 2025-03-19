import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./Navbar";
import "../css/Login.css";

const Login = ({ isAuthenticated, setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // ✅ Loading state for login processing
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // ✅ Start loading animation

        try {
            const response = await axios.post(
                'http://localhost:5000/api/login',
                { username, password },
                { withCredentials: true }
            );

            console.log("Login Response:", response.data);

            if (response.data.message) {
                setIsAuthenticated(true);

                // ✅ Show loading bar for 2 seconds before redirecting
                setTimeout(() => {
                    navigate('/font-matcher');
                }, 2000);
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError(error.response?.data?.error || "Login failed. Please try again.");
            setLoading(false); // ✅ Stop loading if login fails
        }
    };

    // ✅ Redirect to FontMatcher after authentication
    useEffect(() => {
        if (isAuthenticated === "true") {
            setLoading(true);
            setTimeout(() => {
                navigate('/font-matcher');
            }, 2000);
        }
    }, [isAuthenticated, navigate]);

    // ✅ Navigate as guest (No authentication required)
    const handleGuestAccess = () => {
        console.log("Navigating as guest...");
        localStorage.setItem("isAuthenticated", "guest");
        setIsAuthenticated("guest");
        navigate('/font-matcher', { replace: true });
    };

    return (
        <div className="login-container">
            <Navbar />
            <div className="login-content">
                <div className="login-form-section">
                    <h2>Welcome to </h2>
                    <div class="login-logo">
                        <span>Font</span><span>Fusion!</span>
                    </div>
                    {error && <p className="error-message">{error}</p>}

                    {loading ? (
                        // ✅ Show Loading Bar when logging in
                        <div className="loading-bar-container">
                            <p>Logging in...</p>
                            <div className="loading-bar"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="login-submit-btn">Login</button>
                        </form>
                    )}

                    <button className="guest-btn" onClick={handleGuestAccess}>
                        Continue as Guest
                    </button>

                    <p className='login-msg' >Need an account? <Link to="/signup">Register</Link></p>
                </div>
                <div className="info-section">
                    <h3>Transform your font experience</h3>
                    <p>Join FontFusion to access our ML-powered font matching tool. Upload images and discover matching vector fonts with high accuracy.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;