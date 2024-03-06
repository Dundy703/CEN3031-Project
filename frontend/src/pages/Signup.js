import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
    return (
        <div className="signup">
            <h1>Create an Account</h1>
            <p>
                <label for="username">Username: </label>
                <input name="username"></input>
            </p>
            <br />
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
                <button>Create your account</button>
            </Link>
        </div>
    )
}

export default Signup