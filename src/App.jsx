import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LearningHub from './components/LearningHub';
import Calculators from './components/Calculators';
import AiAssistant from './components/AiAssistant';
import Community from './components/Community';
import ProfileSettings from './components/ProfileSettings';
import AuthModal from './components/AuthModal';
import { ToastProvider } from './components/ToastContext';
import { CurrencyProvider, useCurrency } from './components/CurrencyContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </ToastProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [theme, setTheme] = useState('light');
  const [confetti, setConfetti] = useState(null);
  const [chatPrompt, setChatPrompt] = useState('');
  const { currency, setCurrency, formatAmount, currencyNames } = useCurrency();

  const fireConfetti = () => {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? '50%' : '2px'
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti(null), 4000);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('fin_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const currentUser = localStorage.getItem('fin_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
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
        completedModules: ['edu_budgeting'],
        createdAt: new Date().toISOString()
      };
      setUser(defaultGuest);
    }
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fin_current_user', JSON.stringify(updatedUser));
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
      case 'community': return 'Q&A Community Forum';
      case 'settings': return 'App Settings & Parameters';
      default: return 'Finance App';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      {/* Confetti overlay */}
      {confetti && (
        <div className="confetti-container">
          {confetti.map(p => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.left}%`,
                backgroundColor: p.color,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: p.shape,
                '--fall-delay': `${p.delay}s`,
                '--fall-duration': `${p.duration}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-blob-container">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>
      
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" className="brand-icon" onError={(e) => { e.target.src = '/favicon.png' }} />
          <span className="brand-name">EcoFinApp</span>
        </div>

        <ul className="sidebar-menu">
          <li className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('dashboard')} className="btn-press">
              <span className="menu-item-icon">📊</span> Dashboard
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'learning' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('learning')} className="btn-press">
              <span className="menu-item-icon">🎓</span> Learning Hub
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'calculators' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('calculators')} className="btn-press">
              <span className="menu-item-icon">🧮</span> Calculators
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'assistant' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('assistant')} className="btn-press">
              <span className="menu-item-icon">🤖</span> AI Assistant
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'community' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('community')} className="btn-press">
              <span className="menu-item-icon">💬</span> Community
            </button>
          </li>
          <li className={`menu-item ${currentPage === 'settings' ? 'active' : ''}`}>
            <button onClick={() => handlePageChange('settings')} className="btn-press">
              <span className="menu-item-icon">⚙️</span> Settings
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-panel">
            <div className="user-avatar pulse" style={{ animationDuration: '3s' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Guest User'}</span>
              <span className="user-role">{user?.email === 'guest@example.com' ? 'Offline Sandbox' : 'Premium Student'}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        
        <header className="top-header">
          <h1 className="page-title">{getPageTitle()}</h1>
          
          <div className="header-actions">
            {/* Currency Selector */}
            <div className="currency-selector" title="Switch currency for African markets">
              <span>💱</span>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                {Object.entries(currencyNames).map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>

            <button className="theme-toggle" onClick={handleToggleTheme} aria-label="Toggle theme" title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user && user.email !== 'guest@example.com' ? (
              <button className="auth-button logout btn-press" onClick={handleLogout}>
                Sign Out
              </button>
            ) : (
              <button 
                className="auth-button login btn-press" 
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

        <div className="content-body page-enter" key={currentPage}>
          {currentPage === 'dashboard' && (
            <Dashboard 
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onConfetti={fireConfetti}
            />
          )}
          {currentPage === 'learning' && (
            <LearningHub 
              user={user} 
              onUpdateUser={handleUpdateUser} 
              onAskAi={handleAskAi}
              onConfetti={fireConfetti}
            />
          )}
          {currentPage === 'calculators' && <Calculators user={user} />}
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
              onConfetti={fireConfetti}
            />
          )}
        </div>
      </main>

      <nav className="mobile-nav">
        <button className={`mobile-nav-btn ${currentPage === 'dashboard' ? 'active' : ''} btn-press`} onClick={() => handlePageChange('dashboard')}>
          <span className="mobile-nav-icon">📊</span>
          <span>Dashboard</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'learning' ? 'active' : ''} btn-press`} onClick={() => handlePageChange('learning')}>
          <span className="mobile-nav-icon">🎓</span>
          <span>Learning</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'calculators' ? 'active' : ''} btn-press`} onClick={() => handlePageChange('calculators')}>
          <span className="mobile-nav-icon">🧮</span>
          <span>Calculators</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'assistant' ? 'active' : ''} btn-press`} onClick={() => handlePageChange('assistant')}>
          <span className="mobile-nav-icon">🤖</span>
          <span>AI Coach</span>
        </button>
        <button className={`mobile-nav-btn ${currentPage === 'settings' ? 'active' : ''} btn-press`} onClick={() => handlePageChange('settings')}>
          <span className="mobile-nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

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
