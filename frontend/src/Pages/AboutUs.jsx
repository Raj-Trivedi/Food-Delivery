import React from 'react';
import { FaMotorcycle, FaUtensils, FaStar, FaLeaf, FaClock, FaHeart } from 'react-icons/fa';
import '../Component/Styles/AboutUs.css';

const stats = [
  { number: '1000+', label: 'Happy Customers' },
  { number: '50+', label: 'Restaurant Partners' },
  { number: '10,000+', label: 'Meals Delivered' },
  { number: '30min', label: 'Average Delivery Time' }
];

const features = [
  { 
    icon: <FaClock className="feature-icon" />, 
    title: 'Fast Delivery',
    desc: 'Get your food delivered in under 30 minutes or it\'s on us!',
    color: '#FF6B6B'
  },
  { 
    icon: <FaUtensils className="feature-icon" />, 
    title: '100+ Restaurants',
    desc: 'Wide variety of cuisines from the best local restaurants',
    color: '#4ECDC4'
  },
  { 
    icon: <FaStar className="feature-icon" />, 
    title: 'Top Rated',
    desc: 'Rated 4.9/5 by thousands of satisfied customers',
    color: '#FFD166'
  },
  { 
    icon: <FaLeaf className="feature-icon" />, 
    title: 'Fresh Ingredients',
    desc: 'Only the highest quality, fresh ingredients in every meal',
    color: '#06D6A0'
  }
];

export const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Our Culinary Journey</h1>
          <p>Delivering happiness, one meal at a time</p>
          
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="section-header">
            <h2>Our Story</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Welcome to <span className="highlight">FoodExpress</span>, where passion for food meets convenience. 
                Founded in 2023, we started as a small team of food enthusiasts with a simple mission: to bring 
                the best local restaurants to your doorstep.
              </p>
              <p>
                What began as a local delivery service has grown into a culinary platform connecting food lovers 
                with the best dining experiences in town. We carefully select our restaurant partners to ensure 
                every meal meets our high standards of quality and taste.
              </p>
              <div className="about-features">
                <div className="feature">
                  <FaHeart className="feature-icon" />
                  <span>Made with Love</span>
                </div>
                <div className="feature">
                  <FaMotorcycle className="feature-icon" />
                  <span>Fast & Reliable</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                alt="Our Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p>We're committed to providing the best food delivery experience</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to experience the best food delivery?</h2>
          <p>Download our app and get 20% off your first order</p>
          <div className="cta-buttons">
            <button className="btn primary-btn">Order Now</button>
            <button className="btn secondary-btn">Download App</button>
          </div>
        </div>
      </section>
    </div>
  );
};
