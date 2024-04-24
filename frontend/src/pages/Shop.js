import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/Shop.css'

function Shop() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const searchInput = prompt("What would you like to search for"); 
    if(searchInput) {
      setSearch(searchInput);
    }
  }, []);

  useEffect(() => { 
    if(search){
      axios.get(`http://localhost:3001/items/likeItems?itemName=${encodeURIComponent(search)}`)
      .then((response) => {
        setResults(response.data);
      });
    }
  }, [search]);

  useEffect(() => {
    const promises = results.map(result => {
      return Promise.all([
        axios.get(`http://localhost:3001/image/getImageFromItem?itemName=${encodeURIComponent(result.ItemName)}`),
        axios.get(`http://localhost:3001/users/findUserByID?userID=${result.Seller_ID}`)
      ]);
    });

    Promise.all(promises)
      .then(responses => {
        const items = responses.map(([imageResponse, userResponse], index) => ({
          id: index + 1,
          name: results[index].ItemName,
          seller: userResponse.data[0].UserUsername,
          price: results[index].ItemPrice,
          description: results[index].ItemDescription,
          image: imageResponse.data[0].ImageData,
        }));
        setItems(items);
      });
  }, [results])

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