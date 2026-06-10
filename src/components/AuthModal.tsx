import React, { useState } from 'react';
import { useToast } from './ToastContext';
import { api, setAuthToken } from '../api/client';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialTab?: 'login' | 'signup' | 'reset';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
  const addToast = useToast();
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await api.login(email, password);
        setAuthToken(res.token);
        onAuthSuccess(res.user);
        onClose();
        addToast(`👋 Welcome back, ${res.user.name}!`, 'success', 3000);
      } else if (tab === 'signup') {
        if (!name || !email || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
        const res = await api.register(name, email, password);
        setAuthToken(res.token);
        onAuthSuccess(res.user);
        onClose();
        addToast(`🎉 Account created! Welcome, ${name}!`, 'success', 4000);
      } else if (tab === 'reset') {
        const res = await api.resetPassword(email);
        setSuccess(res.message);
        addToast('🔑 Password reset to "password123". Please log in.', 'info', 4000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
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

          <button type="submit" className="modal-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : tab === 'signup' ? 'Create Account' : 'Send Reset Password Instructions'}
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
