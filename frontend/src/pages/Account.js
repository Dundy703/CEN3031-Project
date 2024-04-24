import React from 'react'
import Default from '../assets/pfp.png';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Account.css';

function Account(props) {
    let navigate = useNavigate();
    const [imgData, setImgData] = useState(Default);
    const [data, setData] = useState({});
    const {email} = props;

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    }

    function productListing(productData){
        
    }

    useEffect(() => {
        const {email} = props;
        if(email){
            axios.get(`http://localhost:3001/image/getImageFromUserEmail?userEmail=${email}`)
            .then((response) => {
                setImgData(response.data[0].ImageData);
            })
            axios.get(`http://localhost:3001/users/findUser?userEmail=${email}`)
            .then((response) => {
                setData(response.data[0]);
            })
        }
    }, [email]);

    return (

        <div className="account" onClick={logout}>
            <div className="profile-info">
                <img className="image" alt="profile picture" src={imgData} />
                <div className="info-text">
                    <h1>{data.UserUsername} </h1>
                    <h2>Name: {data.UserFirstName} {data.UserLastName} </h2>
                    <h2>Email: {data.UserEmail} </h2>
                    <p>Address: {data.UserAddressLine1}, {data.UserAddressLine2}<br />{data.UserCity}, {data.UserState} {data.UserZipCode}</p>
                </div>
            </div>
        </div>
    )
}

export default Account