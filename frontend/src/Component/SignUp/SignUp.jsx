import React, { useState } from "react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import PropTypes from 'prop-types';
import "./SignUp.css"
import backlogo from "../../../../assets/frontend_assets/left-arrow_7131308.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignUp = ({ onToggle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting signup form", formData);
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const endpoint = '/api/user/signup';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          toast.error('Server error: Invalid response format.', { position: 'top-center', autoClose: 2000 });
          setIsLoading(false);
          return;
        }
        console.log('Signup response:', data);
        if (!res.ok || !data.success) {
          setErrors({ submit: data.message || 'Signup failed!' });
          toast.error(data.message || 'Signup failed!', { position: 'top-center', autoClose: 2000 });
          setIsLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', 'user');
        setErrors({});
        toast.success('Signup successful! Redirecting...', { position: 'top-center', autoClose: 2000 });
        setTimeout(() => navigate('/'), 1200);
      } catch (error) {
        setErrors({ submit: error.message || 'Network error. Please try again.' });
        toast.error(error.message || 'Network error. Please try again.', { position: 'top-center', autoClose: 2000 });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Add social login logic here
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
    <div className="auth-container">
      {/* Left Side with Bubbles */}
      <div className="auth-left">
        <Bubble size={100} left="10%" top="20%" delay={0} duration={25} />
        <Bubble size={150} left="70%" top="40%" delay={2} duration={30} />
        <Bubble size={70} left="20%" top="60%" delay={4} duration={20} />
        <Bubble size={120} left="70%" top="10%" delay={6} duration={35} />
        
        <div className="auth-content">
          <div className="auth-logo">
                   <img src={backlogo} alt=""  onClick={()=> navigate('/')} />
                   </div>
          <h1>Welcome to Zepto Food Delivery</h1>
          <p>To keep connected with us please sign up with your personal info</p>
          <button onClick={onToggle} className="btn-outline">
            SIGN IN
          </button>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Create Your Account</h2>
          <p>Fill in your details to get started</p>
          
          {errors.submit && (
            <div className="alert alert-danger">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-options">
              <label className={`checkbox-container ${errors.agreeTerms ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                I agree to the <a href="#" className="terms-link">Terms & Conditions</a>
                {errors.agreeTerms && (
                  <span className="error-message">{errors.agreeTerms}</span>
                )}
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
            
            <div className="divider">
              <span>or sign up with</span>
            </div>
            
            <div className="social-login">
              <button 
                type="button" 
                className="social-btn google"
                onClick={() => handleSocialLogin('Google')}
              >
                <FaGoogle className="social-icon" />
              </button>
              <button 
                type="button" 
                className="social-btn facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook className="social-icon" />
              </button>
              <button 
                type="button" 
                className="social-btn apple"
                onClick={() => handleSocialLogin('Apple')}
              >
                <FaApple className="social-icon" />
              </button>
            </div>
            
            <div className="auth-link">
            Already have an account?{' '}
              <p
                type="button" 
                className="btn-link"
                onClick={onToggle}
              >
                Sign in
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

SignUp.propTypes = {
  onToggle: PropTypes.func.isRequired
};

export default SignUp;
