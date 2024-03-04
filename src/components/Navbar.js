import React from 'react'
import Logo from '../assets/LogoNoWords.png';
import {Link} from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="leftSide">
        <Link to="/"><img src={Logo}></img></Link>
      </div>
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log&nbsp;in</Link>
      </div>
    </div>
  );
}

export default Navbar