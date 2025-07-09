import React, { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import './CartItem.css'
import { toast } from 'react-toastify';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('/upload')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

const CartItem = ({totalItems}) => {
  const { food_list, cartItems, addToCart, removeFromCart, updateCartItemQuantity } = useContext(StoreContext);

  // Calculate total items in cart
  // const totalItems = Object.values(cartItems).reduce((acc, item) => acc + item, 0);

  return (
    <div className='CartItem-Container'>
      <h2>
        Shopping Cart <span>{cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)} Items</span>
      </h2>

      <div className='Cart-heading'>
        <p className='Pro-detail'>PRODUCT DETAILS</p>
        <p>QUANTITY</p>
        <p>PRICE</p>
        <p>TOTAL</p>
      </div>

      {cartItems.map((cartItem, index) => (
        <div key={cartItem._id || index} className='cart-items'>
          <div className='Cart-item_details'>
            {cartItem.food && cartItem.food.image ? (
              <img src={getImageUrl(cartItem.food.image)} alt={cartItem.food.name} />
            ) : (
              <div className="img-placeholder">No image</div>
            )}
            <div>
              {cartItem.food && cartItem.food.name && <p>{cartItem.food.name}</p>}
              <span onClick={() => removeFromCart(cartItem._id)}>Remove</span>
            </div>
          </div>
          <div className="cartitem-des">
            <div className='QuantityControl'>
              <button onClick={() => {
                if (cartItem.quantity > 1) {
                  updateCartItemQuantity(cartItem._id, cartItem.quantity - 1);
                } else {
                  removeFromCart(cartItem._id);
                }
              }}>-</button>
              <p>{cartItem.quantity}</p>
              <button onClick={() => addToCart(cartItem.food._id)}>+</button>
            </div>
            <p>
              {cartItem.food && typeof cartItem.food.price === 'number' && (
                <p>₹{cartItem.food.price.toFixed(2)}</p>
              )}
            </p>
            {cartItem.food && typeof cartItem.food.price === 'number' ? (
              <p>₹{(cartItem.food.price * cartItem.quantity).toFixed(2)}</p>
            ) : (
              <p>No price</p>
            )}
          </div>
        </div>
      ))}

      <a href="/menu" className="ContinueShopping">← Continue Shopping</a>
    </div>
  );
};

export default CartItem;
