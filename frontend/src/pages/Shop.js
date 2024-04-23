import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import '../styles/Shop.css'

function Shop() {
  let search = prompt("What would you like to search for");
  const items = [];
  

  /*const items = [
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
  ];*/

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("");
  const swipeThresholdright = 700;
  const swipeThresholdleft = 700; 

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
      <AnimatePresence custom={swipeDirection}>
        {items.length > 0 && currentIndex < items.length && (
          <motion.div
            key={items[currentIndex].id}
            custom={swipeDirection}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
  
export default Shop;
  