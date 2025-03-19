import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./Navbar";
import "../css/Logout.css"; // Ensure this file exists for styling

const Logout = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });

                console.log("User logged out successfully");

                // ✅ Correctly reset authentication
                setIsAuthenticated("guest");
                localStorage.removeItem("isAuthenticated"); // Remove stored authentication

                // ✅ Ensure Navbar updates by forcing a re-render
                setTimeout(() => {
                    navigate('/login');
                    window.location.reload(); // ✅ Force Navbar update
                }, 2000);
            } catch (error) {
                console.error("Logout error:", error);
                setTimeout(() => {
                    navigate('/login');
                    window.location.reload(); // ✅ Ensure UI updates even on error
                }, 2000);
            }
        };

        logoutUser();
    }, [navigate, setIsAuthenticated]);

    return (
        <div className="logout-container">
            <div className="logout-content">
                <h2>Logging out...</h2>
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default Logout;
