import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom'; 
import '../styles/Shop.css';

function Shop() {
    const navigate = useNavigate();
    const items = [
      {
        id: 1,
        name: "Item 1",
        seller: "Seller A",
        price: "$10",
        description: "Description for Item 1",
        image: "https://via.placeholder.com/800x600",
      },
      {
        id: 2,
        name: "Item 2",
        seller: "Seller B",
        price: "$20",
        description: "Description for Item 2",
        image: "https://via.placeholder.com/800x600",
      },
      {
        id: 3,
        name: "Item 3",
        seller: "Seller B",
        price: "$20",
        description: "Description for Item 3",
        image: "https://via.placeholder.com/800x600",
      },
      {
        id: 4,
        name: "Item 4",
        seller: "Seller B",
        price: "$20",
        description: "Description for Item 4",
        image: "https://via.placeholder.com/800x600",
      },
      {
        id: 5,
        name: "Item 5",
        seller: "Seller B",
        price: "$20",
        description: "Description for Item 5",
        image: "https://via.placeholder.com/800x600",
      },
      // More items...
    ];
  
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedItems, setLikedItems] = useState([]);
    const [swipeDirection, setSwipeDirection] = useState('');
    const swipeThresholdright = 300;
    const swipeThresholdleft = 300;

    const swipe = (direction) => {
      setSwipeDirection(direction);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
  
    const onDragEnd = (event, info) => {
      if (info.offset.x > swipeThresholdright) {
        swipe("right");
      } else if (info.offset.x < -swipeThresholdleft) {
        swipe("left");
      }
    };

    const goToLikesPage = () => {
        navigate('/likes');
    };

    const variants = {
      enter: { x: 0, opacity: 0 },
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        transition: { duration: 0.5 },
      },
      exit: (direction) => ({
        zIndex: 0,
        x: direction === "right" ? 500 : -500,
        y: direction === "right" ? 100 : 100, // Move up for right, down for left
        rotate: direction === "right" ? 30 : -30, // Rotate the card
        opacity: 0,
        transition: { duration: 0.3 },
      }),
    };

    return (
      <div className="shop">
    <div className="shop-header">
      <h1>Welcome to the Shop</h1>
      <p>Swipe right to like an item or left to dislike it. Check your liked items by clicking the button below each card.</p>
      <input
        type="text"
        placeholder="Search items..."
        className="search-bar"
        // search logic
      />
    </div>
        
        <AnimatePresence custom={swipeDirection}>
          {items.length > 0 && currentIndex < items.length && (
            <motion.div
              key={items[currentIndex].id}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              className="card"
            >
              <img
                src={items[currentIndex].image}
                alt={items[currentIndex].name}
              />
              <h2>{items[currentIndex].name}</h2>
              <p>Seller: {items[currentIndex].seller}</p>
              <p>Price: {items[currentIndex].price}</p>
              <p>{items[currentIndex].description}</p>
              <div className="buttons">
                <button onClick={() => swipe("left")}>Dislike</button>
                <button onClick={() => swipe("right")}>Like</button>
              </div>
              <div className="view-likes">
                <button onClick={goToLikesPage} style={{ marginTop: '20px', fontSize: '16px' }}>
                  View Liked Items
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}

export default Shop;