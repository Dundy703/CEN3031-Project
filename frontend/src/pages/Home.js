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
                {/*Show different text depending on whether user is logged in*/}
                <p> {loggedIn? "Mingle with your items!" : "A groundbreaking E-commerce platform"} </p>
                {/*If user is not logged in, display a sign up button*/}
                {!loggedIn && <Link to="/signup">
                    <button>Sign up</button>
                </Link>}
                {/*If user is logged in, display shop and list buttons*/}
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