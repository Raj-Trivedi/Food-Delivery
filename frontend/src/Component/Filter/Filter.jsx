
import React, { useState, useEffect } from 'react';
import './Filter.css';
import { menu_list } from "../../../../assets/frontend_assets/assets";

const Filter = ({ category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, maxProductPrice, dietary, setDietary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

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

  // Dietary filter handler
  const handleDietaryChange = (e) => {
    const { value, checked } = e.target;
    setDietary((prev) => {
      const newDietary = { ...prev };
      if (checked) {
        newDietary[value] = true;
      } else {
        delete newDietary[value];
      }
      return newDietary;
    });
  };

  useEffect(() => {
    console.log("Category changed:", category);
  }, [category]);

  useEffect(() => {
    console.log("Price range changed: Min =", minPrice, "Max =", maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    console.log("Dietary filter changed:", dietary);
  }, [dietary]);

  const handleMinChange = (e) => {
    const value = Math.round(e.target.value / 10) * 10;
    setMinPrice(value > maxPrice ? maxPrice : value);
  };

  const handleMaxChange = (e) => {
    const value = Math.round(e.target.value / 10) * 10;
    setMaxPrice(value < minPrice ? minPrice : value);
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      {isMobile && (
        <button 
          className="filter-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Open filters"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="4" r="2" fill="currentColor"/>
            <circle cx="20" cy="12" r="2" fill="currentColor"/>
          </svg>
          <span>Filters</span>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="filter-overlay active"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Filter Sidebar */}
      <div 
        className={`Filter-Container ${isMobile ? (isOpen ? 'open' : 'closed') : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button 
            className="filter-close-btn"
            onClick={closeSidebar}
            aria-label="Close filters"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div className="Catergory_cont">
        <h3>Product Category</h3>
        <div className="filter-content">
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
           {/* Others option */}
           <div className='categogy_list' key="others">
             <input id="mychecked-others"
               type="checkbox"
               checked={!!category['Others']}
               onChange={() => filterByCategory({ menu_name: 'Others' })}
             />
             <div className='categogy_item'>Others</div>
           </div>
          </div>
      </div>
      <hr />

      <div className="Range_cont">
        <h3>Price Range</h3>
        <div className="Range_item">
          <label>Min Price:</label>
          <span>₹{minPrice}</span>
          <input
            type="range"
            min="0"
            max={maxProductPrice}
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
            max={maxProductPrice}
            step="1"
            value={maxPrice}
            onChange={handleMaxChange}
          />
        </div>
        <div className="Range_value">
          <p>Selected Range: ₹{minPrice} - ₹{maxPrice}</p>
        </div>
      </div>
      <hr />

      <div className="Dietary_cont">
        <h3>Dietary</h3>
        <div className="Dietary-list">
          <div className="Dietary-item">
            <input
              id="veg-checked"
              type="checkbox"
              value="Veg"
              checked={!!dietary["Veg"]}
              onChange={handleDietaryChange}
            />
            <label htmlFor="veg-checked">Vegetarian</label>
          </div>
          <div className="Dietary-item">
            <input
              id="nonveg-checked"
              type="checkbox"
              value="Non Veg"
              checked={!!dietary["Non Veg"]}
              onChange={handleDietaryChange}
            />
            <label htmlFor="nonveg-checked">Non Vegetarian</label>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Filter;
