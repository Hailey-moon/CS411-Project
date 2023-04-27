import React from 'react';
import '../Style/Login.css';

function Button() {
  const handleClick = () => {
    window.location.href = 'http://localhost:5001/new-login';
  };

  return (
    <div className='login'>
      <button className='logInButton button' onClick={handleClick}>
        LOGIN WITH SPOTIFY
      </button>
    </div>
  );
}

export default Button;