import React from "react";
import "../css/Header.css";

const Header = () => {
  return (
    <header className="header">
      <p className="subtext">3 broke students from FAST present</p>
      <h1 className="main-title">FontFusion</h1>
      <p className="tagline">Upload an image of raster font text, and we’ll match the closest vector font.</p>
    </header>
  );
};

export default Header;
