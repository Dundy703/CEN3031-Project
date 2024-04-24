import React from 'react'
import Logo from '../assets/LogoNoWords.png';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar(props) {
  let navigate = useNavigate();
  const {loggedIn} = props;

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }

  return (
    <div className="navbar">
      <div className="leftSide">
        <Link to="/"><img src={Logo} alt="Logo"></img></Link>
      </div>
      <div className="rightSide">
        {!loggedIn && <Link to="/">Home</Link>}
        <Link to={loggedIn ? '/shop' : '/login'}>Shop</Link>
        <Link to={loggedIn ? '/list' : '/login'}>List</Link>
        <Link to={loggedIn ? '/account' : '/login'}>{loggedIn ? 'Account' : 'Log in'}</Link>
        {loggedIn && <Link onClick={logout}>Log Out</Link>}
      </div>
    </div>
  );
}

export default Navbar