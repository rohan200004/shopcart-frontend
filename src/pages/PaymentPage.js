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
  const [deliveryAddress, setDeliveryAddress] = useState('');


  if (!orderDetails) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = {
        ...orderDetails,
        pay_method: paymentMethod,
        delivery_address: deliveryAddress,

        delivery_date: new Date().toISOString(),
      };
      console.log(order);
      // Validate required fields
      order.order_items = order.items;
      const { total, order_items, pay_method, delivery_address, delivery_date } = order;
      if (!total) {
        alert("Total is required");
      } else if (!order_items) {
        alert("Order items are required");
      } else if (!pay_method) {
        alert("Payment method is required");
      } else if (!delivery_address) {
        alert("Delivery address is required");
      } else if (!delivery_date) {
        alert("Delivery date is required");
      } else {
        const response = await api.post("/order", order);
        if (response.status === 201) {
          const order_id = response.data.id;
          const options = {
            key: 'rzp_test_zHqDbIZs1T1BdQ',  // Replace with your Razorpay public key
            amount: total,          // Amount in paise
            currency: 'INR',
            name: 'Your Company Name',
            description: 'Test Payment',
            order_id,  // Order ID from the backend
            handler: function (response) {
              alert('Payment Successful');
              console.log(response);
            },
            prefill: {
              name: 'John Doe',
              email: 'john.doe@example.com',
              contact: '9876543210',
            },
            notes: {
              address: 'Razorpay Corporate Office',
            },
            theme: {
              color: '#F37254',
            },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
          if (response.data.message === "Created") {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await clearCart();
            alert('Order placed successfully!');
            navigate('/order');
          } else {
            throw new Error('Order creation failed');
          }
        }
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

        <div className="form-group">
          <label>Delivery Address</label>
          <input 
            type="text" 
            placeholder="Enter your delivery address" 
            value={deliveryAddress} 
            onChange={(e) => setDeliveryAddress(e.target.value)} 
          />
        </div>
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
