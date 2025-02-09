import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './PaymentPage.css';

const PaymentPage = ({ clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  if (!orderDetails) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = {
        ...orderDetails,
        pay_method: paymentMethod
      };

      const response = await api.post("/order", order);

      if (response.data.message === "Created") {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await clearCart();
        alert('Order placed successfully!');
        navigate('/order');
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Payment Details</h2>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Total Amount: ₹{orderDetails.total}</p>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="radio-custom"></span>
              <i className="fas fa-credit-card"></i>
              Credit/Debit Card
            </label>

            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="radio-custom"></span>
              <i className="fas fa-mobile-alt"></i>
              UPI
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="radio-custom"></span>
              <i className="fas fa-money-bill-wave"></i>
              Cash on Delivery
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="card-details">
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxLength="16" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" maxLength="5" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="password" placeholder="***" maxLength="3" />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="upi-details">
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" placeholder="username@upi" />
            </div>
          </div>
        )}

        <button 
          className={`pay-button ${loading ? 'loading' : ''}`}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ₹${orderDetails.total}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 