import React, { useContext} from 'react'
import "./FoodItem.css"
import { assets } from '../../../../assets/frontend_assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItems = ({id, name, price, description, image}) => {

  const {cartItems, addToCart, removeFromCart} = useContext(StoreContext);


  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={image} alt='Food Item Image' />
            {!cartItems[id] }
            {
              !cartItems[id]
              ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='Icon'/> 
              : <div className="food-item-counter">
                    <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Icon" />
                    <p>{cartItems[id]}</p>
                    <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt='Icon' />
                </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="Rating" />
            </div>
        </div>
        <p className="food-item-description">{description}</p>
        <div className="food-item-price">${price}</div>
    </div>
  )
}

export default FoodItems