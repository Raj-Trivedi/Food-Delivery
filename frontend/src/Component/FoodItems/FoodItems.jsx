// import React, { useContext} from 'react'
import "./FoodItem.css"
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import add_icon_green from '../../../../assets/frontend_assets/add_icon_green.png';
import remove_icon_red from '../../../../assets/frontend_assets/remove_icon_red.png';
import { assets } from '../../../../assets/frontend_assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItems = ({id, name, price, description, image}) => {

  const [rating, setRating] = useState(0);
  const {cartItems, addToCart, removeFromCart} = useContext(StoreContext);

  const handleStarClick = (value) => {
    setRating(value);
  };
  
  return (
    <div className="food-item">
      <div className="Food-img">
        <img className="img" src={image} alt={name} />

        <div className="CountDiv">
          {!cartItems[id] ? (
            <p></p>

          ) : (
            <div className="btnCountContainer">
              <img
                className="btnCount"
                onClick={() => removeFromCart(id)}
                src={remove_icon_red}
                alt="Remove"
              />
              <p>{cartItems[id]}</p>
              <img
                className="btnCount"
                onClick={() => addToCart(id)}
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
          <span className="price">${price.toFixed(2)}</span>
          <FontAwesomeIcon 
            className='btncart' 
            onClick={() => addToCart(id)} 
            icon={faCartShopping}
          />
        </div>
      </div>
    </div>
  );
}

export default FoodItems