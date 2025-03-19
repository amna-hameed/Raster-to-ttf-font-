import React from "react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-p">&copy; {new Date().getFullYear()} FontFusion. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;