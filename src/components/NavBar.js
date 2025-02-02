import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="nav">
      <span>ShopCart</span>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/order">Orders</Link></li>
        {isLoggedIn && (
          <li>
            <button onClick={onLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
