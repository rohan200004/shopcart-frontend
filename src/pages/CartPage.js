import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cart, onUpdateCartQuantity }) => {
  const navigate = useNavigate(); // Initialize navigation

  const totalPrice = cart.reduce((total, cart_item) => total + cart_item.product.price * cart_item.quantity, 0);

  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    onUpdateCartQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout'); // Redirect to the checkout page
    } else {
      alert('Your cart is empty! Add products to checkout.');
    }
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((cart_item, index) => (
            <div key={index} className="cart-item">
              <h3>{cart_item.product.name}</h3>
              <p>Price: ₹{cart_item.product.price}</p>
              <p>
                Quantity:
                <input
                  type="number"
                  min="0"
                  value={cart_item.quantity}
                  onChange={(event) => handleQuantityChange(cart_item.id, event)}
                  style={{ marginLeft: '10px', width: '50px' }}
                />
              </p>
            </div>
          ))}
          <h3>Total: ${totalPrice}</h3>
          <button onClick={handleCheckout}>Checkout</button> {/* Checkout button */}
        </div>
      )}
    </div>
  );
};

export default CartPage;
