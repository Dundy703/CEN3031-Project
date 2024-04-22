import './App.css';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import List from './pages/List.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');


  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={loggedIn}/>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/shop" exact element={<List />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
