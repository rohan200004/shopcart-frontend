import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailsPage from './pages/ProductDetailsPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import api from "./utils/api";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(""); // Notification state

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await api.get("/user/cart");
        if (response && response.data && response.data.data && response.data.data[0]) {
          setCart(response.data.data[0].cart_item || []);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart([]);
      }
    };

    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn) {
      setIsLoggedIn(true);
      getCart();
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  // Add to cart function with alert for duplicates
  const handleAddToCart = async (product) => {
    const productExists = cart.find((item) => item.id === product.id);

    if (productExists) {
      setNotification(
        `"${product.name}" is already in your cart! You can change the quantity in the cart.`
      );
      setTimeout(() => setNotification(""), 3000);
    } else {
      const res = await api.post("/user/cart", {product_id: product.id, quantity: 1});
      if(res.data.message === "Success") {
        const response = await api.get("/user/cart");
        if (response && response.data && response.data.data && response.data.data[0]) {
          setCart(response.data.data[0].cart_item || []);
        }
        setNotification(`${product.name} has been added to your cart!`);
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("Error adding to cart!");
        setTimeout(() => setNotification(""), 3000);
      }
    }
  };

  // Update cart quantity
  const handleUpdateCart = async (productId, newQuantity) => {
    try {
    let tempcart = cart;
    if (newQuantity === 0) {
      tempcart = tempcart.filter((item) => item.id !== productId);
    } else {
      tempcart = tempcart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    const res = await api.put("/user/cart", {cartitems: tempcart});
    console.log(`this is res:`);
    console.log(res);
    if(res.data.message === "Success") {
      setNotification("Cart updated successfully!");
      setTimeout(() => setNotification(""), 3000);
      setCart(tempcart);
    } else {
      setNotification("Error updating cart!");
      setTimeout(() => setNotification(""), 3000);
    }
  } catch (error) {
    setNotification("Error updating cart!");
    console.log(error);
    setTimeout(() => setNotification(""), 3000);
  }
  };

  const handleUpdateCartQuantity = async (cartitemId, newQuantity) => {
    try {
    let tempcart = cart;
    let res;
    if (newQuantity === 0) {
      res = await api.delete("/user/cartitem/"+cartitemId);
      console.log(`this is res:`);
      console.log(res);
      if(res.data.message === "Success") {
        tempcart = tempcart.filter((item) => item.id !== cartitemId);
        setCart(tempcart);
        setNotification("Cart item deleted successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("Error deleting cart item!");
        setTimeout(() => setNotification(""), 3000);
      }
    } else {
      tempcart = tempcart.map((item) =>
        item.id === cartitemId ? { ...item, quantity: newQuantity } : item
      );
      res = await api.put("/user/cartitem/"+cartitemId,{quantity:newQuantity});
    }
    console.log(`this is res:`);
    console.log(res);
    if(res.data.message === "Success") {
      setNotification("Cart updated successfully!");
      setTimeout(() => setNotification(""), 3000);
      setCart(tempcart);
    } else {
      setNotification("Error updating cart!");
      setTimeout(() => setNotification(""), 3000);
    }
  } catch (error) {
    setNotification("Error updating cart!");
    console.log(error);
    setTimeout(() => setNotification(""), 3000);
  }
  };

  const clearCart = async () => {
    try {
      setCart([]);  // Clear cart in frontend state
      const res = await api.delete("/user/cart");
      console.log(`this is res:`);
      console.log(res);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {notification && <div className="notification">{notification}</div>}{" "}
      {/* Notification message */}
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage cart={cart} handleAddToCart={handleAddToCart} /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <CartPage
                cart={cart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/product/:id"
          element={
            isLoggedIn ? (
              <ProductDetailsPage cart={cart} handleAddToCart={handleAddToCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/order"
          element={
            isLoggedIn ? (
              <OrdersPage/>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payment"
          element={
            isLoggedIn ? (
              <PaymentPage clearCart={clearCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
