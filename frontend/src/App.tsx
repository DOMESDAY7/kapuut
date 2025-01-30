import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';

function App() {

  return (
    <div className='font-bricolage'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lobby/:id" element={<About />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
