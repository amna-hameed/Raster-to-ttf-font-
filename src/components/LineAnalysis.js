import React, { useEffect, useState } from "react";
import FontPreview from "./FontPreview";

const LineAnalysis = ({ lines = [] }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Delay transition for smooth effect
        const timeout = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="multi-font-results">
            {lines.length > 0 ? (
                lines.map((line, index) => (
                    <div key={index} className="line-analysis">
                        <div className="line-preview">
                            <h4>Line {index + 1}</h4>
                            <div className="line-image-box">
                                {line.original_image ? (
                                    <img src={`data:image/jpeg;base64,${line.original_image}`} alt={`Detected Line ${index + 1}`} />
                                ) : (
                                    <p>Line Image Preview</p>
                                )}
                            </div>
                        </div>

                        <div className="font-predictions">
                            <h4>Top Font Matches</h4>
                            {line.fonts && line.fonts.length > 0 && line.fonts.some(font => font.score > 0) ? (
                                line.fonts.map((font, fIndex) =>
                                    font.score > 0 ? (
                                        <div key={fIndex} className={`font-match ${animate ? "animate" : ""}`}>
                                            <div className="font-info">
                                                <span className="font-name">{font.font}</span>
                                                <span className="match-score">{(font.score * 100).toFixed(0)}% match</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${font.score * 100}%` }}></div>
                                            </div>
                                            <FontPreview fontName={font.font} sampleText="The quick brown fox jumps over the lazy dog" />
                                        </div>
                                    ) : null
                                )
                            ) : (
                                <p>No font matches found.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No lines detected.</p>
            )}
        </div>
    );
};

export default LineAnalysis;