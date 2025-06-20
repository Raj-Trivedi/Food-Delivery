import React, { useContext } from 'react'
import "./FoodDisplay.css"
import { StoreContext } from '../../Context/StoreContext'
import FoodItems from '../FoodItems/FoodItems'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

    return (
    <div className='food-display' id='food-display'>
        <h2>Top Dishes near you</h2>
        <div className="food-display-list">
            {food_list.map((item, index) => {
                // console.log("Selected:", category, "| Item:", item.category);
                if (category==="All" || category===item.category){
                    return <FoodItems key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                }
                return null;
        })}
        </div>
    </div>
  )
}

export default FoodDisplay