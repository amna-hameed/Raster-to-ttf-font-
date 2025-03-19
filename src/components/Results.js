import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Header from './Header';
import OriginalImageSection from "./OriginalImageSection";
import LineAnalysis from "./LineAnalysis";
import SingleFontCard from "./SingleFontCard";
import "../css/Results.css";
import "../css/SingleFontResults.css";

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fontType, setFontType] = useState(null);
    const [results, setResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!location.state?.file) {
            navigate("/");
            return;
        }
        setUploadedFile(location.state.file);
        setImagePreview(location.state.imagePreview);
        setFontType(location.state.fontType);
    }, [location.state, navigate]);

    useEffect(() => {
        if (!uploadedFile) return;

        const fetchFontResults = async () => {
            setIsProcessing(true);
            setErrorMessage(null);
            setResults(null);

            const formData = new FormData();
            formData.append("file", uploadedFile);
            formData.append("fontType", fontType);

            try {
                const response = await fetch("http://localhost:5000/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                console.log("Backend Response:", data);

                if (response.ok) {
                    if (data.error) {
                        setErrorMessage(data.error);
                        setResults(null);
                    } else {
                        setResults(data);
                    }
                } else {
                    setErrorMessage(data.error || "Failed to process image.");
                }
            } catch (error) {
                setErrorMessage("Error connecting to the server. Please try again later.");
                setResults(null);
            } finally {
                setIsProcessing(false);
            }
        };

        fetchFontResults();
    }, [uploadedFile, fontType]);

    useEffect(() => {
        if (isProcessing) {
            document.body.classList.remove("processed");
        } else {
            setTimeout(() => {
                document.body.classList.add("processed");
            }, 300);
        }
    }, [isProcessing]);

    const LoadingComponent = () => (
        <div className="loading-container">
            <p>Processing image...</p>
            <div className="loading-bar">
                <div className="loading-progress"></div>
            </div>
        </div>
    );

    const MultiFontResults = () => (
        <div className="content-wrapper-multi">
            {/* Fixed Title */}

            {/* Fixed Image Preview Below Title */}
            <div className="image-preview-container">
                <OriginalImageSection imagePreview={imagePreview} navigate={navigate} />
            </div>

            {/* Expandable Scrollable Container for Line Previews */}
            <div className="line-results-container">
                {errorMessage ? (
                    <ErrorContainer />
                ) : Array.isArray(results?.lines) && results.lines.length > 0 ? (
                    <LineAnalysis key="line-analysis" lines={results.lines} />
                ) : (
                    <p>No lines detected.</p>
                )}
            </div>
        </div>
    );

    const SingleFontResults = () => (
        <div className="content-wrapper">
            <h3 className="single-font-title">Single Font Analysis</h3> {/* Ensure title is within the container */}

            <div className="single-font-container">
                {/* Image Section */}
                <OriginalImageSection imagePreview={imagePreview} navigate={navigate} />

                {/* Results Section */}
                <h2> Font Matches </h2>
                <div className="single-font-box">
                    {results?.predictions?.length > 0 ? (
                        results.predictions.map((font, index) => (
                            <SingleFontCard key={index} font={font} />
                        ))
                    ) : (
                        <p className="no-font-message">No text found in the image.</p>
                    )}
                </div>
            </div>
        </div>
    );



    const ErrorContainer = () => (
        <div className="error-container">
            <div className="error-content">
                <OriginalImageSection imagePreview={imagePreview} navigate={navigate} />
                {/* Error Message on the Right */}
                <div className="error-message-box">
                    <h3 className="error-msg">Error Processing Image:</h3>
                    <p className="error-message">{errorMessage}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={errorMessage ? "single-results-container" : fontType === "multi" ? "multi-results-container" : "single-results-container"}>
            <Navbar />

            {/* Show the title only AFTER processing is complete */}
            {!isProcessing && (
                <h2 className={errorMessage ? "error-title" : fontType === "multi" ? "title" : "single-font-title"}>
                    {errorMessage
                        ? "Font Analysis Result"
                        : fontType === "multi"
                            ? "Multi-line Font Analysis"
                            : "Single Font Analysis"}
                </h2>

            )}

            <div className="results-wrapper">
                {isProcessing ? (
                    <LoadingComponent />
                ) : errorMessage ? (
                    <ErrorContainer />
                ) : fontType === "multi" ? (
                    <MultiFontResults />
                ) : (
                    <SingleFontResults />
                )}
            </div>
        </div>


    );
};

export default Results;