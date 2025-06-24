import React from 'react'
import './FilterHeader.css';

const FilterHeader = ({sortBy,setSortBy}) => {
  return (
    <div className="FilterHeader-Container">
        <div className="filter-sort">
             <label htmlFor="">Sort by: </label>

            <select className="filter-select" onChange={(e)=> {setSortBy(e.target.value)}} >
                <option value="default">Default</option>
                <option  value="LH">Price: Low to High</option>
                <option  value="HL">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
           
        </div>

    </div>
  )
}

export default FilterHeader