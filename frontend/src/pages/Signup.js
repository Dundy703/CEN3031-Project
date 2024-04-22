import React from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom';
import { useState } from 'react';
import '../styles/Signup.css';




function Signup() {
    function getForm(n){
        if(n == 1){
            return (
                <div className="signup">
                    <h1>Create an Account</h1>
                    <form>
                        <p>
                            <label for="email">Email: </label>
                            <input className="input" name="email"></input>
                        </p>
                        <br />
                        <p>
                            <label for="username">Username: </label>
                            <input className="input" name="username"></input>
                        </p>
                        <br />
                        <p>
                            <label for="password">Password: </label>
                            <input className="input" name="password" type="password"></input>
                        </p>
                        <br />
                        <Link>
                            <input value="Create your account" id="submit" type="submit" onClick={buttonPress}/>
                        </Link>
                    </form>
                </div>
            )
        } else{
            return (
                <div className="signup">
                    <h1>Create an Account</h1>
                    <form>
                        <p>
                            <label for="email">Name: </label>
                            <input className="input" name="email"></input>
                        </p>
                        <br />
                        <p>
                            <label for="username">last name: </label>
                            <input className="input" name="username"></input>
                        </p>
                        <br />
                        <p>
                            <label for="password">address: </label>
                            <input className="input" name="password" type="password"></input>
                        </p>
                        <br />
                        <Link to="/">
                            <input value="Create your account" id="submit" type="submit" onClick={buttonPress}/>
                        </Link>
                    </form>
                </div>
            )
        }
    }

    const [form, setForm] = useState(getForm(1));

    function buttonPress() {
        setForm(getForm(2));
        var username = document.getElementsByName("username")[0].value;
        var email = document.getElementsByName("email")[0].value;
        var password = document.getElementsByName("password")[0].value;
        const formdata = new FormData();
        formdata.append("userEmail", email);
        formdata.append("userUsername", username);
        formdata.append("userPassword", password);
        axios.post("http://localhost:3001/users/createUser", formdata).then((response) => {
            console.log(response.data);
        });
        alert(username + "email: " + email + "\npassword: " + password);
    }

    return form;
    
}

export default Signup