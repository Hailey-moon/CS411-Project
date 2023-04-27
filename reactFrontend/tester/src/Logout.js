import './Logout.css'
function LogoutButton() {
    const handleClick = () => {
      window.location.href = 'http://localhost:3000/';
    };
  
    return (
      <button className="buttonL" onClick={handleClick} style={{ /* add your Spotify-style button styles here */ }}>
        Logout
      </button>
    );
  }

export default LogoutButton;