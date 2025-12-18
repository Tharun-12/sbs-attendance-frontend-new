import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

import { useAuth } from "../Authcontext/Authcontext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../Assets/sbslogo.png";

// ✅ If you are using Firebase Authentication
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase"; // make sure you have firebase config

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useAuth();

  useEffect(() => {
    localStorage.clear(); 
  }, []);

  
const handleLogin = async (e) => {
    e.preventDefault();

    // Static login credentials
    const staticEmail = "admin@gmail.com";
    const staticPassword = "Admin@123";

    try {
        // Check against static credentials
        if (email === staticEmail && password === staticPassword) {
            // Create user object
            const user = {
                email: email,
                uid: "admin-static-uid",
                isAdmin: true
            };

            // Save user in context
            login(user);

            // Optional: also keep in localStorage/sessionStorage
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/admindashboard"); // redirect to your dashboard page
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        console.error("Login failed:", err.message);
        alert("Invalid email or password. Please try again.");
    }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-side">
          <div className="login-logo-container">
            <img
              className="login-logo"
              src={logo}
              alt="Funstay Logo"
            />
          </div>
          <h2 className="login-tagline"></h2>
        </div>
        <div className="login-login-side">
          <div>
            <h1 className="login-welcomeback">Welcome Back</h1>
            <p className="login-subtitle">Log in to start your next adventure!</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-password-input-group">
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)} 
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* <div className="d-flex justify-content-end mb-2">
              <a href="/forgot" className="login-forgot-password"> Forgot Password</a>
            </div> */}
            <button className="login-btn login-btn-login">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
