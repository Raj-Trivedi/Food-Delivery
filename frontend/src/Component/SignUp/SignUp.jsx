import React from "react";
import "./SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-brand">
          <h2>Fresh Food</h2>
        </div>
        <h1>Welcome!</h1>
        <p>Enter your details to start your journey with us</p>
        <button className="signup-btn outlined">SIGN UP</button>
      </div>
        <div className="signup-right">
        <h2>Create Account</h2>
        <input type="text" placeholder="Enter your Name" />
        <input type="email" placeholder="Enter your Email" />
        <input type="password" placeholder="Enter your Password" />
        <button className="signup-btn">SIGN UP</button>
        <p className="signup-switch">Already have an account? <span>Sign in</span></p>
      </div>
      </div>
  );
};

export default SignUp;
