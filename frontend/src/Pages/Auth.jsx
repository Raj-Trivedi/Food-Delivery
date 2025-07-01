import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Login from '../Component/Login/Login';
import Signup from '../Component/SignUp/SignUp';

const Auth = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <div className='auth-page'>
      {isSigningUp ? (
        <Signup onToggle={toggleForm} />
      ) : (
        <Login onToggle={toggleForm} />
      )}
    </div>
  );
};

Auth.propTypes = {
  onToggle: PropTypes.func
};

export default Auth;