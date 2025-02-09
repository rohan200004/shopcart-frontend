import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ cart = [], clearCart }) => {
  const navigate = useNavigate();

  // Add null check for cart items
  const totalPrice = cart.reduce((total, cartItem) => {
    if (cartItem && cartItem.product && cartItem.product.price && cartItem.quantity) {
      return total + (cartItem.product.price * cartItem.quantity);
    }
    return total;
  }, 0);

  const handlePlaceOrder = () => {
    try {
      if (!cart || cart.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderDetails = {
        order_items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        total: totalPrice,
        delivery_address: "1234567890",
        delivery_date: "2025-02-05",
      };

      // Navigate to payment page with order details
      navigate('/payment', { 
        state: { 
          orderDetails 
        }
      });
    } catch (error) {
      console.error("Failed to process order:", error);
      alert('Error processing order!');
    }
  };
    
  if (!cart || cart.length === 0) {
    return (
      <div className="container">
        <h2>Checkout</h2>
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div>
        <h3>Order Summary</h3>
        {cart.map((cartItem, index) => (
          cartItem && cartItem.product ? (
            <div key={index} className="checkout-item">
              <h4>{cartItem.product.name}</h4>
              <p>Quantity: {cartItem.quantity}</p>
              <p>Price: ₹{cartItem.product.price}</p>
            </div>
          ) : null
        ))}
        <h3>Total Price: ₹{totalPrice}</h3>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default CheckoutPage;
