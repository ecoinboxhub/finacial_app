import React, { useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';
import { useToast } from './ToastContext';
import type { User, HealthFund } from '../types';
import { recommendHealthFund } from '../utils/healthCalculations';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
}

export default function EmergencyHealthFund({ user, onUpdateUser }: Props) {
  const { formatAmount } = useCurrency();
  const addToast = useToast();

  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 0);
  const [monthlyEssentials, setMonthlyEssentials] = useState(
    (user?.budgetHousing || 0) + (user?.budgetFood || 0) + (user?.budgetUtilities || 0)
  );
  const [currentSavings, setCurrentSavings] = useState(user?.savings || 0);
  const [monthlyHealthcare, setMonthlyHealthcare] = useState(0);
  const [insuranceStatus, setInsuranceStatus] = useState<'none' | 'covered'>(user?.insuranceStatus || 'none');

  const rec = recommendHealthFund({ monthlyIncome, monthlyEssentials, currentSavings, monthlyHealthcare, insuranceStatus });

  useEffect(() => {
    if (!user) return;
    const healthFund: HealthFund = user.healthFund || {
      balance: 0,
      target: rec.suggestedTarget,
      monthlyContribution: rec.suggestedMonthly,
      contributions: [],
    };
    if (!user.healthFund) {
      onUpdateUser({ ...user, healthFund });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const healthFund = user?.healthFund || { balance: 0, target: rec.suggestedTarget, monthlyContribution: rec.suggestedMonthly, contributions: [] };
  const progress = healthFund.target === 0 ? 0 : Math.min(100, Math.round((healthFund.balance / healthFund.target) * 100));

  const addContribution = (amt: number) => {
    if (!user || amt <= 0) return;
    const fund: HealthFund = {
      ...healthFund,
      balance: Math.round(healthFund.balance + amt),
      contributions: [
        ...healthFund.contributions,
        { amount: amt, date: new Date().toISOString() },
      ],
    };
    onUpdateUser({ ...user, healthFund: fund });
    addToast('Added to Emergency Health Fund', 'success');
  };

  const saveTarget = () => {
    if (!user) return;
    onUpdateUser({ ...user, healthFund: { ...healthFund, target: rec.suggestedTarget, monthlyContribution: rec.suggestedMonthly } });
    addToast('Health fund target updated', 'success');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 className="card-title">Emergency Health Fund</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        Financial buffer for unexpected healthcare costs. Planning aid — not a guarantee.
      </p>

      <div className="grid-2">
        <div className="card" style={{ gap: 12 }}>
          <h4 style={{ margin: 0 }}>Inputs</h4>
          <label>Monthly Income ({formatAmount(0)})</label>
          <input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(+e.target.value)} />
          <label>Monthly Essentials</label>
          <input type="number" value={monthlyEssentials} onChange={e => setMonthlyEssentials(+e.target.value)} />
          <label>Current Savings</label>
          <input type="number" value={currentSavings} onChange={e => setCurrentSavings(+e.target.value)} />
          <label>Monthly Healthcare Expenses (est.)</label>
          <input type="number" value={monthlyHealthcare} onChange={e => setMonthlyHealthcare(+e.target.value)} />
          <label>Insurance Status</label>
          <select value={insuranceStatus} onChange={e => setInsuranceStatus(e.target.value as 'none' | 'covered')}>
            <option value="none">Uninsured</option>
            <option value="covered">Has Health Insurance</option>
          </select>
          <button className="btn-primary" onClick={saveTarget}>Use Suggested Target</button>
        </div>

        <div className="card" style={{ gap: 12 }}>
          <h4 style={{ margin: 0 }}>Recommendation</h4>
          <div>Suggested Target: <strong>{formatAmount(rec.suggestedTarget)}</strong></div>
          <div>Suggested Monthly: <strong>{formatAmount(rec.suggestedMonthly)}</strong></div>
          <div>Est. Months to Target: <strong>{rec.monthsToTarget}</strong></div>
          <div>Protection: <strong>{rec.protectionStatus}</strong></div>

          <div style={{ marginTop: 8 }}>
            <div style={{ background: 'var(--bg-tertiary)', height: 8, borderRadius: 4 }}>
              <div style={{ width: `${progress}%`, height: 8, background: 'var(--color-success)', borderRadius: 4 }} />
            </div>
            <small>{progress}% of target ({formatAmount(healthFund.balance)} / {formatAmount(healthFund.target)})</small>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[1000, 2000, 5000, 10000].map(a => (
              <button key={a} className="btn-secondary" onClick={() => addContribution(a)}>{formatAmount(a)}</button>
            ))}
          </div>
          <small style={{ color: 'var(--text-muted)' }}>
            Contributions are tracked locally in your profile.
          </small>
        </div>
      </div>
    </div>
  );
}
