import React, { useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';
import type { User } from '../types';

interface DashboardProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onConfetti: () => void;
  totalModules?: number;
}

export default function Dashboard({ user, onUpdateUser, onConfetti, totalModules = 19 }: DashboardProps) {
  const addToast = useToast();
  const { formatAmount } = useCurrency();

  const name = user?.name || 'Guest User';
  const balance = user?.balance ?? 15000;
  const savings = user?.savings ?? 5000;
  const investments = user?.investments ?? 8000;
  const debts = user?.debts ?? 2000;
  const completedCount = user?.completedModules?.length || 0;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  useEffect(() => {
    addToast(`Welcome back, ${name}! Your net worth is ${formatAmount(balance + savings + investments - debts)}`, 'info', 4000);
  }, []);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const monthlyContribution = (user?.budgetSavings || 800) + (user?.budgetInvestments || 500);
  const annualRate = 0.08;

  const projectSavings = (years: number): number => {
    let total = investments + savings;
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + annualRate / 12) + monthlyContribution;
    }
    return Math.round(total);
  };

  const proj5yr = projectSavings(5);
  const proj10yr = projectSavings(10);
  const proj20yr = projectSavings(20);

  const budgetItems = [
    { name: 'Housing & Rent', spent: user?.budgetHousing || 1200, limit: user?.budgetHousing || 1200, color: '#3b82f6' },
    { name: 'Food & Groceries', spent: Math.round((user?.budgetFood || 500) * 0.82), limit: user?.budgetFood || 500, color: '#10b981' },
    { name: 'Utilities & Internet', spent: Math.round((user?.budgetUtilities || 300) * 0.93), limit: user?.budgetUtilities || 300, color: '#f59e0b' },
    { name: 'Savings Allocation', spent: user?.budgetSavings || 800, limit: user?.budgetSavings || 800, color: '#8b5cf6' },
    { name: 'Investments Allocation', spent: user?.budgetInvestments || 500, limit: user?.budgetInvestments || 500, color: '#06b6d4' },
  ];

  const netWorth = balance + savings + investments - debts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            👋 Welcome back, {name}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Your financial education journey — tailored for students, entrepreneurs, and professionals across Africa.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="market-badge">🌍 African Markets</span>
          <div className="badge info" style={{ padding: '8px 16px', fontSize: '12px' }}>
            {user?.email ? 'Online' : 'Offline Sandbox'}
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card stat-card stagger-item" style={{ animationDelay: '0s' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>💰</div>
          <div className="stat-info">
            <span className="stat-label">Net Portfolio Worth</span>
            <span className="stat-value count-up">{formatAmount(netWorth)}</span>
            <span className="stat-trend up">▲ 4.2% this month</span>
          </div>
        </div>

        <div className="card stat-card stagger-item" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--border-focus)' }}>📈</div>
          <div className="stat-info">
            <span className="stat-label">Investments & Savings</span>
            <span className="stat-value count-up">{formatAmount(savings + investments)}</span>
            <span className="stat-trend up">▲ {formatAmount(monthlyContribution)}/mo automated</span>
          </div>
        </div>

        <div className="card stat-card stagger-item" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>💳</div>
          <div className="stat-info">
            <span className="stat-label">Total Debt Balance</span>
            <span className="stat-value count-up">{formatAmount(debts)}</span>
            <span className="stat-trend down">▼ Paydown: {formatAmount(250)}/mo</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card stagger-item" style={{ animationDelay: '0.15s' }}>
          <h3 className="card-title">📊 Budget & Expense Allocations</h3>
          <div className="budget-visualizer">
            {budgetItems.map((item, idx) => {
              const percentage = Math.min(Math.round((item.spent / item.limit) * 100), 100);
              return (
                <div key={idx} className="budget-bar-group">
                  <div className="budget-label-row">
                    <span className="budget-category">{item.name}</span>
                    <span className="budget-values">{formatAmount(item.spent)} / {formatAmount(item.limit)} ({percentage}%)</span>
                  </div>
                  <div className="budget-bar-container">
                    <div
                      className="budget-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}44`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card stagger-item" style={{ animationDelay: '0.25s' }}>
          <h3 className="card-title">🎓 Financial Literacy Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '16px 0', flexWrap: 'wrap', gap: '20px' }}>
            <div className="progress-ring-container">
              <svg width="120" height="120">
                <circle
                  stroke="var(--border-color)"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring-circle"
                  stroke="var(--color-success)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="60"
                  cy="60"
                />
              </svg>
              <div className="progress-ring-label">
                <span className="progress-percent count-up">{progressPercent}%</span>
                <span className="progress-text">Modules Done</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Modules Completed</span>
                <span style={{ fontWeight: '700' }}>{completedCount} / {totalModules}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Your Rank</span>
                <span style={{ fontWeight: '700', color: 'var(--color-info)' }}>
                  {completedCount < 5 ? '🌱 Beginner' : completedCount < 12 ? '📘 Intermediate' : '🎓 Finance Scholar'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Next Milestone</span>
                <span style={{ fontWeight: '700' }}>{completedCount < 5 ? '5 Modules' : completedCount < 12 ? '12 Modules' : 'Graduate'}</span>
              </div>
            </div>
          </div>

          <div className="onboarding-tip">
            💡 <strong>Tip:</strong> Complete your learning modules to unlock the "Finance Scholar" rank. African entrepreneurs who understand compound interest build 3x more wealth over their lifetime!
          </div>
        </div>
      </div>

      <div className="card stagger-item" style={{ animationDelay: '0.3s' }}>
        <h3 className="card-title">🔮 Future Wealth Projection (8% Compounding Growth)</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          By investing/saving <strong>{formatAmount(monthlyContribution)}/month</strong>, here is how your investments would grow — even starting small, like many students and young professionals do:
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          {[
            { label: '5 Years', value: proj5yr, color: '#0284c7', width: '60%' },
            { label: '10 Years', value: proj10yr, color: '#8b5cf6', width: '80%' },
            { label: '20 Years', value: proj20yr, color: '#10b981', width: '100%' },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ flex: '1', minWidth: '150px', backgroundColor: 'var(--bg-surface-muted)', border: 'none', cursor: 'default' }}
              onMouseEnter={() => addToast(`${item.label} projection: ${formatAmount(item.value)}`, 'info', 2000)}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: item.color }}>{formatAmount(item.value)}</div>
              <div style={{ height: '4px', width: item.width, background: item.color, margin: '8px auto 0 auto', borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', padding: '14px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🌍</span>
          <span style={{ fontSize: '13px', textAlign: 'left', lineHeight: '1.4' }}>
            <strong>African Market Context:</strong> In many African economies, inflation averages 8-15%. Investing in assets that outpace inflation (stocks, bonds, real estate, T-Bills) is essential. Even {formatAmount(5000)} saved early can grow to {formatAmount(proj10yr)} in a decade with consistent contributions.
          </span>
        </div>
      </div>
    </div>
  );
}
