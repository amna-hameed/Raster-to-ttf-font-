import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../css/FeedbackForm.css";

const FeedbackForm = ({ isAuthenticated, setIsAuthenticated }) => {
  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Track submission status
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("feedback", feedback);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:5000//submit_feedback", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true); // Hide form and show thank-you message
      } else {
        console.error("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <Navbar />
      <div className="feedback-card">
        {!submitted ? (
          <>
            <h2 className="text-center mb-4">Font Feedback</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Feedback</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your experience..."
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Attach Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="feedback-submit-btn">Submit Feedback</button>
              </div>
            </form>
          </>
        ) : (
          <div className="thank-you-message text-center">
            <h3>Thank you for your feedback!</h3>
            <button className="back-btn" onClick={() => navigate("/font-matcher?guest=true")}>
              Back to Fusing!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;