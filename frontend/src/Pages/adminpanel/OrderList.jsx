import React, { useEffect, useState } from 'react';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/order/');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="order-list">
      <h2>Orders List</h2>
      {loading ? <p>Loading...</p> : (
        <div className="order-cards">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-product">
                {order.items[0]?.foodId ? (
                  <img
                    src={order.items[0].image && !order.items[0].image.startsWith('http') ? `http://localhost:5000/upload/${order.items[0].image}` : order.items[0].image}
                    alt={order.items[0].name}
                    className="order-card-img"
                  />
                ) : (
                  <div className="order-card-img" style={{background:'#e0f2e9',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span role="img" aria-label="food">🥕</span> 
                  </div>
                )}
                <span className="order-card-product-name">
                  {order.items[0]?.name} <span className="order-card-qty">x {order.items[0]?.quantity}</span>
                </span>
              </div>
              <div className="order-card-info">
                
                <div>{order.user}</div>

                {/* Add address if available: <div>{order.address}</div>
                 */}
              </div>
              <div className="order-card-price">
                ${order.total}
              </div>
              <div className="order-card-meta">
                <span>Method: COD</span>
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Payment: {order.status || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList; 