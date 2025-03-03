import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="nav">
      <span className="brand-logo" onClick={() => navigate('/')}>ShopCart</span>
      <div className="nav-links">
        {isLoggedIn ? (
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
            <button
              className="nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
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
