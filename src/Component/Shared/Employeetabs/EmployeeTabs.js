import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarCheck } from 'react-icons/fa';
import './EmployeeTabs.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="employeetab_navbar bg-light">
      <div className="container-fluid d-flex justify-content-center">
        <ul className="employeetab_navbar-nav d-flex flex-row align-items-center">
          <li className={`employeetab_nav-item mx-3 ${location.pathname === '/attendance' ? 'active' : ''}`}>
            <Link className="employeetab_nav-link text-center" to="/attendance">
              {/* <FaTachometerAlt className="nav-icon" /> */}
              <div className="employeetab_link_text">Today's </div>
            </Link>
          </li>
          <li className={`employeetab_nav-item mx-3 ${location.pathname === '/monthlyattendance' ? 'active' : ''}`}>
            <Link className="employeetab_nav-link text-center" to="/monthlyattendance">
              {/* <FaCalendarCheck className="nav-icon" /> */}
              <div className="employeetab_link_text">Monthly Report</div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
