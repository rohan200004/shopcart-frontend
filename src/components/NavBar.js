import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Get auth status from localStorage
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    window.location.reload(); // Force refresh to update navbar state
  };

  return (
    <nav className="nav">
      <span className="brand-logo" onClick={() => navigate('/')}>ShopCart</span>
      <div className="nav-links">
        {isLoggedIn ? (
          // Show these links only when logged in
          <>
            <button className="nav-button" onClick={() => navigate('/')}>
              Home
            </button>
            <button className="nav-button" onClick={() => navigate('/cart')}>
              Cart
            </button>
            <button className="nav-button" onClick={() => navigate('/order')}>
              Orders
            </button>
            <div className="profile-menu">
              <button
                ref={buttonRef}
                className="profile-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Menu
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className="profile-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                  >
                    <i className="fas fa-user-circle"></i>
                    Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Show these links when not logged in
          <>
            <button className="nav-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-button" onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
