import React, { useState } from 'react';
import '../styles/Likes.css';

function Likes() {
    const likedItems = [
        {
            id: 1,
            name: "Liked Item 1",
            seller: "Seller A",
            price: "$15",
            description: "Description for Liked Item 1",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 2,
            name: "Liked Item 2",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 3,
            name: "Liked Item 3",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 4,
            name: "Liked Item 4",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 5,
            name: "Liked Item 5",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 6,
            name: "Liked Item 6",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        {
            id: 7,
            name: "Liked Item 7",
            seller: "Seller B",
            price: "$25",
            description: "Description for Liked Item 2",
            image: "https://via.placeholder.com/300x300"
        },
        // Add more items as needed
    ];

    const [bids, setBids] = useState(Array(likedItems.length).fill(''));

    const handleBidChange = (index, value) => {
        const newBids = [...bids];
        newBids[index] = value;
        setBids(newBids);
    };

    const submitBid = (index) => {
        alert(`Bid of $${bids[index]} submitted for ${likedItems[index].name}`);
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