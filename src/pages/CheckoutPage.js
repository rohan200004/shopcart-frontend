import React from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ cart }) => {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((total, cart_item) => total + cart_item.product.price * cart_item.quantity, 0);
  const placeOrder = async () => {
    const order = {
      order_items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      total: totalPrice,
      pay_method: "COD",
      delivery_address: "1234567890",
      delivery_date: "2025-02-05",
    }
    const res = await api.post("/order", order);
    if(res.data.message === "Created") {
      alert('Order placed successfully!');
      navigate('/order');
    } else {
      alert('Error placing order!');
    }
  }
    
  return (
    <div className="container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div>
          <h3>Order Summary</h3>
          {cart.map((cart_item, index) => (
            <div key={index} className="checkout-item">
              <h4>{cart_item.product.name}</h4>
              <p>Quantity: {cart_item.quantity}</p>
              <p>Price: ₹{cart_item.product.price}</p>
            </div>
          ))}
          <h3>Total Price: ₹{totalPrice}</h3>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
