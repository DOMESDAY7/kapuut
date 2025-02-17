import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import LobbyPage from './pages/lobby';
import ProfileSetupPage from './pages/profile-setup';
import Background from './components/ui/Background';
import CreateQuizPage from './pages/create-quiz';

function App() {

  return (
    <div className='font-display'>
      <Background />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lobby/:id" element={<LobbyPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
