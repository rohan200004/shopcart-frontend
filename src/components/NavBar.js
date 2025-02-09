import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          !buttonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLoginClick = () => {
    setShowDropdown(false);
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    onLogout();
  };

  return (
    <nav className="nav">
      <span className="brand-logo">ShopCart</span>
      <div className="nav-links">
        <button 
          className="nav-button" 
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button 
          className="nav-button" 
          onClick={() => navigate('/cart')}
        >
          Cart
        </button>
        <button 
          className="nav-button" 
          onClick={() => navigate('/order')}
        >
          Orders
        </button>
        {isLoggedIn && (
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
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
