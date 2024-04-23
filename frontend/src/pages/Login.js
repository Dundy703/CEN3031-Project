import React from 'react';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
    const [formData, setFormData] = useState({
        userEmail: '',
        userPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axios.post(`http://localhost:3001/users/verifyUser`, formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>      
                <h1>Log in</h1>  
                <p>
                    <label htmlFor="email">Email: </label>
                    <input name="userEmail" type="email" value={formData.userEmail} onChange={handleChange} />
                </p>
                <br />
                <p>
                    <label htmlFor="password">Password: </label>
                    <input name="userPassword" type="password" value={formData.userPassword} onChange={handleChange} />
                </p>
                <br />
                <button type="submit">Next</button>
                <br />
                <Link to="/signup"><p>Don't have an account? Sign up</p></Link>
            </form>
        </div>
    )
}

export default Login