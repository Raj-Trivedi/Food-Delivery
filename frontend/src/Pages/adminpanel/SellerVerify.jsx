import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backlogo from '../../../../assets/frontend_assets/left-arrow_7131308.png';
import './SellerVerify.css';

const SellerVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;
  const message = location.state?.message || 'Please enter the verification code sent to your email.';

  useEffect(() => {
    if (!email) {
      navigate('/seller-register');
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit code', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/seller/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.seller));
      localStorage.setItem('role', 'seller');

      toast.success('Email verified successfully!', { position: 'top-center' });
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Verification failed', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/seller/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast.success('New OTP sent to your email!', { position: 'top-center' });
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(['', '', '', '', '', '']); // Clear OTP inputs

    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to resend OTP', { position: 'top-center' });
    } finally {
      setResendLoading(false);
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
    <div className="verify-container">
      {/* Left Side with Bubbles */}
      <div className="verify-left">
        <Bubble size={100} left="10%" top="20%" delay={0} duration={25} />
        <Bubble size={150} left="70%" top="40%" delay={2} duration={30} />
        <Bubble size={70} left="20%" top="60%" delay={4} duration={20} />
        <Bubble size={120} left="70%" top="10%" delay={6} duration={35} />
        
        <div className="verify-content">
          <div className="auth-logos">
            <img src={backlogo} alt="Back" onClick={() => navigate('/seller-register')} />
          </div>
          <h1>Enter Verification Code</h1>
          <p>Please enter the code sent to your email.</p>
          <button onClick={() => navigate('/seller-register')} className="btn-outline">
            BACK TO SIGNUP
          </button>
        </div>
      </div>

      {/* Right Side - OTP Verification Form */}
      <div className="verify-right">
        <div className="verify-form-container">
          <h2>Verify Your Email</h2>
          <p>{message}</p>
          
          {/* Timer */}
          <div className="timer-container">
            <div className="timer">
              Code expires in: {formatTime(timeLeft)}
            </div>
          </div>

          {/* OTP Input */}
          <div className="otp-container">
            <label>Verification Code</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="otp-input"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button 
            onClick={handleVerify} 
            className="verify-btn"
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP */}
          <div className="resend-container">
            <p>Didn't receive the code?</p>
            <button 
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              className="resend-btn"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Back to Login */}
          <div className="back-to-login">
            <span onClick={() => navigate('/seller-signin')}>
              Back to Seller Login
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellerVerify;
