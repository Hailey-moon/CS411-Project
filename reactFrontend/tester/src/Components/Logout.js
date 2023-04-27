import "../Style/App.css"
import"../Style/Logout.css"

function LogoutButton() {
    const handleClick = () => {
      window.location.href = 'http://localhost:3000/';
    };
  
    return (
      <button className="logoutButton logOutButton" onClick={handleClick}>
        LOGOUT
      </button>
    );
  }

export default LogoutButton;