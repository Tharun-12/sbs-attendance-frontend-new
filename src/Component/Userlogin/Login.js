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
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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

      const employeeData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        contactNo: data.user.contactNo,
        role: data.user.role,
        status: data.user.status
      };
      
      localStorage.setItem('employeeData', JSON.stringify(employeeData));
      login(employeeData);
      navigate("/attendance");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotLoading(true);
    
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address");
      setForgotLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotMessage("Please enter a valid email address");
      setForgotLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setForgotMessage("OTP has been sent to your email. Redirecting to reset page...");
      
      // Auto-reflect email to reset page
      localStorage.setItem('resetEmail', forgotEmail);
      
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);

    } catch (err) {
      console.error(err);
      setForgotMessage(err.message || "Failed to process request");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="userlogin-wrapper">
      <div className="userlogin-container">
        <img src={landNestLogo} alt="Land Nest Logo" className="userlogin-logo" />

        <h2 className="userlogin-title">
          {showForgotPassword ? "Reset Password" : "Welcome Back"}
        </h2>
        
        {!showForgotPassword ? (
          <>
            {error && <p className="userlogin-error">{error}</p>}

            <form onSubmit={handleSubmit} className="userlogin-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="userlogin-input"
                disabled={loading}
              />

              <div className="userlogin-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="userlogin-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="userlogin-toggle-password"
                  disabled={loading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button 
                type="submit" 
                className="userlogin-btn"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="forgot-password-link">
              <button 
                onClick={() => {
                  setShowForgotPassword(true);
                  // Auto-fill forgot email with login email if available
                  if (email) {
                    setForgotEmail(email);
                  }
                }}
                className="forgot-password-btn"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <>
            {forgotMessage && (
              <p className={forgotMessage.includes("OTP has been sent") ? "userlogin-success" : "userlogin-error"}>
                {forgotMessage}
              </p>
            )}
            
            <form onSubmit={handleForgotPassword} className="userlogin-form">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="userlogin-input"
                disabled={forgotLoading}
              />

              <div className="forgot-password-buttons">
                <button 
                  type="submit" 
                  className="userlogin-btn"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="back-to-login-btn"
                  disabled={forgotLoading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;