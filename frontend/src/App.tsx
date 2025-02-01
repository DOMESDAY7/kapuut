import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Lobby from './pages/lobby';

function App() {

  return (
    <div className='font-bricolage'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lobby/:id" element={<Lobby />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
