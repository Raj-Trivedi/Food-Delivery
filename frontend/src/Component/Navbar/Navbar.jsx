import React, { useEffect, useState, useContext } from 'react';
import "./Navbar.css";
import logo from "../../../../assets/frontend_assets/Project_imgs/Logo.png";
import Search_icon from "../../../../assets/frontend_assets/search_icon.png";
import Cart_icon from "../../../../assets/frontend_assets/basket_icon.png";
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cartItems, searchItem, setSearchItem } = useContext(StoreContext);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 992;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleNav = (menuName, path) => {
        setMenu(menuName);
        navigate(path);
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className="navbar">
            {/* Mobile Menu Button - Moved to the left */}
            <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Logo */}
            <div className="nav-logo" onClick={() => handleNav("home", "/")}>
                <img src={logo} alt='Food Delivery Logo' />
            </div>

            {/* Desktop Navigation */}
            <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
                <ul>
                    <li onClick={() => handleNav("home", "/")} className={menu === "home" ? "active" : ""}>Home</li>
                    <li onClick={() => handleNav("menu", "/menu")} className={menu === "menu" ? "active" : ""}>Menu</li>
                    <li onClick={() => handleNav("aboutUs", "/aboutus")} className={menu === "aboutUs" ? "active" : ""}>About Us</li>
                    
                    {/* Mobile Search - Only visible in mobile menu */}
                    {isMobile && (
                        <li className="mobile-search-container">
                            <div className="nav-search">
                                <input 
                                    type='text' 
                                    value={searchItem}  
                                    onChange={(e) => setSearchItem(e.target.value)} 
                                    placeholder='Search food...' 
                                />
                                <img src={Search_icon} alt='Search' className="search-icon"/>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            {/* Desktop Actions - Search, Cart, Sign In */}
            <div className="nav-actions">
                {/* Desktop Search - Hidden on mobile */}
                {!isMobile && (
                    <div className="nav-search">
                        <input 
                            type='text' 
                            value={searchItem}  
                            onChange={(e) => setSearchItem(e.target.value)} 
                            placeholder='Search food...' 
                        />
                        <img src={Search_icon} alt='Search' className="search-icon"/>
                    </div>
                )}
                <div className="nav-cart" onClick={() => handleNav(menu, "/cart")}>
                    <img src={Cart_icon} alt='Cart' />
                    {Object.keys(cartItems).length > 0 && (
                        <span className="cart-count">{Object.keys(cartItems).length}</span>
                    )}
                </div>
                <button className="nav-btn" onClick={() => handleNav(menu, "/signUp")}>
                    Sign In
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            )}
        </nav>
    );
};
