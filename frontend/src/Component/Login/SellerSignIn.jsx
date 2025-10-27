import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backlogo from '../../../../assets/frontend_assets/left-arrow_7131308.png';
// import logo from '../../../../assets/frontend_assets/img/logos/logo3.png';
import './Login.css';
import { AppContext } from '../../Context/AppContext';
import { StoreContext } from '../../Context/StoreContext';
import Loader from './Loader.jsx';

const SellerSignIn = () => {
  const { setIsAuthenticated, setUser } = useContext(AppContext);
  const { fetchUserData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
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
      const response = await fetch('http://localhost:5000/api/seller/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        // If email is not verified, redirect to OTP verification
        if (data.error === 'EMAIL_NOT_VERIFIED') {
          navigate('/seller-verify', { 
            state: { 
              email: formData.email,
              message: 'Please verify your email to continue.'
            } 
          });
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      // If login is successful, save token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.seller));
      localStorage.setItem('role', 'seller');
      
      if (typeof setUser === 'function') setUser(data.seller);
      if (typeof setIsAuthenticated === 'function') setIsAuthenticated(true);
      if (typeof fetchUserData === 'function') fetchUserData();
      
      toast.success('Login successful!', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.', { 
        position: 'top-center', 
        autoClose: 2000 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Switching to Seller..." />;

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
          <h1>Seller Login</h1>
          <p>To access your seller dashboard, please log in with your seller credentials.</p>
          <button onClick={() => navigate('/seller-register')} className="btn-outline">
            SELLER REGISTER
          </button>
        </div>
      </div>
      {/* Right Side - Seller Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>Seller Login</h2>
          <p>Enter your seller credentials to log in</p>
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
            <button type="submit" className="btn-login">
              LOGIN
            </button>
            <div className="auth-link">
              New Seller?{' '}
              <span className="signup-text" onClick={() => navigate('/seller-register')}>
                Register Here
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellerSignIn; 