import React from 'react'
import Logo from '../assets/LogoNoWords.png';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar(props) {
  let navigate = useNavigate();
  const {loggedIn} = props;

  //log out the user and delete authorization token
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }

  return (
    <div className="navbar">
      <div className="leftSide">
        {/*Show logo image top left and link to home page*/}
        <Link to="/"><img src={Logo} alt="Logo"></img></Link>
      </div>
      <div className="rightSide">
        {/*
        Navbar Buttons
        User is NOT logged in -> [Home] [Shop] [List] [Log in]
        User IS logged in -> [Shop] [List] [Account] [Log out]
        */}
        {!loggedIn && <Link to="/">Home</Link>}
        <Link to={loggedIn ? '/shop' : '/login'}>Shop</Link>
        <Link to={loggedIn ? '/list' : '/login'}>List</Link>
        <Link to={loggedIn ? '/account' : '/login'}>{loggedIn ? 'Account' : 'Log in'}</Link>
        {loggedIn && <Link onClick={logout}>Log out</Link>}
      </div>
    </div>
  );
}

export default Navbar