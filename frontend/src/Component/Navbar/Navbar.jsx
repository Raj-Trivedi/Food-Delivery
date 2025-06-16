import React from 'react'
import "./Navbar.css"
import logo from "../../../../assets/frontend_assets/logo.jpg"
import Search_icon from "../../../../assets/frontend_assets/search_icon.png"
import Cart_icon from "../../../../assets/frontend_assets/basket_icon.png"
import { useState } from 'react'

export const Navbar = () => {
    const [menu, setMenu] = React.useState("home");
  return (
    <div className="nav-container">
        <div className="nav-logo">
            <img src={logo} alt='Logo'/>
        </div>
        <div className="nav-option">
            <ul>
                <li onClick={()=> setMenu("home")} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=> setMenu("menu")} className={menu==="menu"?"active":""}>Menu</li>
                <li onClick={()=> setMenu("aboutUs")} className={menu==="aboutUs"?"active":""}>About Us</li>
            </ul>
        </div>
        <div className="nav-right">
            <div className="nav-search">
                <input type='text' placeholder='Search' />
                <img src={Search_icon} alt='Search Icon'/>
            </div>
            <div className="nav-cart">
                <div className="cart-quantity">4</div>
                <img src={Cart_icon} alt='Cart Icon'/>
            </div>

            <div className="nav-btn">
                <button>Sign In</button>
            </div>
        </div>
    </div>
  )
}
