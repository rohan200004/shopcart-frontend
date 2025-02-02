import React from 'react';

const CheckoutPage = ({ cart }) => {
  const totalPrice = cart.reduce((total, cart_item) => total + cart_item.product.price * cart_item.quantity, 0);
  const placeOrder = () => {
    alert('Order placed successfully!');
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
