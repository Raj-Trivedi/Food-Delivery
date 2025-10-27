import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backlogo from '../../../../assets/frontend_assets/left-arrow_7131308.png';
import './Login.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state or redirect
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/seller-register');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP', { position: 'top-center' });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/seller/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // On successful verification
      toast.success('Email verified successfully!', { position: 'top-center' });
      
      // Save token and user data if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.seller));
        localStorage.setItem('role', 'seller');
        
        if (typeof setUser === 'function') setUser(data.seller);
        if (typeof setIsAuthenticated === 'function') setIsAuthenticated(true);
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // If no token is provided (e.g., during registration), redirect to login
        setTimeout(() => {
          navigate('/seller-signin');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Error verifying OTP. Please try again.', { 
        position: 'top-center',
        autoClose: 3000
      });
      
      // Clear OTP fields on error
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      if (document.querySelector('.otp-input')) {
        document.querySelector('.otp-input').focus();
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch('/api/seller/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setCountdown(300); // Reset countdown to 5 minutes
      setIsResendDisabled(true);
      toast.success('OTP has been resent to your email');
    } catch (error) {
      toast.error(error.message || 'Error resending OTP');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-content">
          <div className="auth-logos">
            <img src={backlogo} alt="Back" onClick={() => navigate(-1)} />
          </div>
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit verification code to {email}</p>
          <p className="resend-info">
            Code expires in: {formatTime(countdown)}
          </p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <h2>Enter Verification Code</h2>
          <p>Please enter the code sent to your email</p>
          
          <form onSubmit={handleVerify} className="otp-form">
            <div className="otp-inputs">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="resend-otp">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResendDisabled || loading}
                className="resend-button"
              >
                Resend OTP {isResendDisabled ? `(${formatTime(countdown)})` : ''}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;