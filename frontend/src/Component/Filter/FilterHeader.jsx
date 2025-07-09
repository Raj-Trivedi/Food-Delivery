import React from 'react'
import './FilterHeader.css';
import headerimg from "../../../../assets/frontend_assets/filterheader.png";

const FilterHeader = ({sortBy,setSortBy}) => {
  return (
    <div className="FilterHeader-Container">
      <div className="header-img">
        <img src={headerimg} alt="Filter Header" />
      </div>
        <div className="filter-sort">
             <label htmlFor="">Sort by: </label>

            <select className="filter-select" onChange={(e)=> {setSortBy(e.target.value)}} >
                <option value="default">Default</option>
                <option  value="LH">Price: Low to High</option>
                <option  value="HL">Price: High to Low</option>
            </select>
           
        </div>

    </div>
  )
}

export default FilterHeader