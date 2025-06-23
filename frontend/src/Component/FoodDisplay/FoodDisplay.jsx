import React, { useContext, useEffect } from 'react'
import "./FoodDisplay.css"
import { StoreContext } from '../../Context/StoreContext'
import FoodItems from '../FoodItems/FoodItems'

const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext)

    const selectedIndices = [1, 6, 12, 18, 22, 27, 33, 38, 41, 49];
    const selectedItems = selectedIndices.map(index => food_list[index])

    const filteredItems = food_list.filter(item => item.category === category);

    const itemsToRender = category === "All" ? selectedItems : filteredItems;

    console.log("Items to render:", itemsToRender);
    // console.log("Full food_list:", food_list);
    console.log("Current category:", category);


    return (
    <div className='food-display' id='food-display'>
        <h2>Top Dishes near you</h2>
        <div className="food-display-list">
            {itemsToRender.map((item, index) => {   
                return <FoodItems key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
        })}
        </div>
    </div>
  );
};

export default FoodDisplay