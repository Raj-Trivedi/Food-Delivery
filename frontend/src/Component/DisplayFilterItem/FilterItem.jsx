import React from 'react'
import './FilterItem.css'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { useState } from 'react';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { menu_list } from "../../../../assets/frontend_assets/assets";


const FilterItem = ({category,minPrice,maxPrice,sortBy,dietary}) => {
    // const [liked, setLiked] = useState(false);

    const navigate= useNavigate();


 
    const { food_list ,addToCart,liked,toggleLike,searchItem } = useContext(StoreContext);
    // const order =food_list
    const SortItem = (food_list, sortBy) => {
     
    if (sortBy === 'default') return food_list;
    if (sortBy === 'LH'){
        return food_list.slice().sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'HL'){
        return food_list.slice().sort((a, b) => b.price - a.price);
    }
   
    return food_list; 
  };
    const Updatedlist =SortItem(food_list, sortBy);

    const menuNames = menu_list.map(item => item.menu_name);
    const filteredFoodList = Updatedlist.filter(item => {
        const isSearchMatch = searchItem ? item.name.toLowerCase().includes(searchItem.toLowerCase()) : true;
        if (!isSearchMatch) return false;

        // If 'Others' is selected, show items whose category is not in menuNames
        if (category['Others']) {
          return !menuNames.includes(item.category);
        }
        const isCategoryMatch = Object.keys(category).length === 0 ? true : !!category[item.category];
        const isPriceMatch = item.price >= minPrice && item.price <= maxPrice;

        const isDietaryMatch =
    Object.keys(dietary).length === 0 || dietary[item.Dietary];
  return isCategoryMatch && isPriceMatch && isDietaryMatch;

    });

    console.log("Filtered Food List:", filteredFoodList);
    console.log('category prop:', category);
    console.log('food_list:', food_list);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('/upload')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="FilterItem-container">
        <div className="FilterItem-header">
            
        </div>
        <div>
            <div className="FilterItem-items">
                {filteredFoodList.map((item,index) => (
                    <div key={index} className="FilterItem-item" >

                        <div className="filterItem-IMG">
                            <div className="Item-overlay">
                                <FontAwesomeIcon
                                className="btncart1"
                                onClick={() => {
                                  addToCart(item._id);
                                  
                                }}
                                icon={faCartShopping}
                                />
                                {/* <FontAwesomeIcon
                                className="btncart1"
                                onClick={toggleLike(item._id)}
                                icon={liked[item._id]===1 ? faSolidHeart : faRegularHeart}
                                /> */}
                            </div>
                             <img src={getImageUrl(item.image)} alt={item.name} />
                         </div>
                        <div className="filterItem-des" onClick={()=> navigate(`/product/${item.category}/${item._id}`)}>
                            <h3>{item.name}</h3>
                            <p>Price:  <span>₹{item.price.toFixed(2)}</span>  </p>
                           
                          
                            
                        </div>
                       
                      
                    </div>
                ))}
            </div>

        </div>


    </div>
  )
}

export default FilterItem;


