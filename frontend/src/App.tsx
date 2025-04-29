import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import NewsPage from './pages/NewsPage';
import CalendarPage from './pages/CalendarPage';
import ResultsPage from './pages/ResultsPage';
import PlayersPage from './pages/PlayersPage';
import QuizPage from './pages/QuizPage';
import StorePage from './pages/StorePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LiveMatchPage from './pages/LiveMatchPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="furia-ui-theme">
      <Router>
        <div className="min-h-screen bg-gray-900 dark:bg-black text-white flex flex-col">
          <Navbar />
          <main className="flex-1 py-6 container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/live-match" element={<LiveMatchPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App; 