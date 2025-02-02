import React, { useEffect, useState } from "react";
import api from "../utils/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]); // Orders state
  useEffect(() => {
    const getOrders = async () => {
      const data = await api.get("/user/orders");
      setOrders(data.data.data);
      console.log(data.data.data);
    };
    getOrders();
  }, []);
  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            (order.order_items.length !== 0)  && 
            <div key={index} className="order">
              {order.order_items.map((order_item, y) => (
                <div key={y} className="order-item">
                  <img src={order_item.product.image} alt={order_item.product.name} />
                  <h3>{order_item.product.name}</h3>
                  <p>Price: ₹{order_item.product.price}</p>
                  <p>
                    Quantity:
                    <span>{order_item.quantity}</span>
                  </p>
                </div>
              ))}
              <h3>Total: ₹{order.total}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
