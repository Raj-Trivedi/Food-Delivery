import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
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
    // Handle sign up logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <h2>Fresh Food</h2>
        </div>
        <h1>Welcome!</h1>
        <p>Enter your details to start your journey with us</p>
        <Link to="/login" className="btn-outline">
          SIGN IN
        </Link>
      </div>

      <div className="auth-right">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your Password"
              required
            />
          </div>
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              I agree to the <a href="#" className="text-link">Terms</a> and{" "}
              <a href="#" className="text-link">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="btn-filled">
            SIGN UP
          </button>
        </form>

        <div className="divider">
          <span>or sign up with</span>
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

export default SignUp;
