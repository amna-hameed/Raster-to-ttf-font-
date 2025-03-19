import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ✅ Reset authentication state
        setIsAuthenticated("guest");
        localStorage.removeItem("isAuthenticated");

        // ✅ Navigate to Logout screen
        navigate("/logout");

        // ✅ Force Navbar to update by reloading the page (optional)
        setTimeout(() => {
            window.location.reload();
        }, 500); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white expanded-navbar">
            <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
                
                {/* Logo on the Left */}
                <div className="logo">
                    <span>Font</span>Fusion
                </div>

                {/* Navigation Links in the Center */}
                <div className="mx-auto">
                    <ul className="navbar-nav flex-row">
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/get-fonts">Fonts</Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/font-matcher">Fuse Image</Link>
                        </li>
                        <li className="nav-item me-5">
                            <Link className="nav-link" to="/submit-feedback">Feedback</Link>
                        </li>
                    </ul>
                </div>

                {/* Authentication Buttons on the Right */}
                <div>
                    <ul className="navbar-nav flex-row">
                        {isAuthenticated === "true" ? (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item me-3">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Signup</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
