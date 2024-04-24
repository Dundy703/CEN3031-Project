import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../styles/Shop.css'

function Shop() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState('');
  const swipeThresholdright = 300;
  const swipeThresholdleft = 300;

  const doSearch = (e) => {
    e.preventDefault();
    const {value} = e.target[0];
    console.log(e);
    setSearch(value);
    setCurrentIndex(0);
  }

  useEffect(() => { 
    if(search){
      axios.get(`http://localhost:3001/items/likeItems?itemName=${encodeURIComponent(search)}`)
      .then((response) => {
        setResults(response.data);
      });
    }
  }, [search]);

  useEffect(() => {
    if (results.length > 0) {
      const promises = results.map(result => {
        return Promise.all([
          axios.get(`http://localhost:3001/image/getImageFromItem?itemName=${encodeURIComponent(result.ItemName)}`),
          axios.get(`http://localhost:3001/users/findUserByID?userID=${result.Seller_ID}`)
        ]);
      });

      Promise.all(promises)
      .then(responses => {
        const newItems = responses.map(([imageResponse, userResponse], index) => ({
          id: index + 1,
          name: results[index].ItemName,
          seller: userResponse.data[0].UserUsername,
          price: results[index].ItemPrice,
          description: results[index].ItemDescription,
          image: imageResponse.data[0].ImageData,
          isEndCard: false, // Default to false for normal items
        }));

        // Append the end card to the array
        const endCard = {
          id: 'endCard',
          name: 'No Results',
          seller: '',
          price: '',
          description: 'No more items that match or make a new search',
          image: '', // You could add a default or placeholder image if desired
          isEndCard: true, // Custom property to identify this special card
        };
        setItems([...newItems, endCard]);
      });
  } else {
    // If there are no results, just show the end card
    const endCardOnly = [{
      id: 'endCard',
      name: 'No Results',
      seller: '',
      price: '',
      description: 'No more items that match or make a new search',
      image: '', // You could add a default or placeholder image if desired
      isEndCard: true,
    }];
    setItems(endCardOnly);
  }
}, [results]);
/*
  useEffect(() => {
    if (items.length > 0 && currentIndex < items.length && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex, items.length]);*/


  const swipe = (direction) => {
    if (currentIndex < items.length) {
      if (!items[currentIndex].isEndCard) {
        setSwipeDirection(direction); // Make sure this is set correctly here
        if (direction === "right") {
          setLikedItems(prevLikedItems => [...prevLikedItems, items[currentIndex]]);
        }
        setCurrentIndex(currentIndex + 1);
      }
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
      navigate('/likes', { state: { likedItems } });
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
          <form onSubmit={doSearch}>
            <input
              type="text"
              placeholder="Search items..."
              className="search-bar"
            />
          </form>
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
              ref={currentIndex === items.length - 1 ? null : ref}  // Don't attach ref if it's the last card
            >
              <div className='img-box'>
                {items[currentIndex].image && <img src={items[currentIndex].image} alt={items[currentIndex].name} />}
              </div>
              <h2>{items[currentIndex].name}</h2>
              {items[currentIndex].isEndCard ? (
                <p>{items[currentIndex].description}</p>  // Simple message for the end card
              ) : (
                <>
                  <p>Seller: {items[currentIndex].seller}</p>
                  <p>Price: {items[currentIndex].price}</p>
                  <p>{items[currentIndex].description}</p>
                  <div className="buttons">
                    <button onClick={() => swipe("left")}>Dislike</button>
                    <button onClick={() => swipe("right")}>Like</button>
                  </div>
                </>
              )}
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