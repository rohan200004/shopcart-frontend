import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js"; // Axios instance
import "../styles/Auth.css"; // Custom styling for Auth
import "../App.css"; // App-wide CSS
import logo from '../assets/images/logo.jpg';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState(""); // Changed from phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await api.post("/auth/loginwithpassword", {
        username, // Changed from phone
        password,
      });

      if (response.data && response.data.data.token) {
        // Store token and user info in localStorage
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        onLogin(); // Call parent onLogin method (or handle login status here)
        navigate("/"); // Redirect to home or dashboard after successful login
      }
    } catch (error) {
      // Handle error responses (e.g., invalid credentials)
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo-container">
          <img src={logo} width="200" height="100" alt="ShopCart Logo" className="auth-logo" />
        </div>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register Here</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
