import React, { useState } from 'react';
import type { User } from '../types';
import HealthInsurance from './HealthInsurance';
import EmergencyHealthFund from './EmergencyHealthFund';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
}

export default function HealthProtection({ user, onUpdateUser }: Props) {
  const [tab, setTab] = useState<'insurance' | 'fund'>('fund');
  const isCovered = user?.insuranceStatus === 'covered';
  const hf = user?.healthFund;
  const hfProgress = hf && hf.target > 0 ? Math.min(100, Math.round((hf.balance / hf.target) * 100)) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800 }}>Health & Protection</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn-${tab === 'fund' ? 'primary' : 'secondary'}`} onClick={() => setTab('fund')}>Emergency Fund</button>
          <button className={`btn-${tab === 'insurance' ? 'primary' : 'secondary'}`} onClick={() => setTab('insurance')}>Health Insurance</button>
        </div>
      </div>
      <div className='card' style={{ padding: 12, background: 'var(--bg-secondary)' }}>
        <strong>Status:</strong> {isCovered ? 'Covered (HMO selected)' : 'Uninsured'} - Fund: {hf ? `${hfProgress}%` : 'Not set'} ({hf?.balance || 0} / {hf?.target || 0})
      </div>
      {tab === 'fund' && <EmergencyHealthFund user={user} onUpdateUser={onUpdateUser} />}
      {tab === 'insurance' && <HealthInsurance user={user} onUpdateUser={onUpdateUser} />}
    </div>
  );
}
