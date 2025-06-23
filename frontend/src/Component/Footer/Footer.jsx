import React from 'react';
import './Footer.css';
import twitterIcon from '../../../../assets/frontend_assets/twitter_icon.png';
// import twitterIcon from '../../../../assets/frontend_assets/twitter_icon.png';
import facebookIcon from '../../../../assets/frontend_assets/facebook_icon.png';
import LinkedinIcon from '../../../../assets/frontend_assets/linkedin_icon.png';

// import logo from '../../../assets/frontend_assets/img/logos/illustration-organic-food.png';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-left">
          {/* Using a text logo for now */}
          <h2 className='footer-logo'>FRESH FOOD</h2>
          <p className='footer-desc'>Choose from a wide variety of delicious meals and get them delivered fast. Simple, quick, and just the way you like it.</p>
          <div className="social-icons">
            <img src={twitterIcon} alt="Twitter" />
            <img src={LinkedinIcon} alt="LinkedIn" />
            {/* <img src={twitterIcon} alt="Instagram" /> */}
            <img src={facebookIcon} alt="Facebook" />
          </div>
        </div>
        <div className="footer-center">
            <h4>COMPANY</h4>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-right">
            <h4>GET IN TOUCH</h4>
            <ul>
                <li>+1-212-456-7890</li>
                <li>contact@organicfood.dev</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Raj.dev - All Right Reserved.</p>
    </footer>
  );
};

export default Footer;
