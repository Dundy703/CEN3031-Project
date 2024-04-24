import React from 'react';
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import '../styles/Signup.css';


function Signup(props) {
    let navigate = useNavigate();
    const [fileURL, setFileURL] = useState();

    function handleImgChange(e) {
        setFileURL(URL.createObjectURL(e.target.files[0]));
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageData = event.target.result;
            
            setFileURL(imageData);
            setFormData(prevState => ({
                ...prevState,
                imageData: imageData
            }));
        };

        reader.readAsDataURL(file);
    }    

    function login(){
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
                console.error('There was an error!', error.response.data);
            });
    }


    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        imageData: '',
        userEmail: '',
        userUsername: '',
        userPassword: '',
        userFirstName: '',
        userLastName: '',
        userAddressLine1: '',
        userAddressLine2: '',
        userState: '',
        userCity: '',
        userZipCode: ''
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
        console.log(page);
        if(page === 1) setPage(2);
        else{
            console.log(formData);
            axios.post("http://localhost:3001/users/createUser", formData)
                .then((response) => {
                    console.log(response.data);
                    login();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    };
    
    return (
        <div>
            {page === 1 && (
                <form onSubmit={handleSubmit} className="signup">      
                <h1>Create an Account</h1>  
                    <p>
                        <label htmlFor="email">Email: </label>
                        <input name="userEmail" type="email" value={formData.userEmail} onChange={handleChange} />
                    </p>
                    <br />
                    <p>
                        <label htmlFor="username">Username: </label>
                        <input name="userUsername" value={formData.userUsername} onChange={handleChange} />
                    </p>
                    <br />
                    <p>
                        <label htmlFor="password">Password: </label>
                        <input name="userPassword" type="password" value={formData.userPassword} onChange={handleChange} />
                    </p>
                    <br />
                    <button type="submit">Next</button>
                    <br />
                    <Link to="/login"><p>Already have an account? Sign in</p></Link>
                </form>
            )}
            {page === 2 && (
                <form onSubmit={handleSubmit} className="info">   
                    <h1>Additional Information</h1>
                    <div className="form-grid">  
                        <div>
                        <p>
                            <label htmlFor="firstname">First Name: </label>
                            <input name="userFirstName" value={formData.userFirstName} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="lastname">Last Name: </label>
                            <input name="userLastName" value={formData.userLastName} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="address1">Address Line 1: </label>
                            <input name="userAddressLine1" value={formData.userAddressLine1} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="address2">Address Line 2: </label>
                            <input name="userAddressLine2" value={formData.userAddressLine2} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="state">State: </label>
                            <input name="userState" value={formData.userState} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="city">City: </label>
                            <input name="userCity" value={formData.userCity} onChange={handleChange} />
                        </p>
                        <br />
                        <p>
                            <label htmlFor="zipcode">Zip Code: </label>
                            <input name="userZipCode" value={formData.userZipCode} onChange={handleChange} />
                        </p>
                        </div>
                        <div>
                        <p>
                            <label for="image">Image: </label>
                            <input type="file" name="image" accept="image/*" onChange={handleImgChange}></input>
                            <img className="image" alt="preview" src={fileURL} />
                        </p>
                        </div>
                    </div>
                    <br />
                    <button type="submit">Create your account</button>
                </form>
            )}
        </div>
    );
}

export default Signup