import React from 'react'
import {Link} from 'react-router-dom';
import Image from '../assets/shop.jpg';
import '../styles/Home.css'

function Home() {
    return (
        <div className="home" style={{ backgroundImage: `url(${Image})`}}>
            <div className="infoBox">
                <h1> MingleMart </h1>
                <p> A groundbreaking E-commerce platform </p>
                <Link to="/signup">
                    <button>Sign up</button>
                </Link>
            </div>
        </div>
    )
}

export default Home