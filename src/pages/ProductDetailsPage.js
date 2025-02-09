import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './ProductDetailsPage.css';

const ProductDetailsPage = ({ cart, handleAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check if product is in cart using filter
    if (product && cart && cart.length > 0) {
      const cartItem = cart.find(item => item.product && item.product.id === product.id);
      setIsInCart(cartItem !== undefined);
    }
  }, [cart, product]);

  const handleAddToCartClick = async () => {
    await handleAddToCart(product);
    setIsInCart(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-left">
        <img src={product.image} alt={product.name} className="product-details-image" />
      </div>
      
      <div className="product-details-right">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-category">Category: {product.producttype.name}</div>
        <div className="product-price">₹{product.price}</div>
        
        <div className="product-actions">
          {isInCart ? (
            <button 
              className="go-to-cart-button"
              onClick={() => navigate('/cart')}
            >
              Go to Cart
            </button>
          ) : (
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCartClick}
            >
              Add to Cart
            </button>
          )}
          <button 
            className="buy-now-button"
            onClick={async () => {
              if (!isInCart) {
                await handleAddToCart(product);
              }
              navigate('/checkout');
            }}
          >
            Buy Now
          </button>
        </div>

        <div className="product-description-section">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        <div className="product-highlights">
          <h2>Highlights</h2>
          <ul>
            <li>Brand: {product.brand || 'Generic'}</li>
            <li>Category: {product.producttype.name}</li>
            <li>In Stock</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage; 