import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Login.css';

function buttonPress(){
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;
    alert("email: " + email + "\npassword: " + password);
}


function Login() {
    return (
        <div className="login">
            <h1>Log in</h1>
            <p>
                <label for="email">Email: </label>
                <input name="email"></input>
            </p>
            <br />
            <p>
                <label for="password">Password: </label>
                <input name="password" type="password"></input>
            </p>
            <br />
            <Link to="/">
                <button onClick={buttonPress}>Log in</button>
            </Link>
            <br />
            <p>Forgot Password?</p>
        </div>
    )
}

export default Login