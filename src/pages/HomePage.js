import React, { useState, useEffect } from "react";
import "./ProductPage.css"; // CSS for enhanced styling
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProductPage = ({ cart, handleAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All Categories");
  
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

  // Define product types after products are loaded
  const productTypes = [
    "All Categories",
    ...new Set(products.map(product => product.producttype.name))
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  // Group products by their type_id
  const groupProductsByType = () => {
    const filteredProducts = selectedType === "All Categories" 
      ? products 
      : products.filter(product => product.producttype.name === selectedType);

    return filteredProducts.reduce((acc, product) => {
      const typeId = product.producttype.name;
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupProductsByType();

  const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const banners = [
      {
        id: 1,
        image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/4cd6690ef44564f3.jpg",
        link: "/samsung"
      },
      {
        id: 2,
        image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/5f478a106d047aba.jpg",
        link: "/redmi"
      },
      {
        id: 3,
        image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/352e6f0f8034fab5.jpg",
        link: "/iphone"
      },
      {
        id: 4,
        image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/0f3d008be60995d4.jpg",
        link: "/oneplus"
      }
    ];

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    useEffect(() => {
      const timer = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="carousel-container">
        <div className="carousel-slide">
          <img 
            src={banners[currentSlide].image} 
            alt={`Banner ${currentSlide + 1}`} 
            className="carousel-image"
          />
          <button className="carousel-arrow prev" onClick={prevSlide}>←</button>
          <button className="carousel-arrow next" onClick={nextSlide}>→</button>
        </div>
      </div>
    );
  };

  const SearchBar = ({ products }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (event) => {
      const term = event.target.value;
      setSearchTerm(term);

      if (term.trim() === '') {
        setSearchResults([]);
        return;
      }

      const results = products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results.slice(0, 5)); // Show only top 5 results
    };

    return (
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div 
                key={product.id} 
                className="search-result-item"
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  navigate(`/product/${product.id}`);  // Navigate to product details
                }}
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-page-container">
      <SearchBar products={products} />
      <div className="product-types-container">
        {productTypes.map((type) => (
          <button
            key={type}
            className={`product-type-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {/* <Carousel /> */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Render each type's products in a separate horizontal slider */}
      {Object.keys(groupedProducts).map((typeId) => (
        <div key={typeId} className="product-section">
          <div className="category-header">
            <h2 data-category={typeId}>
              {typeId.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join(' ')}
            </h2>
          </div>
          <div className="product-row">
            {groupedProducts[typeId].map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
