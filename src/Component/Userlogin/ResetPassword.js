// src/components/ResetPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landNestLogo from "../Assets/Final-logo-SBS.png";
import "./Login.css"; // Reuse the same CSS
import { baseUrl } from "../../Apiurls";

const ResetPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage (auto-reflected from forgot password)
    const savedEmail = localStorage.getItem('resetEmail');
    if (!savedEmail) {
      navigate("/");
    } else {
      setEmail(savedEmail);
    }

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setMessage("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          otp: otpString
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid OTP");
      }

      setMessage(""); // Clear the message after successful verification
      setOtpVerified(true);
      
    } catch (err) {
      setMessage(err.message || "Failed to verify OTP");
      setOtpVerified(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setResendDisabled(true);
    setResendTimer(60);
    setOtpVerified(false);
    setOtp(["", "", "", "", "", ""]);

    try {
      const response = await fetch(`${baseUrl}/api/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setMessage("New OTP has been sent to your email");

      // Start timer again
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setMessage(err.message || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!otpVerified) {
      setMessage("Please verify OTP first");
      return;
    }
    
    const otpString = otp.join('');
    
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          otp: otpString, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      
      // Clear localStorage
      localStorage.removeItem('resetEmail');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setMessage(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="userlogin-wrapper">
      <div className="userlogin-container">
        <img src={landNestLogo} alt="Land Nest Logo" className="userlogin-logo" />

        <h2 className="userlogin-title">Reset Password</h2>
        
        <p className="reset-email-info">
          Enter OTP sent to: <strong>{email}</strong>
        </p>
        
        {/* Show message only when there's an error or during password reset */}
        {message && !otpVerified && (
          <p className={message.includes("successfully") ? "userlogin-success" : "userlogin-error"}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="userlogin-form">
          {/* OTP Input - Completely hidden after verification */}
          {!otpVerified ? (
            <>
              <div className="otp-container">
                <p className="otp-label">Enter 6-digit OTP</p>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input"
                      disabled={loading}
                    />
                  ))}
                </div>
                
                <div className="otp-actions">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="verify-otp-btn"
                    disabled={loading || otp.join('').length !== 6}
                  >
                    Verify OTP
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="resend-btn"
                    disabled={resendDisabled || loading}
                  >
                    {resendDisabled ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {/* Password fields - Only show after OTP verification */}
          {otpVerified && (
            <>
              {/* Success indicator (optional, minimal) */}
              {/* <div className="otp-verified-indicator">
                <span className="verified-badge">✓ OTP Verified</span>
              </div> */}

              {/* New Password */}
              <div className="userlogin-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="userlogin-input"
                  disabled={loading}
                  autoFocus
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

              {/* Confirm Password */}
              <div className="userlogin-password-field">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="userlogin-input"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="userlogin-btn"
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </>
          )}
          
          {/* Show back button during OTP entry and password reset */}
          <div className="back-to-login-container">
            <button 
              type="button"
              onClick={() => {
                localStorage.removeItem('resetEmail');
                navigate("/");
              }}
              className="back-to-login-btn"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;