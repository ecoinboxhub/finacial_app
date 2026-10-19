import React, { useState } from 'react';
import type { User } from '../types';
import HealthInsurance from './HealthInsurance';
import EmergencyHealthFund from './EmergencyHealthFund';
import HealthEducation from './HealthEducation';
import InsuranceGuide from './InsuranceGuide';
import { HEALTH_EDUCATION_TOPICS } from '../data/healthEducation';
import { INSURANCE_GUIDE_STEPS } from '../data/insuranceGuide';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
  onAskAi?: (prompt: string) => void;
}

type Tab = 'education' | 'guide' | 'fund' | 'insurance';

export default function HealthProtection({ user, onUpdateUser, onAskAi }: Props) {
  const [tab, setTab] = useState<Tab>('education');
  const isCovered = user?.insuranceStatus === 'covered';
  const hf = user?.healthFund;
  const hfProgress = hf && hf.target > 0 ? Math.min(100, Math.round((hf.balance / hf.target) * 100)) : 0;
  const eduDone = (user?.healthEducationCompleted || []).length;

  const guideProgressRaw = (() => {
    try {
      return JSON.parse(localStorage.getItem('fin_insurance_guide_progress') || '{}') as Record<string, string[]>;
    } catch {
      return {} as Record<string, string[]>;
    }
  })();
  const guideStepsDone = INSURANCE_GUIDE_STEPS.filter(s =>
    s.actions.every(a => (guideProgressRaw[s.id] || []).includes(a))
  ).length;

  const tabBtn = (id: Tab, label: string) => (
    <button
      className={`btn-${tab === id ? 'primary' : 'secondary'}`}
      onClick={() => setTab(id)}
      style={{ fontSize: 12, padding: '6px 10px' }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800 }}>Health & Protection</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tabBtn('education', 'Education')}
          {tabBtn('guide', 'Insurance Guide')}
          {tabBtn('fund', 'Emergency Fund')}
          {tabBtn('insurance', 'Find an HMO')}
        </div>
      </div>

      <div className="card" style={{ padding: 12, background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <div><strong>Insurance:</strong> {isCovered ? 'Covered (HMO selected)' : 'Uninsured'}</div>
          <div><strong>Health Fund:</strong> {hfProgress}% ({hf?.balance || 0} / {hf?.target || 0})</div>
          <div><strong>Education:</strong> {eduDone} / {HEALTH_EDUCATION_TOPICS.length} topics</div>
          <div><strong>Guide:</strong> {guideStepsDone} / {INSURANCE_GUIDE_STEPS.length} steps</div>
        </div>
      </div>

      {tab === 'education' && (
        <HealthEducation user={user} onUpdateUser={onUpdateUser} onAskAi={onAskAi} />
      )}
      {tab === 'guide' && (
        <InsuranceGuide onGoToHmos={() => setTab('insurance')} onAskAi={onAskAi} />
      )}
      {tab === 'fund' && <EmergencyHealthFund user={user} onUpdateUser={onUpdateUser} />}
      {tab === 'insurance' && <HealthInsurance user={user} onUpdateUser={onUpdateUser} />}
    </div>
  );
}
