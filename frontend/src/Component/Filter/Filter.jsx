import React, { useState, useEffect } from 'react';
import './Filter.css';
import { menu_list } from "../../../../assets/frontend_assets/assets";

const Filter = ({ category, setCategory,minPrice,setMinPrice,maxPrice,setMaxPrice }) => {
  

 const filterByCategory = (item) => {
  setCategory((prev) => {
    const newCategory = { ...prev };
    if (newCategory[item.menu_name]) {
      
      delete newCategory[item.menu_name];
    } else {
      
      newCategory[item.menu_name] = true;
    }
    return newCategory;
  });
};


  useEffect(() => {
    console.log("Category changed:", category);
  }, [category]);

  useEffect(() => {
    console.log("Price range changed: Min =", minPrice, "Max =", maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = Math.round(e.target.value / 10) * 10;
    setMinPrice(value > maxPrice ? maxPrice : value); 
  };

  const handleMaxChange = (e) => {
    const value = Math.round(e.target.value / 10) * 10;
    setMaxPrice(value < minPrice ? minPrice : value); 
  };

  return (
    <div className="Filter-Container">
      <div className="Catergory_cont">
        <h3>Product Category</h3>
        {menu_list.map((item, index) => (
          <div className='categogy_list' key={index}>
            <input id="mychecked"
              type="checkbox"
              checked={!!category[item.menu_name]}
              onChange={() => filterByCategory(item)}
            />
            <div className='categogy_item'>{item.menu_name}</div>
          </div>
        ))}
      </div>
      <hr/>

      <div className="Range_cont">
        <h3>Price Range</h3>

        <div className="Range_item">
            <label>Min Price:</label>
            <span>₹{minPrice}</span>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={minPrice}
            onChange={handleMinChange}
          />
        
        </div>

        <div className="Range_item">
            <label>Max Price:</label>
            <span>₹{maxPrice}</span>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={handleMaxChange}
          />
         
        </div>

        <div className="Range_value">
          <p>Selected Range: ₹{minPrice} - ₹{maxPrice}</p>
        </div>
      </div>
      <hr/>

      <div className="Dietary_cont">
        <h3>Dietary</h3>
        <div className="Dietary-list">
           <div className="Dietary-item">
                <input id="mychecked"
                    type="checkbox"
                />
                <label >Vegetarian</label>
           </div>
           <div className="Dietary-item">
                <input id="mychecked"
                type="checkbox"
                />
                <label >Non Vegetarian</label>
           </div>
            
         <br />
           
                
        </div>

       
         
         
        
      </div>
    </div>
  );
};

export default Filter;
