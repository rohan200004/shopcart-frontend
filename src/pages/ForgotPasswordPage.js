import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import "./Auth.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/auth/resetpassword", {
        email,
        new_password: newPassword
      });

      setMessage("Password has been reset successfully. Redirecting to login...");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Wait for 2 seconds before redirecting to show the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength="6"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Remember your password? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 