import React, { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import './CartItems.css'

const CartItems = () => {
  const { food_list, cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  // Calculate total items in cart
  const totalItems = Object.values(cartItems).reduce((acc, item) => acc + item, 0);

  return (
    <div className='CartItem-Container'>
      <h2>
        Shopping Cart <span>{totalItems} Items</span>
      </h2>

      <div className='Cart-heading'>
        <p className='Pro-detail'>PRODUCT DETAILS</p>
        <p>QUANTITY</p>
        <p>PRICE</p>
        <p>TOTAL</p>
      </div>

      {food_list.map((item, index) => {
        if (cartItems[item._id] > 0) {
          return (
            <div key={index} className='cart-items'>
              <div className='Cart-item_details'>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  {/* <span>PS4</span> */}
                  <span onClick={() => removeFromCart(item._id)}>Remove</span>
                </div>
              </div>

              <div className='QuantityControl'>
                <button onClick={() => removeFromCart(item._id)}>-</button>
                <p>{cartItems[item._id]}</p>
                <button onClick={() => addToCart(item._id)}>+</button>
              </div>

              <p>£{item.price.toFixed(2)}</p>
              <p>£{(item.price * cartItems[item._id]).toFixed(2)}</p>
            </div>
          );
        }
        return null;
      })}

      <a href="/" className="ContinueShopping">← Continue Shopping</a>
    </div>
  );
};

export default CartItems;