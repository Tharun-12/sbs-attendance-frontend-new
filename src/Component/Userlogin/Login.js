// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext/Authcontext";
import landNestLogo from "../Assets/sbslogo.png";
import "./Login.css";
import { baseUrl } from "../../Apiurls";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call backend API instead of Firebase
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      // If login success, save user data in AuthContext
      login(data.user); // expecting backend to return { user: {...} }

      // Redirect after login
      navigate("/attendance");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="userlogin-wrapper">
      <div className="userlogin-container">
        <img src={landNestLogo} alt="Land Nest Logo" className="userlogin-logo" />

        <h2 className="userlogin-title">Welcome Back</h2>
        {error && <p className="userlogin-error">{error}</p>}

        <form onSubmit={handleSubmit} className="userlogin-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="userlogin-input"
          />

          <div className="userlogin-password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="userlogin-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="userlogin-toggle-password"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="userlogin-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
