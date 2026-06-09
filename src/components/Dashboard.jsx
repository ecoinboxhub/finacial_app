import React from 'react';

export default function Dashboard({ user, totalModules = 19 }) {
  // Safe fallbacks for user data
  const name = user?.name || 'Guest User';
  const balance = user?.balance ?? 15000;
  const savings = user?.savings ?? 5000;
  const investments = user?.investments ?? 8000;
  const debts = user?.debts ?? 2000;
  const completedCount = user?.completedModules?.length || 0;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  // SVG parameters for progress ring
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Projection logic
  const monthlyContribution = (user?.budgetSavings || 800) + (user?.budgetInvestments || 500);
  const annualRate = 0.08; // 8% expected return
  const projectSavings = (years) => {
    let total = investments + savings;
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + annualRate / 12) + monthlyContribution;
    }
    return Math.round(total);
  };

  const proj5yr = projectSavings(5);
  const proj10yr = projectSavings(10);
  const proj20yr = projectSavings(20);

  // Budget data
  const budgetItems = [
    { name: 'Housing & Rent', spent: user?.budgetHousing || 1200, limit: user?.budgetHousing || 1200, color: '#3b82f6' },
    { name: 'Food & Groceries', spent: Math.round((user?.budgetFood || 500) * 0.82), limit: user?.budgetFood || 500, color: '#10b981' },
    { name: 'Utilities & Internet', spent: Math.round((user?.budgetUtilities || 300) * 0.93), limit: user?.budgetUtilities || 300, color: '#f59e0b' },
    { name: 'Savings Allocation', spent: user?.budgetSavings || 800, limit: user?.budgetSavings || 800, color: '#8b5cf6' },
    { name: 'Investments Allocation', spent: user?.budgetInvestments || 500, limit: user?.budgetInvestments || 500, color: '#06b6d4' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome Message */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            Welcome back, {name}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Here is your financial education and investment progress overview.
          </p>
        </div>
        <div className="badge info" style={{ padding: '8px 16px', fontSize: '12px' }}>
          Offline Sandbox Mode
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid-3">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>💰</div>
          <div className="stat-info">
            <span className="stat-label">Net Portfolio Worth</span>
            <span className="stat-value">${(balance + savings + investments - debts).toLocaleString()}</span>
            <span className="stat-trend up">▲ 4.2% this month</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--border-focus)' }}>📈</div>
          <div className="stat-info">
            <span className="stat-label">Investments & Savings</span>
            <span className="stat-value">${(savings + investments).toLocaleString()}</span>
            <span className="stat-trend up">▲ ${(monthlyContribution).toLocaleString()}/mo automated</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>💳</div>
          <div className="stat-info">
            <span className="stat-label">Total Debt Balance</span>
            <span className="stat-value">${debts.toLocaleString()}</span>
            <span className="stat-trend down">▼ Paydown: $250/mo</span>
          </div>
        </div>
      </div>

      {/* Main Split Row */}
      <div className="grid-2">
        {/* Left Card: Budget Tracker */}
        <div className="card">
          <h3 className="card-title">📊 Budget & Expense Allocations</h3>
          <div className="budget-visualizer">
            {budgetItems.map((item, idx) => {
              const percentage = Math.min(Math.round((item.spent / item.limit) * 100), 100);
              return (
                <div key={idx} className="budget-bar-group">
                  <div className="budget-label-row">
                    <span className="budget-category">{item.name}</span>
                    <span className="budget-values">${item.spent} / ${item.limit} ({percentage}%)</span>
                  </div>
                  <div className="budget-bar-container">
                    <div 
                      className="budget-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}44`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Learning Progress & Goals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                <span className="progress-percent">{progressPercent}%</span>
                <span className="progress-text">Modules Done</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Modules Completed</span>
                <span style={{ fontWeight: '700' }}>{completedCount} / {totalModules}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Rank Level</span>
                <span style={{ fontWeight: '700', color: 'var(--color-info)' }}>
                  {completedCount < 5 ? 'Beginner' : completedCount < 12 ? 'Intermediate' : 'Finance Scholar'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600' }}>Next Milestone</span>
                <span style={{ fontWeight: '700' }}>{completedCount < 5 ? '5 Modules' : completedCount < 12 ? '12 Modules' : 'Graduate'}</span>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '13px', textAlign: 'center' }}>
            🔔 <strong>Tip of the Day:</strong> Invest early to let compound interest work its magic. Compounding growth builds wealth exponentially over time!
          </div>
        </div>
      </div>

      {/* Projection & Insights Section */}
      <div className="card">
        <h3 className="card-title">🔮 Future Wealth Projection (8% Compounding Growth)</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          By investing/saving your current monthly buffer of <strong>${monthlyContribution}/month</strong>, here is how your investments would grow over time:
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          <div style={{ flex: '1', minWidth: '150px', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-muted)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>5 Years</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0284c7' }}>${proj5yr.toLocaleString()}</div>
            <div style={{ height: '4px', width: '60%', background: '#0284c7', margin: '8px auto 0 auto', borderRadius: '2px' }} />
          </div>

          <div style={{ flex: '1', minWidth: '150px', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-muted)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>10 Years</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6' }}>${proj10yr.toLocaleString()}</div>
            <div style={{ height: '4px', width: '80%', background: '#8b5cf6', margin: '8px auto 0 auto', borderRadius: '2px' }} />
          </div>

          <div style={{ flex: '1', minWidth: '150px', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-muted)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>20 Years</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>${proj20yr.toLocaleString()}</div>
            <div style={{ height: '4px', width: '100%', background: '#10b981', margin: '8px auto 0 auto', borderRadius: '2px' }} />
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <span style={{ fontSize: '13px', textAlign: 'left', lineHeight: '1.4' }}>
            Compounding projections assume monthly deposits with an average annual market growth rate of 8%. Regular small savings add up significantly over 10-20 year horizons.
          </span>
        </div>
      </div>

    </div>
  );
}
