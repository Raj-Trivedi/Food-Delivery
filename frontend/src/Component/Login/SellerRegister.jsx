import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backlogo from '../../../../assets/frontend_assets/left-arrow_7131308.png';
// import logo from '../../../../assets/frontend_assets/img/logos/logo3.png';
import './Login.css';

const SellerRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    restaurantName: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.restaurantName) newErrors.restaurantName = 'Shop/Restaurant Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      console.log('Sending signup request to backend...');
      const response = await fetch('http://localhost:5000/api/seller/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Success - redirect to OTP verification
      toast.success('OTP sent to your email!', { 
        position: 'top-center',
        autoClose: 2000 
      });
      
      navigate('/seller-verify', { 
        state: { 
          email: formData.email,
          message: 'Please enter the OTP sent to your email to complete registration.'
        } 
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', { 
        position: 'top-center',
        autoClose: 2000 
      });
    } finally {
      setLoading(false);
    }
  };

  const Bubble = ({ size, left, top, delay, duration }) => (
    <div 
      className="bubble"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: left,
        top: top,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );

  return (
    <div className="login-container">
      {/* Left Side with Bubbles */}
      <div className="login-left">
        <Bubble size={100} left="10%" top="20%" delay={0} duration={25} />
        <Bubble size={150} left="70%" top="40%" delay={2} duration={30} />
        <Bubble size={70} left="20%" top="60%" delay={4} duration={20} />
        <Bubble size={120} left="70%" top="10%" delay={6} duration={35} />
        <div className="login-content">
          <div className="auth-logos">
            <img src={backlogo} alt="Back" onClick={() => navigate('/')} />
          </div>
          <h1>Become a Seller!</h1>
          <p>Register your restaurant or shop to start selling on Zepto Food Delivery.</p>
          <button onClick={() => navigate('/seller-signin')} className="btn-outline">
            SELLER LOGIN
          </button>
        </div>
      </div>
      {/* Right Side - Seller Registration Form */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>Seller Registration</h2>
          <p>Fill in your details to register as a seller</p>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Shop/Restaurant Name"
                className={errors.restaurantName ? 'error' : ''}
              />
              {errors.restaurantName && <span className="error-message">{errors.restaurantName}</span>}
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div className="auth-link">
              Already have an account?{' '}
              <span className="signup-text" onClick={() => navigate('/seller-signin')}>
                Seller Login
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellerRegister; 