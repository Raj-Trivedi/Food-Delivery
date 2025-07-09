
import React from 'react'
import Filter from '../Component/Filter/Filter'
import FilterItem from '../Component/DisplayFilterItem/FilterItem';
import FilterHeader from '../Component/Filter/FilterHeader';
import { useState, useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';
import './Menu.css';

const Menu = () => {
  const [category, setCategory] = React.useState({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('default');
  const { food_list } = useContext(StoreContext);

  // Compute the max price dynamically
  const maxProductPrice = food_list.length > 0 ? Math.max(...food_list.map(item => item.price)) : 1000;

  // Ensure maxPrice never exceeds maxProductPrice
  React.useEffect(() => {
    if (maxPrice > maxProductPrice) setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);

  return (
    <div className='menu-container'>
      <Filter 
        category={category} setCategory={setCategory} 
        minPrice={minPrice} setMinPrice={setMinPrice} 
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        maxProductPrice={maxProductPrice}
      />
      <div className="right-menu">
        <FilterHeader sortBy={sortBy} setSortBy={setSortBy} />
        <FilterItem  category={category} minPrice={minPrice} maxPrice={maxPrice}  sortBy={sortBy}/>
      </div>
    </div>
  )
}
export default Menu;

