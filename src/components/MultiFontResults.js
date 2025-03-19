import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../css/Results.css";

const FontPreview = ({ fontName, sampleText, isRaster }) => {
    const daFontFonts = ["alagard"];
    const freeFonts = ["times-roman", "arial-rounded-mt-regular"];

    const handleFontClick = () => {
        let searchUrl;
        if (isRaster) {
            searchUrl = `https://www.dafont.com/${fontName.toLowerCase()}.font`;
        } else {
            if (daFontFonts.includes(fontName.toLowerCase())) {
                searchUrl = `https://www.dafont.com/${fontName.toLowerCase()}.font`;
            } else if (freeFonts.includes(fontName.toLowerCase())) {
                searchUrl = `https://freefonts.co/fonts/${fontName.toLowerCase().replace(/\s+/g, '-')}`;
            } else {
                searchUrl = `https://fonts.google.com/specimen/${fontName.replace(/\s+/g, "+")}`;
            }
        }
        window.open(searchUrl, "_blank");
    };

    return (
        <div
            style={{ fontFamily: fontName, fontSize: '19px', padding: '10px', cursor: 'pointer', textAlign: 'center' }}
            onClick={handleFontClick}
        >
            {sampleText}
        </div>
    );
};

const MultiFontResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!location.state?.predictions) {
            navigate("/");  // Redirect if no predictions are passed
            return;
        }
        setResults(location.state.predictions);
    }, [location.state, navigate]);

    return (
        <div className="results-container">
            <Navbar />
            <h2 className="title">Multi Font Match Results</h2>
            <div className="content-wrapper">
                <div className="results-section">
                    {results && results.lines.map((line, lineIndex) => (
                        <div key={lineIndex}>
                            <h4>Line {line.line_label}</h4>
                            {line.fonts.map((font, fontIndex) => (
                                <div key={fontIndex}>
                                    <h5>{font.font}</h5>
                                    <img src={`data:image/png;base64,${line.original_image}`} alt="Predicted Font" />
                                    <FontPreview fontName={font.font} sampleText="The quick brown fox jumps over the lazy dog." isRaster={true} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultiFontResults;