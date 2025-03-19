import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/FontMatcher.css";

const FontMatcher = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fontType, setFontType] = useState("single");

    // ✅ Ensure only authenticated users and guests can access
    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");

        if (!storedAuth || (storedAuth !== "true" && storedAuth !== "guest")) {
            navigate("/login");
        } else {
            setIsAuthenticated(storedAuth); // ✅ Ensure Navbar updates correctly
        }
    }, [navigate, setIsAuthenticated]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setErrorMessage("Invalid file type. Only PNG, JPEG, and WebP allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("File size exceeds 5MB.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        setSelectedFile(file);
        setErrorMessage(null);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        setErrorMessage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleMatchFont = (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setErrorMessage("No image selected.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            navigate("/results", {
                state: {
                    file: selectedFile,
                    imagePreview: reader.result,
                    fontType: fontType,
                },
            });
        };
    };

    return (
        <div>
            {/* ✅ Navbar updates based on authentication state */}
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <div className="upload-card">
                <h2 className="upload-title">Choose Analysis Type</h2>

                <div className="font-type-selection">
                    <button
                        className={`tab-btn ${fontType === "single" ? "active" : ""}`}
                        onClick={() => setFontType("single")}
                    >
                        H1 <br />
                        <span>Single Font</span>
                    </button>
                    <button
                        className={`tab-btn ${fontType === "multi" ? "active" : ""}`}
                        onClick={() => setFontType("multi")}
                    >
                        H2 <br />
                        <span>Multiple Fonts</span>
                    </button>
                </div>

                <p className="instruction-text">Upload a clear image of text to identify the font</p>

                {!imagePreview ? (
                    <div className="upload-box">
                        <input
                            type="file"
                            id="file-upload"
                            ref={fileInputRef}
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileUpload}
                            className="file-input"
                        />
                        <label htmlFor="file-upload" className="upload-label">
                            <p>Drop your image here or click to upload</p>
                            <span>Supports JPEG, PNG, and WebP (max 5MB)</span>
                        </label>
                    </div>
                ) : (
                    <div className="image-preview-section">
                        <div className="image-preview-container">
                            <img
                                src={imagePreview}
                                alt="Uploaded"
                                className="preview-image"
                            />
                            <button className="remove-image-btn" onClick={handleRemoveImage}>
                                ❌
                            </button>
                        </div>
                        <button className="match-btn" onClick={handleMatchFont}>
                            Start Fusing!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FontMatcher;
