import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="curve-shape"></div>
        <div className="auth-content">
          <div className="auth-logo">blueflame</div>
          <h2>Welcome Back!</h2>
          <p>To stay connected with us, please login with your personal info</p>
          <Link to="/signup" className="btn-outline">
            SIGN UP
          </Link>
        </div>
      </div>

      <div className="auth-right">
        <h2>Welcome</h2>
        <p>Login in to your account to continue</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email..."
              required
            />
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password..."
              required
            />
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
          </div>
          
          <button type="submit" className="btn-filled">
            LOGIN
          </button>
        </form>

        
        <div className="divider">
          <span>or login with</span>
        </div>
        
        <div className="social-login">
          <button type="button" className="social-btn google">
            <FaGoogle className="social-icon" />
          </button>
          <button type="button" className="social-btn facebook">
            <FaFacebook className="social-icon" />
          </button>
          <button type="button" className="social-btn apple">
            <FaApple className="social-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
