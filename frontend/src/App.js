import './App.css';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import List from './pages/List.js';
import Shop from './pages/Shop.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      setLoggedIn(false);
      return;
    }

    axios.get("http://localhost:3001/auth/checkToken", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setLoggedIn("Success" == response.data.message);
      setEmail(response.data.email);
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={loggedIn}/>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/signup" exact element={<Signup setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/login" exact element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/shop" exact element={<Shop />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
