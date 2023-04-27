import "../Style/App.css"

function LogoutButton() {
    const handleClick = () => {
      window.location.href = 'http://localhost:3000/';
    };
  
    return (
      <button className="button logOutButton" onClick={handleClick}>
        LOGOUT
      </button>
    );
  }

export default LogoutButton;