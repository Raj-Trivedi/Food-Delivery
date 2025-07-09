import React from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import './Myorder.css'
import { useNavigate } from 'react-router-dom';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('/upload')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

const Myorder = () => {
    const { myorder } = useContext(StoreContext);
    const navigate = useNavigate();
    const orders = Array.isArray(myorder) ? myorder : [];

    const totalSpent = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

    if (orders.length === 0) {
        return (
            <div className="order-container empty-order">
                <h3>My Orders</h3>
                <div className="no-orders">
                    <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="No orders" style={{width: 80, marginBottom: 16}} />
                    <div>No orders yet. Start shopping!</div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-container">
            <h3>My Orders</h3>
            <div className="order-summary-row">
                <span>Total Orders: <b>{orders.length}</b></span>
                <span>Total Spent: <b>₹{totalSpent.toFixed(2)}</b></span>
            </div>
            <div className="order-header">
                <p>Product</p>
                <p>Order Name</p>
                <p>Order ID</p>
                <p>Date</p>
                <p>Status</p>
                <p>Quantity</p>
                <p>Price</p>
                <p>Total</p>
            </div>
            <hr />
            <div className="Order-List">
                {orders.map((order, orderIdx) =>
                  order.items.map((item, idx) => (
                    <div className='order-item' key={item._id || idx}>
                      <div className="order-top-row">
                        <div className="orderItem-Img" onClick={() => navigate(`/product/${item.name}/${item.foodId || item._id}`)}>
                          <img src={getImageUrl(item.image)} alt={item.name} />
                        </div>
                        <p className="order-name" onClick={() => navigate(`/product/${item.name}/${item.foodId || item._id}`)}>
                          {item.name}
                        </p>
                      </div>
                      <p className="order-id">{order._id}</p>
                      <p className="order-date">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                      <p className={`order-status ${order.status ? order.status.toLowerCase() : ''}`}>{order.status || 'Processing'}</p>
                      <p className="order-quantity">{item.quantity}</p>
                      <p className="order-price">₹{item.price}</p>
                      <p className="order-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                )}
            </div>
        </div>
    );
}

export default Myorder;