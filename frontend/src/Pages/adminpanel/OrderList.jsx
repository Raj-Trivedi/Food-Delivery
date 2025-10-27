import React, { useEffect, useState } from 'react';
import './OrderList.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('/upload')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/order/seller-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          // Sort orders by creation date (newest first)
          const sortedOrders = data.orders.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        }
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`/api/order/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      // Refresh orders after update
      setLoading(true);
      const res = await fetch('/api/order/seller-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Sort orders by creation date (newest first)
        const sortedOrders = data.orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
      setLoading(false);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <div className="order-list">
      <h2>Orders List</h2>
      {loading ? <p>Loading...</p> : (
        <div className="order-cards">
          {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-info">
                <div><b>Buyer:</b> {order.buyer?.name || 'Unknown'}</div>
              
                <div><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="order-card-status">
                  <b>Status:</b>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    style={{
                      background: order.status === "Pending" ? "#fffbe6" : order.status === "Out for Delivery" ? "#e6f0ff" : "#e6ffe6",
                      color: order.status === "Pending" ? "#b59f00" : order.status === "Out for Delivery" ? "#2563eb" : "#27ae60"
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="order-card-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-card-product">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="order-card-img"
                    />
                    <span className="order-card-product-name">
                      {item.name}
                      <span className="order-card-qty">x {item.quantity}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-card-price">
                <b>Total:</b> ₹{order.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList; 