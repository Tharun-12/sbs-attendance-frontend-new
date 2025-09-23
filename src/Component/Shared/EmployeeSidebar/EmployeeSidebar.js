import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/Authcontext";
import { FaUserCircle } from "react-icons/fa";
import "./EmployeeSidebar.css";
import logo from "../../Assets/sbslogo.png";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🚀 Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/"); // send to login/home
    }
  }, [user, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // clears session
    navigate("/");
  };



  return (
    <>
      {/* Header Section */}
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="company-logo" />
        </div>
        <div className="header-right">
          <div className="profile-container" ref={dropdownRef}>
            <FaUserCircle
              className="profile-icon"
              onClick={toggleDropdown}
              style={{ fontSize: "30px", cursor: "pointer" }}
            />
            {isDropdownOpen && (
              <div className="dropdown-menu show">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body Section */}
     
    </>
  );
};

export default EmployeeDashboard;
