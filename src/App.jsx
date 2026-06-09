import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LearningHub from './components/LearningHub';
import Calculators from './components/Calculators';
import AiAssistant from './components/AiAssistant';
import Community from './components/Community';
import ProfileSettings from './components/ProfileSettings';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [theme, setTheme] = useState('light');
  
  // High-priority chat prompt (transfers from Learning Hub to Assistant)
  const [chatPrompt, setChatPrompt] = useState('');

  // Initial setup on mount
  useEffect(() => {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem('fin_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 2. User initialization
    const currentUser = localStorage.getItem('fin_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      // Set up a default guest user so the dashboard has active mock data out of the box!
      const defaultGuest = {
        name: 'Guest Learner',
        email: 'guest@example.com',
        balance: 12500,
        savings: 4200,
        investments: 6500,
        debts: 1800,
        monthlyIncome: 3000,
        budgetHousing: 1000,
        budgetFood: 400,
        budgetUtilities: 250,
        budgetSavings: 600,
        budgetInvestments: 400,
        completedModules: ['edu_budgeting'], // default done
        createdAt: new Date().toISOString()
      };
      setUser(defaultGuest);
    }
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fin_current_user', JSON.stringify(updatedUser));
    
    // Also update in all users list
    const users = JSON.parse(localStorage.getItem('fin_users') || '[]');
    const idx = users.findIndex(u => u.email === updatedUser.email);
    if (idx !== -1) {
      users[idx] = updatedUser;
      localStorage.setItem('fin_users', JSON.stringify(users));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fin_current_user');
    
    // Set back to a basic guest user
    const defaultGuest = {
      name: 'Guest Learner',
      email: 'guest@example.com',
      balance: 12000,
      savings: 4000,
      investments: 6000,
      debts: 1500,
      monthlyIncome: 3000,
      budgetHousing: 1000,
      budgetFood: 400,
      budgetUtilities: 250,
      budgetSavings: 600,
      budgetInvestments: 400,
      completedModules: [],
      createdAt: new Date().toISOString()
    };
    setUser(defaultGuest);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('fin_theme', nextTheme);
  };

  const handleAskAi = (prompt) => {
    setChatPrompt(prompt);
    setCurrentPage('assistant');
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Financial Dashboard';
      case 'learning': return 'Learning Academy & Hub';
      case 'calculators': return 'Financial Calculators';
      case 'assistant': return 'AI Financial Coach';
      case 'community': return 'Q&A Discussions';
      case 'settings': return 'App Settings & Parameters';
      default: return 'Finance App';
    }
  };

  return (
    <div className="app-container">
      {/* Background Blobs for Glassmorphism glow */}
      <div className="bg-blob-container">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" className="brand-icon" onError={(e) => { e.target.src = '/favicon.png' }} />
          <span className="brand-name">EcoFinApp</span>
        </div>

        <ul className="sidebar-menu">
          <li className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('dashboard')}>
              <span className="menu-item-icon">📊</span> Dashboard
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'learning' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('learning')}>
              <span className="menu-item-icon">🎓</span> Learning Hub
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'calculators' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('calculators')}>
              <span className="menu-item-icon">🧮</span> Calculators
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'assistant' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('assistant')}>
              <span className="menu-item-icon">🤖</span> AI Assistant
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'community' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('community')}>
              <span className="menu-item-icon">💬</span> Community
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'settings' ? 'active' : ''}`}>
            <button onClick={() => setCurrentPage('settings')}>
              <span className="menu-item-icon">⚙️</span> Settings
            </button>
          </li>
        </ul>

        {/* Sidebar Footer User Details */}
        <div className="sidebar-footer">
          <div className="user-panel">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Guest User'}</span>
              <span className="user-role">{user?.email === 'guest@example.com' ? 'Offline Sandbox' : 'Premium Student'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="main-area">
        
        {/* Top Header */}
        <header className="top-header">
          <h1 className="page-title">{getPageTitle()}</h1>
          
          <div className="header-actions">
            <button className="theme-toggle" onClick={handleToggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user && user.email !== 'guest@example.com' ? (
              <button className="auth-button logout" onClick={handleLogout}>
                Sign Out
              </button>
            ) : (
              <button 
                className="auth-button login" 
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
              >
                Sign In / Join
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content Body */}
        <div className="content-body">
          {currentPage === 'dashboard' && <Dashboard user={user} />}
          {currentPage === 'learning' && (
            <LearningHub 
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onAskAi={handleAskAi} 
            />
          )}
          {currentPage === 'calculators' && <Calculators />}
          {currentPage === 'assistant' && (
            <AiAssistant 
              chatPrompt={chatPrompt} 
              clearChatPrompt={() => setChatPrompt('')} 
            />
          )}
          {currentPage === 'community' && (
            <Community 
              user={user} 
              onAuthRequest={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }} 
            />
          )}
          {currentPage === 'settings' && (
            <ProfileSettings 
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onLogout={handleLogout} 
            />
          )}
        </div>
      </main>

      {/* Bottom Nav Bar (Mobile layout only) */}
      <nav className="mobile-nav">
        <button className={`mobile-nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
          <span className="mobile-nav-icon">📊</span>
          <span>Dashboard</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'learning' ? 'active' : ''}`} onClick={() => setCurrentPage('learning')}>
          <span className="mobile-nav-icon">🎓</span>
          <span>Learning</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'calculators' ? 'active' : ''}`} onClick={() => setCurrentPage('calculators')}>
          <span className="mobile-nav-icon">🧮</span>
          <span>Calculators</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'assistant' ? 'active' : ''}`} onClick={() => setCurrentPage('assistant')}>
          <span className="mobile-nav-icon">🤖</span>
          <span>AI Coach</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>
          <span className="mobile-nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Auth Modal Toggler */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={(loggedInUser) => setUser(loggedInUser)}
        initialTab={authModalTab}
      />

    </div>
  );
}

export default App;
