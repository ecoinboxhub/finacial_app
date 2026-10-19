import React, { useState } from 'react';
import type { User, HealthFundContribution } from '../types';
import { useToast } from './ToastContext';
import { recommendHealthFund } from '../utils/healthCalculations';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
}

export default function EmergencyHealthFund({ user, onUpdateUser }: Props) {
  const addToast = useToast();
  const fund = user?.healthFund || {
    id: 'hf-default',
    name: 'Emergency Health Fund',
    target: 0,
    balance: 0,
    contributions: [] as HealthFundContribution[],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const [target, setTarget] = useState<number>(fund.target);
  const [balance, setBalance] = useState<number>(fund.balance);
  const [contribAmount, setContribAmount] = useState<number>(1000);
  const [note, setNote] = useState<string>('');
  const [showCalc, setShowCalc] = useState<boolean>(false);

  const [monthlyIncome, setMonthlyIncome] = useState<number>(user?.monthlyIncome || 0);
  const [essentials, setEssentials] = useState<number>(user?.monthlyExpenses || 0);
  const [currentSavings, setCurrentSavings] = useState<number>(user?.savings || 0);
  const [monthlyHealthcare, setMonthlyHealthcare] = useState<number>(0);
  const [insuranceStatusCalc, setInsuranceStatusCalc] = useState<'none' | 'covered'>(user?.insuranceStatus || 'none');

  const rec = recommendHealthFund({
    monthlyIncome,
    monthlyEssentials: essentials,
    currentSavings,
    monthlyHealthcare,
    insuranceStatus: insuranceStatusCalc,
  });

  const progress = fund.target > 0 ? Math.min(100, Math.round((fund.balance / fund.target) * 100)) : 0;

  const addContribution = () => {
    if (contribAmount <= 0) {
      addToast('Contribution amount must be > 0', 'warning');
      return;
    }
    const c: HealthFundContribution = {
      id: Date.now().toString(),
      amount: contribAmount,
      date: new Date().toISOString(),
      note: note.trim() || undefined,
    };
    const newFund = {
      ...fund,
      balance: Math.round((fund.balance + contribAmount) * 100) / 100,
      contributions: [c, ...fund.contributions],
      updatedAt: new Date().toISOString(),
    };
    onUpdateUser({ ...user!, healthFund: newFund });
    addToast('Added to Emergency Health Fund', 'success');
    setContribAmount(1000);
    setNote('');
    setBalance(newFund.balance);
  };

  const saveFund = () => {
    const newFund = {
      ...fund,
      target: Math.max(0, target),
      balance: Math.max(0, balance),
      updatedAt: new Date().toISOString(),
    };
    onUpdateUser({ ...user!, healthFund: newFund });
    addToast('Emergency Health Fund saved', 'success');
  };

  const applyRecommendation = () => {
    setTarget(Math.round(rec.suggestedTarget));
    addToast('Recommendation applied to target', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Emergency Health Fund</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div><strong>Progress:</strong> {progress}%</div>
            <div>{fund.balance.toLocaleString()} / {fund.target.toLocaleString()}</div>
          </div>
          <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: 8, background: 'var(--color-success)', borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Target (₦)</label>
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Current Balance (₦)</label>
            <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={saveFund}>Save Fund</button>
          <button className="btn-secondary" onClick={() => setShowCalc(!showCalc)}>{showCalc ? 'Hide Calculator' : 'Show Calculator'}</button>
        </div>
      </div>

      {showCalc && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ margin: '0 0 12px 0' }}>Health Emergency Fund Calculator</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Monthly Income (₦)</label>
              <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Monthly Essentials (₦)</label>
              <input type="number" value={essentials} onChange={(e) => setEssentials(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Current Savings (₦)</label>
              <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Monthly Healthcare (₦)</label>
              <input type="number" value={monthlyHealthcare} onChange={(e) => setMonthlyHealthcare(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Insurance Status</label>
              <select value={insuranceStatusCalc} onChange={(e) => setInsuranceStatusCalc(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <option value="none">Uninsured</option>
                <option value="covered">Covered (HMO)</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
              <div><strong>Suggested Target:</strong> ₦{Math.round(rec.suggestedTarget).toLocaleString()}</div>
              <div><strong>Suggested Monthly:</strong> ₦{Math.round(rec.suggestedMonthly).toLocaleString()}</div>
              <div><strong>Months to Target:</strong> {rec.monthsToTarget}</div>
              <div><strong>Protection Status:</strong> {rec.protectionStatus}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn-primary" onClick={applyRecommendation}>Apply Recommendation</button>
            </div>
          </div>
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Recommendation is a planning aid only, not a guarantee.</p>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Add Contribution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Amount (₦)</label>
            <input type="number" value={contribAmount} onChange={(e) => setContribAmount(Number(e.target.value))} min={0} step={500} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Salary deposit" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={addContribution}>Add Contribution</button>
        </div>

        {fund.contributions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>Contribution History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fund.contributions.map((c) => (
                <div key={c.id} className="card" style={{ padding: 10, background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <div><strong>₦{c.amount.toLocaleString()}</strong> {c.note && <span style={{ opacity: 0.8 }}> — {c.note}</span>}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(c.date).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}