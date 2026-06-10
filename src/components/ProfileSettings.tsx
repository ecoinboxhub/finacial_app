import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';
import { api, setAuthToken } from '../api/client';
import type { User } from '../types';

interface ProfileSettingsProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onConfetti: () => void;
}

export default function ProfileSettings({ user, onUpdateUser, onLogout, onConfetti }: ProfileSettingsProps) {
  const addToast = useToast();
  const { currency, setCurrency, currencyNames } = useCurrency();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    balance: 15000,
    savings: 5000,
    investments: 8000,
    debts: 2000,
    monthlyIncome: 3500,
    budgetHousing: 1200,
    budgetFood: 500,
    budgetUtilities: 300,
    budgetSavings: 800,
    budgetInvestments: 500,
  });

  const [syncing, setSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState<string | null>(null);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        balance: user.balance ?? 15000,
        savings: user.savings ?? 5000,
        investments: user.investments ?? 8000,
        debts: user.debts ?? 2000,
        monthlyIncome: user.monthlyIncome ?? 3500,
        budgetHousing: user.budgetHousing ?? 1200,
        budgetFood: user.budgetFood ?? 500,
        budgetUtilities: user.budgetUtilities ?? 300,
        budgetSavings: user.budgetSavings ?? 800,
        budgetInvestments: user.budgetInvestments ?? 500,
      });
    }

    const storedKey = localStorage.getItem('fin_groq_key') || '';
    setApiKey(storedKey);
  }, [user]);

  const handleInputChange = (field: string, val: string | number) => {
    const numericFields = [
      'balance', 'savings', 'investments', 'debts',
      'monthlyIncome', 'budgetHousing', 'budgetFood',
      'budgetUtilities', 'budgetSavings', 'budgetInvestments',
    ];

    setProfile(prev => ({
      ...prev,
      [field]: numericFields.includes(field) ? (parseFloat(String(val)) || 0) : val,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = { ...user, ...profile };

    onUpdateUser(updatedUser);

    // Sync to backend
    try {
      await api.updateProfile(profile);
      addToast('✅ Profile synced to cloud!', 'success', 3000);
    } catch {
      addToast('✅ Profile updated locally! (Cloud sync unavailable)', 'success', 3000);
    }

    if (onConfetti) onConfetti();
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('fin_groq_key', apiKey);
    addToast('Groq API key saved. AI Coach will use the Groq API.', 'success', 3000);
  };

  const handleClearApiKey = () => {
    localStorage.setItem('fin_groq_key', 'gsk_7zJ4HU7PrMgW29qEzLh0WGdyb3FYhsuZHWoIPdvZx1BkAh16');
    setApiKey('gsk_7zJ4HU7PrMgW29qEzLh0WGdyb3FYhsuZHWoIPdvZx1BkAh16');
    addToast('Reset to default Groq API key.', 'info', 3000);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('fin_theme', nextTheme);
  };

  const handleSyncDatabase = () => {
    setSyncing(true);
    setTimeout(async () => {
      setSyncing(false);
      setSyncTime(new Date().toLocaleTimeString());

      if (user) {
        try {
          await api.updateProfile(profile);
          addToast('✅ Synced with cloud database!', 'success', 3000);
        } catch {
          // Local backup
          const users = JSON.parse(localStorage.getItem('fin_users') || '[]');
          const idx = users.findIndex((u: User) => u.email === user.email);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...profile };
            localStorage.setItem('fin_users', JSON.stringify(users));
          }
          addToast('✅ Local backup updated!', 'success', 3000);
        }
      }
    }, 1500);
    addToast('🔄 Syncing your data...', 'info', 1500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user || profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_financial_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('📥 Profile data exported as JSON!', 'success', 3000);
  };

  const handleResetApplication = () => {
    if (window.confirm('WARNING: This will clear all local storage accounts, forum posts, and progress. Proceed?')) {
      localStorage.clear();
      setAuthToken(null);
      onLogout();
      addToast('💥 Application data has been reset.', 'warning', 4000);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title">⚙️ Preferences & Themes</h3>
            <div className="settings-section-card">
              <div className="settings-row">
                <div className="settings-text-info">
                  <span className="settings-label">Color Theme</span>
                  <span className="settings-description">Toggle between Dark Mode and Light Mode</span>
                </div>
                <button className="auth-button logout" onClick={handleToggleTheme} style={{ minWidth: '110px' }}>
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
              <div className="settings-row">
                <div className="settings-text-info">
                  <span className="settings-label">Online Mode</span>
                  <span className="settings-description">{user?.email ? 'Connected to cloud' : 'Running offline'}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={!!user?.email} readOnly />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">💱 Currency Settings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Choose your preferred display currency. All financial amounts will be converted.
            </p>
            <div className="input-group">
              <label className="input-label-row">Display Currency</label>
              <select
                className="number-input-field"
                value={currency}
                onChange={e => {
                  setCurrency(e.target.value);
                  addToast(`💱 Currency changed to ${currencyNames[e.target.value]}`, 'info', 3000);
                }}
              >
                {Object.entries(currencyNames).map(([code, name]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">AI Assistant Settings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              The AI Assistant uses Groq API with the llama-3.3-70b model. A default API key is pre-configured. You can replace it with your own Groq API key here.
            </p>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label-row">
                <span>Groq API Key</span>
                <button
                  style={{ background: 'transparent', border: 'none', color: 'var(--border-focus)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </label>
              <input
                type={showKey ? 'text' : 'password'}
                className="number-input-field"
                placeholder="gsk_..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="auth-button login" onClick={handleSaveApiKey} style={{ flex: 1, justifyContent: 'center' }}>
                Save API Key
              </button>
              <button className="auth-button logout" onClick={handleClearApiKey} style={{ justifyContent: 'center' }}>
                Reset to Default
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">💾 Synchronization & Backups</h3>
            <div className="settings-section-card">
              <div className="settings-row">
                <div className="settings-text-info">
                  <span className="settings-label">Cloud Sync</span>
                  <span className="settings-description">
                    {syncTime ? `Last synced: ${syncTime}` : 'Sync local data with hosted databases'}
                  </span>
                </div>
                <button
                  className="auth-button login"
                  onClick={handleSyncDatabase}
                  disabled={syncing || !user}
                  style={{ minWidth: '120px', justifyContent: 'center' }}
                >
                  {syncing ? 'Syncing...' : '🔄 Sync Now'}
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-text-info">
                  <span className="settings-label">Export Profile Data</span>
                  <span className="settings-description">Download your settings as a JSON file</span>
                </div>
                <button className="auth-button logout" onClick={handleExportData} style={{ minWidth: '120px', justifyContent: 'center' }}>
                  📥 Export JSON
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-text-info">
                  <span className="settings-label" style={{ color: 'var(--color-danger)' }}>Hard Reset Data</span>
                  <span className="settings-description">Wipe out all sandbox local storage and profile records</span>
                </div>
                <button
                  className="auth-button logout"
                  onClick={handleResetApplication}
                  style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', minWidth: '120px', justifyContent: 'center' }}
                >
                  💥 Reset All
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">👤 Financial Profile & Budget Editor</h3>
          {user ? (
            <form onSubmit={handleSaveProfile} className="modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label-row">Full Name</label>
                  <input type="text" className="number-input-field"
                    value={profile.name} onChange={e => handleInputChange('name', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Email (Username)</label>
                  <input type="email" className="number-input-field" value={profile.email} disabled />
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '15px', marginTop: '12px', color: 'var(--color-info)' }}>
                💰 Core Capital Balances
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label-row">Liquid Checking ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.balance} onChange={e => handleInputChange('balance', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Savings Vault ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.savings} onChange={e => handleInputChange('savings', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Investments Balance ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.investments} onChange={e => handleInputChange('investments', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Total Debts ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.debts} onChange={e => handleInputChange('debts', e.target.value)} />
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '15px', marginTop: '12px', color: 'var(--color-info)' }}>
                📊 Monthly Budget Limits
              </h4>
              <div className="input-group">
                <label className="input-label-row">Monthly Income ($)</label>
                <input type="number" className="number-input-field"
                  value={profile.monthlyIncome} onChange={e => handleInputChange('monthlyIncome', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label-row">Housing Rent Budget ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.budgetHousing} onChange={e => handleInputChange('budgetHousing', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Food & Groceries ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.budgetFood} onChange={e => handleInputChange('budgetFood', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Utilities Budget ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.budgetUtilities} onChange={e => handleInputChange('budgetUtilities', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label-row">Savings Goal Allocation ($)</label>
                  <input type="number" className="number-input-field"
                    value={profile.budgetSavings} onChange={e => handleInputChange('budgetSavings', e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label-row">Monthly Investment Cap ($)</label>
                <input type="number" className="number-input-field"
                  value={profile.budgetInvestments} onChange={e => handleInputChange('budgetInvestments', e.target.value)} />
              </div>

              <button type="submit" className="modal-submit-btn" style={{ marginTop: '12px' }}>
                Update Profile Settings
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '48px' }}>👤</span>
              <p style={{ marginTop: '16px', fontWeight: '600' }}>Please log in to edit your profile and financial parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
