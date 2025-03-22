import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import LobbyPage from './pages/lobby';
import Background from './components/ui/Background';
import CreateQuizPage from './pages/create-quiz';
import QuizList from './pages/quizzes';
import LeaderboardPage from './pages/leaderboard';

function App() {

  return (
    <div className='font-display'>
      <Background />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/lobby/:id" element={<LobbyPage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/leaderboard/:id" element={<LeaderboardPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
