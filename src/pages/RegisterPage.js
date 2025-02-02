import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js"; // Axios instance
import "./Auth.css"; // Custom styling
import "../App.css"; // App-wide CSS

const RegisterPage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // API call to register the user
      const response = await api.post("/auth/register", {
        phone,
        password,
        name,
        email,
        role_id: 1, // Assuming a role_id of 1 for standard users
      });

      if (response.data && response.data.data.token) {
        const { token, user } = response.data.data;

        // Store token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/"); // Redirect to home or login after successful registration
      }
    } catch (error) {
      // Handle any errors during registration
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          <button type="submit">Register</button>
        </form>
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
