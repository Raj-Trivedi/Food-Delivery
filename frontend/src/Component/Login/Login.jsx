import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import PropTypes from 'prop-types';
import "./Login.css";
import backlogo from "../../../../assets/frontend_assets/left-arrow_7131308.png";



const Login = ({ onToggle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Use the full backend URL to ensure the request reaches the server
        const backendUrl = 'http://localhost:5000';
        const endpoint = `${backendUrl}/api/user/login`;
        
        console.log('Making login request to:', endpoint);
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        
        console.log('Login response status:', res.status);
        
        let data;
        try {
          data = await res.json();
          console.log('Login response data:', data);
        } catch (jsonErr) {
          console.error('Login JSON parsing error:', jsonErr);
          setErrors({ submit: 'Server error: Invalid response format.' });
          setIsLoading(false);
          return;
        }
        
        if (!res.ok) {
          console.error('Login HTTP error:', res.status, data);
          setErrors({ submit: data.message || `HTTP ${res.status}: Login failed!` });
          setIsLoading(false);
          return;
        }
        
        if (!data.success) {
          console.error('Login API error:', data);
          setErrors({ submit: data.message || 'Login failed!' });
          setIsLoading(false);
          return;
        }
        
        // Success case
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', 'user');
        setErrors({});
        navigate('/');
      } catch (error) {
        console.error('Login network error:', error);
        setErrors({ submit: error.message || 'Network error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Forgot password clicked");
    // Add forgot password logic here
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
    <div className="login-container">
      {/* logo */}

     



      {/* Left Side with Bubbles */}
    
      <div className="login-left">
        <Bubble size={100} left="10%" top="20%" delay={0} duration={25} />
        <Bubble size={150} left="70%" top="40%" delay={2} duration={30} />
        <Bubble size={70} left="20%" top="60%" delay={4} duration={20} />
        <Bubble size={120} left="70%" top="10%" delay={6} duration={35} />
        
        <div className="login-content">
        <div className="auth-logos">
         <img src={backlogo} alt="" onClick={()=> navigate('/')} />
         </div>
          <h1>Welcome Back!</h1>
          <p>To keep connected with us, please log in with your personal information. </p>
          <button onClick={onToggle} className="btn-outline">
            SIGN UP
          </button>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>Login to Your Account</h2>
          <p>Enter your details to login</p>
          
          {errors.submit && (
            <div className="alert alert-danger">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form" noValidate>
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
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              
              <a 
                href="#" 
                className="forgot-password" 
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </a>
            </div>
            
            <button 
              type="submit" 
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            
            <div className="divider">
              <span>or login with</span>
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
              Don't have an account?{' '}
              <p
                type="button" 
                className="btn-link"
                onClick={onToggle}
              >
                Sign up
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onToggle: PropTypes.func.isRequired
};

export default Login;