import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FuriBot from './components/FuriBot';
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
import QuizzesPage from './pages/QuizzesPage';
import MatchOverview from './pages/MatchOverview';
import SearchPage from './pages/SearchPage';

type FuriBotContextType = {
  isOpen: boolean; 
  openFuriBot: () => void;
  closeFuriBot: () => void;
  toggleFuriBot: () => void;
};

export const FuriBotContext = React.createContext<FuriBotContextType>({
  isOpen: false,
  openFuriBot: () => {},
  closeFuriBot: () => {},
  toggleFuriBot: () => {}
});

type FuriBotWrapperProps = {
  onSendMessage: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const FuriBotWrapper: React.FC<FuriBotWrapperProps> = (props) => {
  return <FuriBot {...props} />;
};

const App: React.FC = () => {
  const [isFuriBotOpen, setIsFuriBotOpen] = useState(false);

  const openFuriBot = () => setIsFuriBotOpen(true);
  const closeFuriBot = () => setIsFuriBotOpen(false);
  const toggleFuriBot = () => setIsFuriBotOpen(prev => !prev);

  const handleFuriBotMessage = (message: string) => {
    // Implementação futura: sistema de logging, notificações, etc.
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="furia-ui-theme">
      <FuriBotContext.Provider value={{ 
        isOpen: isFuriBotOpen, 
        openFuriBot, 
        closeFuriBot, 
        toggleFuriBot 
      }}>
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
                <Route path="/quiz" element={<QuizzesPage />} />
                <Route path="/quiz/:quizId" element={<QuizPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/live-match" element={<LiveMatchPage />} />
                <Route path="/match/:matchId" element={<MatchOverview />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            
            <FuriBotWrapper 
              onSendMessage={handleFuriBotMessage}
              isOpen={isFuriBotOpen}
              onClose={closeFuriBot}
              onToggle={toggleFuriBot}
            />
          </div>
        </Router>
      </FuriBotContext.Provider>
    </ThemeProvider>
  );
};

export default App; 