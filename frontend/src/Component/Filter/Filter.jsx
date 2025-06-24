import React, { useEffect } from 'react'
import "./Filter.css"
import {menu_list} from "../../../../assets/frontend_assets/assets"

const Filter = ({category , setCategory }) => {

    const filterByCategory=(item) => {
        if(category[item.menu_name]){
            setCategory((prev) => ({...prev,[item.menu_name] : !prev[item.menu_name]}))
        }else{
            setCategory((prev) => ({...prev,[item.menu_name] : true}))
        }
    }

    useEffect(() => {
        console.log("category changed : ",category);
    }, [category]);

  return (
    <div className="Filter-conatiner">
        <div className="Category_cont">
            <h3>Product Category</h3>
            {menu_list.map((item,index) => {
                return(
                    <div className="category_list" key={index}>
                        <input id='mychecked' type='checkbox' onClick={() => filterByCategory(item)}/>
                        <div className="category_item">{item.menu_name}</div>
                    </div>
                )
            })}
        </div>

        <div className="range_cont">
            <h3>Price Range</h3>
            <div className="Range_item">
                <input type='range' min="0"  max="1000" step="10" value={priceRange} onChange={handleRangechange} />
                <div className="Range_value">
                    <p>Price: </p>
                    <span>$0</span>
                    <span>${PriceChange}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Filter