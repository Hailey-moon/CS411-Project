import React from 'react';
import './App.css';

function Button() {
  const handleClick = () => {
    window.location.href = 'http://localhost:5001/new-login';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button className="button" onClick={handleClick}>
        LOGIN WITH SPOTIFY
      </button>
    </div>
  );
}

export default Button;