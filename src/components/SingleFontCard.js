import React from "react";
import FontPreview from "./FontPreview";
import "../css/SingleFontResults.css";

const SingleFontCard = ({ font }) => {
    return (
        <div className="single-font-card">
            <div className="single-font-header">
                <span className="font-name">{font.font}</span>
                <span className="match-score">{(font.score * 100).toFixed(0)}% match</span>
            </div>
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${font.score * 100}%` }}></div>
            </div>
            <div className="single-font-preview">
                <FontPreview fontName={font.font} sampleText="The quick brown fox jumps over the lazy dog" />
            </div>
        </div>
    );
};

export default SingleFontCard;