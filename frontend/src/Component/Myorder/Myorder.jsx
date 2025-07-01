import React from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import './Myorder.css'
import { useNavigate } from 'react-router-dom';

const Myorder = () => {
    const { myorder, food_list } = useContext(StoreContext);
    const navigate = useNavigate();
    
    // Convert myorder object to array and filter out invalid entries
    const orders = Object.entries(myorder)
        .map(([itemId, order]) => {
            const foodItem = food_list.find(item => item._id === itemId);
            if (!foodItem) return null;
            
            return {
                ...order,
                itemId,
                name: order.name || foodItem.name,
                price: order.price || foodItem.price,
                image: order.image || foodItem.image,
                quantity: order.quantity || 1,
                orderId: order.orderId || 'ORD' + Math.floor(1000 + Math.random() * 9000),
                date: order.date || new Date().toLocaleDateString(),
                status: order.status || (Math.random() > 0.5 ? 'Delivered' : 'Processing')
            };
        })
        .filter(Boolean);

    const totalSpent = orders.reduce((sum, order) => {
        return sum + (order.price * order.quantity);
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
                {orders.map((order, index) => (
                    <div key={index} className='order-item'>
                        <div className="orderItem-Img" onClick={() => navigate(`/product/${order.itemId}`)}>
                            <img src={order.image} alt={order.name} />
                        </div>
                        <p className="order-name" onClick={() => navigate(`/product/${order.itemId}`)}>
                            {order.name}
                        </p>
                        <p className="order-id">{order.orderId}</p>
                        <p className="order-date">{order.date}</p>
                        <p className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                        </p>
                        <p className="order-quantity">{order.quantity}</p>
                        <p className="order-price">₹{order.price}</p>
                        <p className="order-total">
                            ₹{(order.price * order.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Myorder;