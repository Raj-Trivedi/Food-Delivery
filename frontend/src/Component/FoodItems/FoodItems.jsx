// import React, { useContext} from 'react'
import "./FoodItem.css"
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import add_icon_green from '../../../../assets/frontend_assets/add_icon_green.png';
import remove_icon_red from '../../../../assets/frontend_assets/remove_icon_red.png';
import { assets } from '../../../../assets/frontend_assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const FoodItems = ({id, name, price, description, image}) => {

  const [rating, setRating] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const {cartItems, addToCart, removeFromCart} = useContext(StoreContext);
  const navigate = useNavigate();

  // Find the cart item for this food
  const cartItem = Array.isArray(cartItems) ? cartItems.find(item => item.food && item.food._id === id) : null;
  const quantity = cartItem ? cartItem.quantity : (showControls ? 1 : 0);

  const handleStarClick = (value) => {
    setRating(value);
  };
  
  return (
    <div className="food-item" onClick={() => navigate(`/product/${name}/${id}`)}>
      <div className="Food-img">
        <img className="img" src={image && !image.startsWith('http') ? `http://localhost:5000/upload/${image}` : image} alt={name} />

        <div className="CountDiv" onClick={(e) => e.stopPropagation()}>
          {!(cartItem || showControls) ? (
            <p></p>
          ) : (
            <div className="btnCountContainer">
              <img
                className="btnCount"
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartItem) {
                    removeFromCart(cartItem._id, cartItem.quantity);
                    if (cartItem.quantity === 1) setShowControls(false);
                  }
                }}
                src={remove_icon_red}
                alt="Remove"
              />
              <p>{quantity}</p>
              <img
                className="btnCount"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(id);
                }}
                src={add_icon_green}
                alt="Add more"
              />
            </div>
          )}
        </div>
      </div>

      <div className="Description">
        <div className="name-rating">
          <span className="name">{name}</span>
          <span className="rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={value <= rating ? 'star filled' : 'star'}
                onClick={() => handleStarClick(value)}
              >
                ★
              </span>
            ))}
          </span>
        </div>
        <p>{description}</p>
        <div className="price-area">
          <span className="price">₹{price.toFixed(2)}</span>
          <FontAwesomeIcon 
            className='btncart' 
            onClick={(e) => {
              e.stopPropagation();
              const wasInCart = !!cartItem;
              addToCart(id);
              setShowControls(true);
              if (!wasInCart) {
                toast.success('Added to cart!', {
                  position: 'top-center',
                  autoClose: 1500,
                  toastId: `add-to-cart-${id}`
                });
              }
            }} 
            icon={faCartShopping}
          />
        </div>
      </div>
    </div>
  );
}

export default FoodItems