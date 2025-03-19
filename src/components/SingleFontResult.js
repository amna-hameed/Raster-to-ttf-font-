// SingleFontResult.js
import React from 'react';

const SingleFontResult = ({ result }) => {
    return (
        <div className="font-result">
            <div className="font-image">
                {result.original_image && (
                    <img src={`data:image/png;base64,${result.original_image}`} alt="Processed" className="processed-image" />
                )}
            </div>
            <div className="font-scores">
                <h3>Predicted Font</h3>
                <ul>
                    <li>
                        {result.font} <span className="probability-score">(Score: {result.score.toFixed(3)})</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SingleFontResult;
