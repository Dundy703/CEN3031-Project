import React from 'react';
import {Link} from 'react-router-dom';
import Image from '../assets/shop.jpg';
import '../styles/Home.css';

function Home(props) {
    const {loggedIn} = props;

    return (
        <div className="home" style={{ backgroundImage: `url(${Image})`}}>
            <div className="infoBox">
                <h1> MingleMart </h1>
                {!loggedIn && <p> A groundbreaking E-commerce platform </p>}
                {loggedIn && <p> Mingle with your items! </p>}
                {!loggedIn && <Link to="/signup">
                    <button>Sign up</button>
                </Link>}
                {loggedIn && <Link to="/shop">
                    <button>Browse Items</button>
                </Link>}
                {loggedIn && <Link to="/list">
                    <button>List an Item</button>
                </Link>}
            </div>
        </div>
    )
}

export default Home