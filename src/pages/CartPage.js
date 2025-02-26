import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ cart = [], onUpdateCartQuantity }) => {
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cart.reduce((total, cartItem) => {
    if (cartItem && cartItem.product && cartItem.product.price && cartItem.quantity) {
      return total + (cartItem.product.price * cartItem.quantity);
    }
    return total;
  }, 0);

  const handleProceedToPayment = () => {
    // Create order details object
    const orderDetails = {
      total: totalPrice,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    // Navigate to payment page with order details
    navigate('/payment', { 
      state: { orderDetails } 
    });
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((cartItem, index) => (
          cartItem && cartItem.product ? (
            <div key={index} className="cart-item">
              <img 
                src={cartItem.product.image} 
                alt={cartItem.product.name} 
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{cartItem.product.name}</h3>
                <p>₹{cartItem.product.price}</p>
                <div className="quantity-controls">
                  <button className='quantity-button'
                    onClick={() => onUpdateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                    disabled={cartItem.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button className='quantity-button'
                    onClick={() => onUpdateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                className="remove-button"
                onClick={() => onUpdateCartQuantity(cartItem.id, 0)}
              >
                Remove
              </button>
            </div>
          ) : null
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
        <button 
          className="checkout-button"
          onClick={handleProceedToPayment}
          disabled={cart.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CartPage;
