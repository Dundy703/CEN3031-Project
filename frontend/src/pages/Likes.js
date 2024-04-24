import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Likes.css';

function Likes() {
    const location = useLocation();
    const likedItems = location.state?.likedItems ?? [];
    const [bids, setBids] = useState(Array(likedItems.length).fill(''));

    const handleBidChange = (index, value) => {
        const newBids = [...bids];
        newBids[index] = value;
        setBids(newBids);
    };

    const submitBid = (index) => {
        console.log(`Bid of $${bids[index]} submitted for ${likedItems[index].name}`);
    };

    return (
        <div className="likes-page">
            <h1>Liked Items</h1>
            <div className="liked-items">
                {likedItems.map((item, index) => (
                    <div key={item.id} className="liked-item">
                        <img src={item.image} alt={item.name} />
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>Price: {item.price}</p>
                        <p>Seller: {item.seller}</p>
                        <input
                            type="number"
                            placeholder="Enter your bid"
                            value={bids[index]}
                            onChange={(e) => handleBidChange(index, e.target.value)}
                        />
                        <button onClick={() => submitBid(index)}>Make Bid</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Likes;