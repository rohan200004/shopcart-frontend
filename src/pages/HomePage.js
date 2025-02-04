import React, { useState, useEffect } from "react";
import "./ProductPage.css"; // CSS for enhanced styling
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProductPage = ( {cart, handleAddToCart} ) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(""); // Handle errors
  const navigate = useNavigate();

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product");
        setProducts(response.data.data);
        console.log(products) // Assuming 'data' is the array of products
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by their type_id
  const groupProductsByType = () => {
    const grouped = products.reduce((acc, product) => {
      const typeId = product.producttype.name;
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(product);
      return acc;
    }, {});
    return grouped;
  };

  const groupedProducts = groupProductsByType();

  return (
    <div className="product-page-container">
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Render each type's products in a separate horizontal slider */}
      {Object.keys(groupedProducts).map((typeId) => (
        <div key={typeId} className="product-section">
          <div className="category-header">
            <h2>{ typeId }</h2>
            {/* <button>View All</button> */}
          </div>
          <div className="product-row">
            {groupedProducts[typeId].map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="price">Price: ₹{product.price}</p>
                {cart.some(item => item.product.id === product.id) ? (
                  <button  className="go-to-cart-btn" onClick={() => navigate('/cart')}>Go to Cart</button>
                ) : (
                  <button  className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
