import React,  { useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from './Footer';
import '../css/Contact.css';

const Contact = ({ isAuthenticated, setIsAuthenticated }) => {

    // ✅ Ensure authentication state persists
    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(authStatus);
    }, [setIsAuthenticated]);

    return (
        <div className="contact-container">
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <div className="contact-card">
                <h1>Contact Us</h1>
                <p className="contact-description">Have questions or feedback? Reach out to our team!</p>

                {/* Development Team */}
                <div className="team-section">
                    <h2>Development Team</h2>
                    <ul>
                        <li><strong>Alishba</strong> - Lead Developer</li>
                        <li><strong>Amna</strong> - Backend Developer</li>
                        <li><strong>Hareem</strong> - Frontend Developer</li>
                    </ul>
                </div>

                {/* Supervisor Section */}
                <div className="supervisor-section">
                    <h2>Supervisors</h2>
                    <p><strong>Dr. Hasan Mujtaba</strong></p>
                    <p><strong>Miss Zonera Anjum</strong></p>
                </div>

                {/* Contact Information */}
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <ul>
                        <li><strong>Email:</strong></li>
                        <li> i210879@nu.edu.pk </li>
                        <li> i210783@nu.edu.pk </li>
                        <li> i212743@nu.edu.pk</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Contact;
