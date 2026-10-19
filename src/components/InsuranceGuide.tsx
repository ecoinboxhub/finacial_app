import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { INSURANCE_GUIDE_STEPS, INSURANCE_GUIDE_FAQS } from '../data/insuranceGuide';

interface Props {
  onGoToHmos?: () => void;
  onAskAi?: (prompt: string) => void;
}

const STORAGE_KEY = 'fin_insurance_guide_progress';

interface GuideProgress {
  [stepId: string]: string[];
}

function loadProgress(): GuideProgress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function InsuranceGuide({ onGoToHmos, onAskAi }: Props) {
  const addToast = useToast();
  const [openStep, setOpenStep] = useState<string | null>(INSURANCE_GUIDE_STEPS[0].id);
  const [progress, setProgress] = useState<GuideProgress>(loadProgress);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const stepsCompleted = INSURANCE_GUIDE_STEPS.filter(s =>
    s.actions.every(a => (progress[s.id] || []).includes(a))
  ).length;
  const guidePercent = Math.round((stepsCompleted / INSURANCE_GUIDE_STEPS.length) * 100);

  const toggleAction = (stepId: string, action: string) => {
    setProgress(prev => {
      const current = prev[stepId] || [];
      const next = current.includes(action)
        ? current.filter(a => a !== action)
        : [...current, action];
      return { ...prev, [stepId]: next };
    });
  };

  const goNextStep = (currentIdx: number) => {
    if (currentIdx < INSURANCE_GUIDE_STEPS.length - 1) {
      const next = INSURANCE_GUIDE_STEPS[currentIdx + 1];
      setOpenStep(next.id);
      addToast(`Next: Step ${next.step} — ${next.title}`, 'info');
    } else {
      addToast('You have reached the end of the guide. Enroll and stay covered!', 'success');
    }
  };

  const askCoach = (question: string) => {
    if (onAskAi) {
      onAskAi(question);
    } else {
      addToast('Open the AI Assistant to ask your question', 'info');
    }
  };

  const quickQuestions = [
    'How do I choose the right HMO for my family?',
    'What is a waiting period in health insurance?',
    'How much should I save in my emergency health fund?',
    'Explain co-pay, premium and exclusions in simple terms.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Step-by-Step Health Insurance Guide</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px 0' }}>
          A complete path from zero to covered: assess, compare, enroll, and use your plan. Tick each action as you complete it — progress is saved on this device.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div><strong>Guide Progress:</strong> {stepsCompleted} / {INSURANCE_GUIDE_STEPS.length} steps complete ({guidePercent}%)</div>
        </div>
        <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: 4, height: 8, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ width: `${guidePercent}%`, height: 8, background: 'var(--color-success)', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onGoToHmos ? onGoToHmos() : addToast('Open the Health Insurance tab to browse HMOs', 'info')}>
            Browse HMOs Now
          </button>
          <button className="btn-secondary" onClick={() => askCoach('Give me a personalized health insurance enrollment plan based on my profile.')}>
            Ask AI for My Plan
          </button>
        </div>
      </div>

      {INSURANCE_GUIDE_STEPS.map((s, idx) => {
        const checked = progress[s.id] || [];
        const allDone = s.actions.every(a => checked.includes(a));
        const isOpen = openStep === s.id;
        return (
          <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenStep(isOpen ? null : s.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                color: 'var(--text-primary)',
              }}
            >
              <span style={{
                minWidth: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14,
                background: allDone ? 'var(--color-success)' : isOpen ? 'var(--color-info)' : 'var(--bg-tertiary)',
                color: allDone || isOpen ? '#fff' : 'var(--text-primary)',
              }}>
                {allDone ? '✓' : s.step}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>{s.title}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>{s.duration} · {checked.length}/{s.actions.length} actions done</span>
              </span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: '12px 0', color: 'var(--text-muted)' }}>{s.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.actions.map((a, aIdx) => (
                    <label key={aIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, cursor: 'pointer', lineHeight: 1.45 }}>
                      <input
                        type="checkbox"
                        checked={checked.includes(a)}
                        onChange={() => toggleAction(s.id, a)}
                        style={{ marginTop: 2, accentColor: 'var(--color-success)', width: 16, height: 16, flexShrink: 0 }}
                      />
                      <span style={{ textDecoration: checked.includes(a) ? 'line-through' : 'none', opacity: checked.includes(a) ? 0.65 : 1 }}>{a}</span>
                    </label>
                  ))}
                </div>
                {s.tip && (
                  <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 12 }}>
                    <strong>Tip:</strong> {s.tip}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={() => goNextStep(idx)}>Next Step →</button>
                  <button className="btn-secondary" onClick={() => askCoach(`I am on step ${s.step} of the health insurance guide (${s.title}). What do I need to know?`)}>
                    Ask AI About This Step
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INSURANCE_GUIDE_FAQS.map((f, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                  padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                }}
              >
                <span>{f.question}</span>
                <span style={{ opacity: 0.7 }}>{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <p style={{ margin: 0, padding: '0 12px 12px 12px', fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>{f.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Ask the AI Coach</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px 0' }}>
          The AI Financial Coach knows health insurance: HMO selection, waiting periods, costs, and pairing insurance with your Emergency Health Fund.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickQuestions.map((q, idx) => (
            <button key={idx} className="btn-secondary" style={{ fontSize: 12 }} onClick={() => askCoach(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 14, border: '1px dashed var(--border-color)' }}>
        <strong>Disclaimer:</strong> This guide is educational and does not sell insurance. Plan terms, prices and eligibility are determined solely by the HMO/NHIA — always verify details on the provider’s official channels before enrolling.
      </div>
    </div>
  );
}
