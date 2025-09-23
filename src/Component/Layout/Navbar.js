// Header.js
import React from "react";
import "./Header.css";
 

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <img src={logo} alt="Helix Engineers Logo" className="header-logo" />
      </div>
      <div className="header-right">
        <a href="https://helixengineers.in" target="_blank" rel="noopener noreferrer">
          helixengineers.in
        </a>
      </div>
    </header>
  );
};

export default Header;
