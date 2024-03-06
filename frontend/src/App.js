import './App.css';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Signup from './pages/Signup.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup" exact element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
