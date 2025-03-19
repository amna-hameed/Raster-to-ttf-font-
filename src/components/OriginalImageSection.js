// OriginalImageSection.js
import React from "react";
import "../css/SingleFontResults.css";

const OriginalImageSection = ({ imagePreview, navigate, errorMessage }) => {
    return (
        <div className="original-image-section">
            <h3>Original Image</h3>
            <div className="original-image-box">
                {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded Original" />
                ) : (
                    <p>Image Preview Unavailable</p>
                )}
            </div>

            <div className="button-group">
                <button className="fuse-again-btn" onClick={() => navigate("/font-matcher?guest=true")}>Fuse Again</button>
                <button className="fuse-again-btn" onClick={() => navigate("/feedback")}>Give Feedback</button>
            </div>

            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
};

export default OriginalImageSection