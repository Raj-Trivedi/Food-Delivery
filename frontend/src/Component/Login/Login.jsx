import React from "react";
import "./Login.css";

const Login = () => {
  return (
<div className="login-wrapper">
    <div className="login-left">
    <div className="curve-shape"></div>
    <div className="login-content">
        <div className="login-logo">blueflame</div>
        <h2>Welcome Back!</h2>
        <p>To stay connected with us, please login with your personal info</p>
        <button className="btn-outline">SIGN IN</button>
    </div>
    </div>

    <div className="login-right">
    <h2>Welcome</h2>
    <p>Login in to your account to continue</p>
    <input type="email" placeholder="Email..." />
    <input type="password" placeholder="Password..." />
    <p className="forgot-text">Forgot your password?</p>
    <button className="btn-filled">LOGIN</button>
    <p className="switch-text">Don't have an account? <span>Sign up</span></p>
    </div>
</div>
  );
};

export default Login;
