import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import LobbyPage from './pages/lobby';
import ProfileSetupPage from './pages/profile-setup';
import Background from './components/ui/Background';
import CreateQuizPage from './pages/create-quiz';
import QuizList from './pages/quizzes';
import Game from './pages/game';

function App() {

  return (
    <div className='font-display'>
      <Background />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/lobby/:id" element={<LobbyPage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
