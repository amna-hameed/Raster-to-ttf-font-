import React from "react";

const FontPreview = ({ fontName, sampleText, isRaster }) => {
    const daFontFonts = ["alagard"];
    const freeFonts = ["times-roman", "arial-rounded-mt-regular"];

    const handleFontClick = () => {
        let searchUrl;
        if (isRaster || daFontFonts.includes(fontName.toLowerCase())) {
            searchUrl = `https://www.dafont.com/${fontName.toLowerCase()}.font`;
        } else if (freeFonts.includes(fontName.toLowerCase())) {
            searchUrl = `https://freefonts.co/fonts/${fontName.toLowerCase().replace(/\s+/g, "-")}`;
        } else {
            searchUrl = `https://fonts.google.com/specimen/${fontName.replace(/\s+/g, "+")}`;
        }
        window.open(searchUrl, "_blank");
    };

    return (
        <div
            className="font-preview"
            style={{ fontFamily: fontName, fontSize: "20px", cursor: "pointer", textAlign: "center" }}
            onClick={handleFontClick}
        >
            {sampleText}
        </div>
    );
};

export default FontPreview;