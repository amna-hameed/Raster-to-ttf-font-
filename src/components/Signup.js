import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "../css/Signup.css";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message before request

        try {
            const response = await axios.post("http://localhost:5000/api/signup", {
                username,
                password,
            });

            console.log("Signup Response:", response.data); // Debugging

            if (response.data.message) {
                alert("Signup successful! Redirecting to login...");
                navigate("/login"); // Redirect user to login page
            }
        } catch (error) {
            console.error("Signup Error:", error);
            if (error.response) {
                setError(error.response.data.error || "Signup failed. Please try again.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="signup-container">
            <Navbar />
            <div className="signup-content">
                {/* Left Section - Signup Form */}
                <div className="signup-form-section">
                    <h2>Welcome to </h2>
                    <div class="login-logo">
                        <span>Font</span><span>Fusion!</span>
                    </div>
                    {error && <p className="error-message">{error}</p>} {/* Show error messages */}
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
                        <button type="submit" className="signup-submit-btn">Register</button>
                    </form>
                    <p className="login-link">Have an account? <a href="/login">Login</a></p>
                </div>

                {/* Right Section - Info */}
                <div className="info-section">
                    <h3>Transform your font experience</h3>
                    <p>
                        Join FontFusion to access our ML-powered font matching tool.
                        Upload images and discover matching vector fonts with high accuracy.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Signup;