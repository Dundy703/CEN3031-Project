import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login(props) {
    let navigate = useNavigate();
    if(props.loggedIn) navigate('/');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        userEmail: '',
        userPassword: '',
    });

    //when a value is updated, changes are immediately stored to the formData object
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //upon form submission, user is verified with the verifyUser endpoint
    const handleSubmit = (e) => {
        setError('');
        e.preventDefault();
        console.log(formData);
        axios.post(`http://localhost:3001/users/verifyUser`, formData)
            .then((response) => {
                console.log(response.data);
                if(response.data.message === "Successful Login"){
                    localStorage.setItem('token', response.data.token);
                    props.setLoggedIn(true);
                    props.setEmail(formData.userEmail);
                    navigate("/");
                };
            })
            .catch(error => {
                //set error to the error message, which will be displayed in red
                setError(error.response.data);

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
                <h2 id="errorText">{error}</h2>
                <br />
                <button type="submit">Log in</button>
                <br />
                <Link to="/signup"><p>Don't have an account? Sign up</p></Link>
            </form>
        </div>
    )
}

export default Login