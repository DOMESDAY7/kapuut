import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Lobby from './pages/lobby';
import ProfileSetup from './pages/profile-setup';
import Background from './components/ui/Background';

function App() {

  return (
    <div className='font-display'>
      <Background />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lobby/:id" element={<Lobby />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
