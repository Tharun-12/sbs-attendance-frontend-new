import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaCalendarCheck,
  FaUmbrellaBeach,
  FaFileInvoiceDollar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import "./AdminSidebar.css";
import logo from "../../Assets/Final-logo-SBS.png";
import { useAuth } from "./../../Authcontext/Authcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed);
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    logout();
    console.log("Logged out");
    navigate("/admin-login");
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div
            className={`admin-sidebar-toggle ${collapsed ? "collapsed" : ""}`}
            onClick={toggleSidebar}
          >
            <IoHomeOutline className="toggle-icon" />
          </div>
          &nbsp;&nbsp;
          <img src={logo} alt="Logo" className="admin-company-logo" />
        </div>
        <div className="admin-header-right">
          <div className="logout-button">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="logout-icon"
              onClick={handleLogout}
              style={{ cursor: "pointer", color: "red", fontSize: "24px" }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-position-sticky">
          <ul className="nav flex-column">
            <h2 className="text-center">Admin</h2>

            {/* Dashboard */}
            <li
              className={`admin-nav-item ${location.pathname === "/admindashboard" ? "active" : ""
                }`}
            >
              <Link
                className="nav-link"
                to="/admindashboard"
                onClick={handleNavItemClick}
              >
                <FaTachometerAlt className="admin-nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>

            {/* Employee (Dropdown) */}
         

              {/* Submenu */}
              <li
                className={`admin-nav-item ${location.pathname === "/employeelist" || location.pathname === "/employeeregister"
                    ? "active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/employeelist"   // 👈 main route (can change to /employeeregister if needed)
                  onClick={handleNavItemClick}
                >
                  <FaUsers className="admin-nav-icon" />
                  {!collapsed && <span className="link_text">Employees</span>}
                </Link>
              </li>


              {/* Daily Attendance */}
              <li
                className={`admin-nav-item ${location.pathname === "/admin-dailyattendance" ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/admin-dailyattendance"
                  onClick={handleNavItemClick}
                >
                  <FaCalendarCheck className="admin-nav-icon" />
                  {!collapsed && <span className="link_text">Daily Attendance</span>}
                </Link>
              </li>

              {/* Monthly Attendance */}
              <li
                className={`admin-nav-item ${location.pathname === "/admin-Monthlyattendance" ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/admin-Monthlyattendance"
                  onClick={handleNavItemClick}
                >
                  <FaCalendarAlt className="admin-nav-icon" />
                  {!collapsed && (
                    <span className="link_text">Monthly Attendance</span>
                  )}
                </Link>
              </li>

              {/* Leaves */}
              
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
