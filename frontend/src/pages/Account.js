import React from 'react'
import Default from '../assets/pfp.png';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Account.css';

function Account(props) {
    let navigate = useNavigate();
    const [imgData, setImgData] = useState(Default);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState({});
    const [listings, setListings] = useState([]);
    const [ownAccount, setOwnAccount] = useState(true);

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    }

    function loadAccount(email) {
        setSearchValue('');
        if(email == props.email) setOwnAccount(true);
        else setOwnAccount(false);
        axios.get(`http://localhost:3001/users/findUser?userEmail=${email}`)
            .then((response) => {
                setData(response.data[0]);
            })
        axios.get(`http://localhost:3001/image/getImageFromUserEmail?userEmail=${email}`)
            .then((response) => {
                setImgData(response.data[0].ImageData);
            })
        axios.get(`http://localhost:3001/items/userItems?userEmail=${email}`)
            .then((response) => {
                setListings(response.data);
            })
    }

    function Listing(productData){
        return (
            <div className="listing">
                <div className="info">
                    <h3 className="name">{productData.ItemName}</h3>
                    <p className="price">{productData.ItemPrice}</p>
                </div>
                {!ownAccount && 
                <form className="offer" onSubmit={submitOffer}>
                    <input type="number" name={productData.ItemName} placeholder='Enter bid'></input>
                    <button>Offer</button>
                </form>
                }
            </div>
        )
    }

    function handleButton() {
        if(ownAccount) logout();
        else loadAccount(props.email);
    }

    useEffect(() => {
        if(props.email){
            loadAccount(props.email);
        }
    }, [props.email]);

    const submitOffer = (e) => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:3001/users/findUserByUsername?userUsername=${searchValue}`)
        .then((response) => {
            if(response.data.length == 0) {

            }else{
                loadAccount(response.data[0].UserEmail);
            }
        })
    }

    return (
        <div className="account">
            <div className="header">
                <div className="title">{false? 'Your Account' : `${data.UserUsername}'s Account`}</div>
                <form onSubmit={handleSubmit}><input className="lookup" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Lookup user"/></form>
            </div>
            <div className="profile-info">
                <img className="image" alt="profile" src={imgData} />
                <div className="info-text">
                    <h1>{data.UserUsername} </h1>
                    <h2>Name: {data.UserFirstName} {data.UserLastName} </h2>
                    <h2>Email: {data.UserEmail} </h2>
                    <p>Address: {data.UserAddressLine1}, {data.UserAddressLine2}<br />{data.UserCity}, {data.UserState} {data.UserZipCode}</p>
                </div>
                <div className="listings">
                    <h1>Listed Items</h1>
                    {listings.map(listing => (
                        Listing(listing)
                    ))}
                </div>
            </div>
            <button className="bottomButton" onClick={handleButton}>{ownAccount? "Log Out" : "Back to Your Account"}</button>
        </div>
    )
}

export default Account