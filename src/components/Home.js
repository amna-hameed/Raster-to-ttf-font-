import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Home.css";
import Navbar from "./Navbar"; // ✅ Only one Navbar
import Header from "./Header";
import Footer from "./Footer";
import FAQ from "./FAQ";

const Home = ({ isAuthenticated, setIsAuthenticated }) => {
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll(".scroll-effect");
            elements.forEach((el) => {
                if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
                    el.classList.add("visible");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Ensure authentication state persists
    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(authStatus);
    }, [setIsAuthenticated]);

    return (
        <div>
            {/* ✅ Use a single Navbar, passing authentication props */}
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

            <Header />

            <div className="container text-center py-4 font-identifier-section">
                <h2 className="fw-bold">ML model-based Raster Vector Matcher.</h2>
                <p className="text-muted">
                    Our deep-learning-based tool analyzes raster font images and predicts the closest matching vector fonts with high accuracy.
                </p>
                <p>
                    Need to identify a font from an old design or logo? Our AI-driven model takes a raster text image and matches it to the closest vector fonts, solving the question, “What font is this?”
                </p>
                <p>
                    Unlike traditional font detectors, our system learns from raster-vector font pairs, ensuring precise recognition even in challenging cases. The model maps character features, making it ideal for printed text font identification.
                </p>
                <p>
                    Improve accuracy by uploading high-quality images with clear characters and minimal distortion. Our advanced feature extraction ensures reliable results, even with varying font styles.
                </p>
                <p>
                    Have a tricky font to match? Stay tuned for future updates as we expand support for more fonts and styles. Try our tool now and experience AI-driven font detection!
                </p>
            </div>

            <FAQ />
        
        </div>
    );
};

export default Home;
