import React, { useEffect, useRef, useContext } from 'react';
import { menu_list } from "../../../../assets/frontend_assets/assets.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import "./Explore.css";
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import { StoreContext } from '../../Context/StoreContext'

const Explore = () => {
    const scrollRef = useRef(null);
    const { food_list } = useContext(StoreContext)

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            if (direction === 'left') {
                current.scrollLeft -= 200; // scroll left by 200px
            } else {
                current.scrollLeft += 200; // scroll right by 200px
            }
        }
    };

    const [category, setCategory] = useState("All");


    useEffect(() => {
        console.log(category, "category")
        // console.log(food_list, "food_list")
        const catgeoryItems = food_list.filter((item) => item.category === category)
        console.log(catgeoryItems,"check")
    }, [category])
    return (
        <div className="explore-container">
            <h1>Elevate Your Everyday Meal</h1>
            <p>
                Crave-worthy dishes made from the freshest ingredients, designed to turn every meal into a moment worth savoring.
            </p>

            <div className="Explore-slider-container">
                {/* Left arrow */}
                <button className="slider-button left" onClick={() => scroll('left')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Scrollable menu list */}
                <div className="explore-menu-items" ref={scrollRef}>
                    {menu_list.map((item, index) => (
                        <div onClick={() => setCategory((prev) => prev === item.menu_name ? "All" : item.menu_name)} className="menu-items" key={index}>
                            <img src={item.menu_image} alt={item.menu_name} className={category === item.menu_name ? "actives" : ""} />
                            <p>{item.menu_name}</p>
                        </div>
                    ))}
                </div>

                {/* Right arrow */}
                <button className="slider-button right" onClick={() => scroll('right')}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div><hr></hr>
            <FoodDisplay category={category} />
        </div>
    );
};

export default Explore;