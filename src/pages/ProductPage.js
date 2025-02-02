import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();

  // Sample product data (this can come from a database or API)
  const product = {
    id,
    name: `Product ${id}`,
    description: `This is the description for product ${id}.`,
    price: 100 + Number(id) * 10,
    image: 'https://via.placeholder.com/150',
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="container">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;
