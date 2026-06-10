import React, { useState } from 'react';
import { useToast } from './ToastContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) {
  const addToast = useToast();
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'login') {
      const users = JSON.parse(localStorage.getItem('fin_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('fin_current_user', JSON.stringify(user));
        onAuthSuccess(user);
        onClose();
        addToast(`👋 Welcome back, ${user.name}!`, 'success', 3000);
      } else {
        setError('Invalid email or password.');
      }
    } else if (tab === 'signup') {
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('fin_users') || '[]');
      if (users.some(u => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = {
        name,
        email,
        password,
        balance: 15000, // starting dummy financial overview
        savings: 5000,
        investments: 8000,
        debts: 2000,
        monthlyIncome: 3500,
        budgetFood: 500,
        budgetHousing: 1200,
        budgetUtilities: 300,
        budgetSavings: 800,
        budgetInvestments: 500,
        progress: 0,
        completedModules: [],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('fin_users', JSON.stringify(users));
      localStorage.setItem('fin_current_user', JSON.stringify(newUser));
      onAuthSuccess(newUser);
      onClose();
      addToast(`🎉 Account created! Welcome, ${name}!`, 'success', 4000);
    } else if (tab === 'reset') {
      const users = JSON.parse(localStorage.getItem('fin_users') || '[]');
      const userIndex = users.findIndex(u => u.email === email);

      if (userIndex !== -1) {
        setSuccess('Password reset link simulated! Your password has been reset to "password123".');
        users[userIndex].password = 'password123';
        localStorage.setItem('fin_users', JSON.stringify(users));
        addToast('🔑 Password reset to "password123". Please log in.', 'info', 4000);
      } else {
        setError('No account found with this email.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">
          {tab === 'login' && 'Sign In'}
          {tab === 'signup' && 'Create Account'}
          {tab === 'reset' && 'Reset Password'}
        </h2>

        {error && <div className="badge danger" style={{ width: '100%', padding: '10px', marginBottom: '16px', display: 'block', textAlign: 'center' }}>{error}</div>}
        {success && <div className="badge success" style={{ width: '100%', padding: '10px', marginBottom: '16px', display: 'block', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {tab === 'signup' && (
            <div className="input-group">
              <label className="input-label-row">Full Name</label>
              <input 
                type="text" 
                className="number-input-field" 
                placeholder="John Doe" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label-row">Email Address</label>
            <input 
              type="email" 
              className="number-input-field" 
              placeholder="name@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          {tab !== 'reset' && (
            <div className="input-group">
              <label className="input-label-row">Password</label>
              <input 
                type="password" 
                className="number-input-field" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          )}

          <button type="submit" className="modal-submit-btn">
            {tab === 'login' && 'Sign In'}
            {tab === 'signup' && 'Create Account'}
            {tab === 'reset' && 'Send Reset Password Instructions'}
          </button>
        </form>

        <div className="modal-toggle-text">
          {tab === 'login' && (
            <>
              Don't have an account? 
              <button className="modal-toggle-link" onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}>Sign Up</button>
              <br />
              Forgot password? 
              <button className="modal-toggle-link" onClick={() => { setTab('reset'); setError(''); setSuccess(''); }}>Reset</button>
            </>
          )}

          {tab === 'signup' && (
            <>
              Already have an account? 
              <button className="modal-toggle-link" onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>Sign In</button>
            </>
          )}

          {tab === 'reset' && (
            <>
              Back to 
              <button className="modal-toggle-link" onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
