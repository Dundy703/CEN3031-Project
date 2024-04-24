import React from 'react'
import Logo from '../assets/LogoNoWords.png';
import {Link} from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar(props) {
  const {loggedIn} = props;

  return (
    <div className="navbar">
      <div className="leftSide">
        <Link to="/"><img src={Logo} alt="Logo"></img></Link>
      </div>
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/list">List</Link>
        <Link to={loggedIn ? '/account' : '/login'}>{loggedIn ? 'Account' : 'Log in'}</Link>
      </div>
    </div>
  );
}

export default Navbar