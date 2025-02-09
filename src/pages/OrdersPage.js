import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/OrdersList.css";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/user/orders");
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "PENDING": "status-pending",
      "PROCESSING": "status-processing",
      "COMPLETED": "status-completed",
      "CANCELLED": "status-cancelled"
    };
    return `order-status ${statusMap[status] || "status-pending"}`;
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <h2>Loading your orders...</h2>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="no-orders">
          <h3>No Orders Yet</h3>
          <p>Looks like you haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
      </div>

      <div className="orders-list">
        {orders.map((order, index) => (
          order.order_items.length !== 0 && (
            <div key={index} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{index + 1}</span>
                <span className="order-date">{formatDate(order.orderDate)}</span>
              </div>

              <div className="order-details">
                <div className="order-info-item">
                  <span className="info-label">Status</span>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="info-label">Shipping Address</span>
                  <span className="info-value">{order.shippingAddress}</span>
                </div>
                <div className="order-info-item">
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{order.paymentMethod}</span>
                </div>
              </div>

              <div className="order-items">
                {order.order_items.map((order_item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
                    <img
                      src={order_item.product.image}
                      alt={order_item.product.name}
                      className="item-image"
                    />
                    <div className="item-name">{order_item.product.name}</div>
                    <div className="item-quantity">Qty: {order_item.quantity}</div>
                    <div className="item-price">
                      ₹{(order_item.product.price * order_item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
