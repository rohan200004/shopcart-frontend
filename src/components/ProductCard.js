const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3 className="product-name">{product.name}</h3>
      {/* ... other product details ... */}
    </div>
  );
}; 