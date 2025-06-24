import React from 'react'
import Filter from '../Component/Filter/Filter'
import FilterItem from '../Component/DisplayFilterItem/FilterItem';
import FilterHeader from '../Component/Filter/FilterHeader';
import { useState } from 'react';
import './Menu.css';

 const Menu = () => {
  const [category, setCategory] = React.useState({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('default');

  return (
    <div className='menu-container'>

      <Filter category={category} setCategory={setCategory} minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
      <div className="right-menu">
        <FilterHeader sortBy={sortBy} setSortBy={setSortBy} />
        <FilterItem  category={category} minPrice={minPrice} maxPrice={maxPrice}  sortBy={sortBy}/>


      </div>

    </div>
  )
}
export default Menu;
