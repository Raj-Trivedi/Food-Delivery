import React from 'react'
import "./Navbar.css"
import logo from "../../../../assets/frontend_assets/logo.jpg"
import Search_icon from "../../../../assets/frontend_assets/search_icon.png"
import Cart_icon from "../../../../assets/frontend_assets/basket_icon.png"
import { useState } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const [menu, setMenu] = React.useState("home");
    const navigate = useNavigate();

    const {cartItems,searchItem,setSearchItem } = useContext(StoreContext);
  return (
    <div className="nav-container">
        <div className="nav-logo">
            <img src={logo} alt='Logo'/>
        </div>
        <div className="nav-option">
            <ul>

                <li onClick={()=>{ setMenu("home"); navigate("/")}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>{ setMenu("menu"); navigate("/menu")}} className={menu==="menu"?"active":""}>Menu</li>
                <li onClick={()=> {setMenu("aboutUs"); navigate("/aboutus")}} className={menu==="aboutUs"?"active":""}>About Us</li>

            </ul>
        </div>
        <div className="nav-right">
            <div className="nav-search">
                <input type='text' value={searchItem}  onChange={(e) => setSearchItem(e.target.value)} placeholder='Search' />
                <img src={Search_icon} alt='Search Icon'/>
            </div>
            <div className="nav-cart">
                <div className="cart-quantity">{Object.keys(cartItems).length}</div>
                <img src={Cart_icon} alt='Cart Icon' onClick={() => navigate("/cart")} />
            </div>

            <div className="nav-btn">
                <button onClick={() => navigate("/signUp")}>Sign In</button>
            </div>
        </div>
    </div>
  )
}
