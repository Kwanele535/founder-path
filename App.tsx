import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomeView from './components/views/HomeView';
import LearnView from './components/views/LearnView';
import MentorView from './components/views/MentorView';
import ToolsView from './components/views/ToolsView';
import BooksView from './components/views/BooksView';
import LandingView from './components/views/LandingView';
import SplashView from './components/views/SplashView';
import AuthView from './components/views/AuthView';
import { UserState, View } from './types';

const App: React.FC = () => {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Default to LANDING view
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<UserState>({
    name: 'Founder',
    xp: 0,
    completedLessons: []
  });

  useEffect(() => {
    // Simulate initial app loading branding splash
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    const saved = localStorage.getItem('founderPathUser');
    if (saved) {
      setUser(JSON.parse(saved));
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('founderPathUser', JSON.stringify(user));
  }, [user]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleCompleteLesson = (lessonTitle: string, xpEarned: number) => {
    setUser(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        completedLessons: [...prev.completedLessons, lessonTitle]
    }));
  };

  const handleUpdateUser = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleLogin = (updates: Partial<UserState>) => {
    handleUpdateUser(updates);
    handleNavigate(View.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingView onStart={() => handleNavigate(View.AUTH)} />;
      case View.AUTH:
        return <AuthView onLogin={handleLogin} onBack={() => handleNavigate(View.LANDING)} />;
      case View.HOME:
        return <HomeView user={user} />;
      case View.LEARN:
        return <LearnView user={user} onCompleteLesson={handleCompleteLesson} />;
      case View.BOOKS:
        return <BooksView />;
      case View.MENTOR:
        return <MentorView user={user} onUpdateUser={handleUpdateUser} />;
      case View.TOOLS:
        return <ToolsView />;
      default:
        return <HomeView user={user} />;
    }
  };

  if (showSplash) {
    return <SplashView />;
  }

  // Determine if we should show navigation bar
  const showNav = currentView !== View.LANDING && currentView !== View.AUTH;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      <main className="min-h-screen">
        {renderView()}
      </main>
      
      {showNav && (
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;