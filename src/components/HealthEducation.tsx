import React, { useState } from 'react';
import type { User } from '../types';
import { useToast } from './ToastContext';
import { HEALTH_EDUCATION_TOPICS, HEALTH_EDUCATION_CATEGORIES, type HealthEducationTopic } from '../data/healthEducation';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
  onAskAi?: (prompt: string) => void;
}

export default function HealthEducation({ user, onUpdateUser, onAskAi }: Props) {
  const addToast = useToast();
  const [selected, setSelected] = useState<HealthEducationTopic | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const completed = user?.healthEducationCompleted || [];
  const completedCount = HEALTH_EDUCATION_TOPICS.filter(t => completed.includes(t.id)).length;
  const progressPercent = Math.round((completedCount / HEALTH_EDUCATION_TOPICS.length) * 100);

  const filtered = HEALTH_EDUCATION_TOPICS.filter(t => {
    const q = query.toLowerCase();
    const matchesQuery =
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    const matchesCategory = category === 'All' || t.category === category;
    return matchesQuery && matchesCategory;
  });

  const markComplete = (topic: HealthEducationTopic) => {
    if (!user) {
      addToast('Sign in to track your progress', 'warning');
      return;
    }
    if (completed.includes(topic.id)) {
      addToast('Topic already completed', 'info');
      return;
    }
    const next = { ...user, healthEducationCompleted: [...completed, topic.id] };
    onUpdateUser(next);
    addToast(`Completed: ${topic.title}`, 'success');
  };

  const askAboutTopic = (topic: HealthEducationTopic) => {
    if (onAskAi) {
      onAskAi(`Explain the key points of "${topic.title}" in simple terms and give me practical next steps.`);
    } else {
      addToast('Open the AI Assistant to ask about this topic', 'info');
    }
  };

  if (selected) {
    const isDone = completed.includes(selected.id);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setSelected(null)}>← Back to Topics</button>
            {isDone && <span className="badge info">Completed</span>}
          </div>
          <h2 style={{ margin: '12px 0 4px 0', fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800 }}>{selected.title}</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            {selected.category} · {selected.readTime} read
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{selected.summary}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selected.content.map((para, idx) => (
              <p key={idx} style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Key Takeaways</h3>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selected.keyTakeaways.map((k, idx) => (
              <li key={idx} style={{ fontSize: 14, lineHeight: 1.5 }}>{k}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => markComplete(selected)} disabled={isDone}>
            {isDone ? 'Completed ✓' : 'Mark as Complete'}
          </button>
          <button className="btn-secondary" onClick={() => askAboutTopic(selected)}>Ask AI Coach About This</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Health Education Library</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px 0' }}>
          Understand health, health insurance and health financing — the knowledge base behind the Insurance Guide and your AI Coach.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div><strong>Progress:</strong> {completedCount} / {HEALTH_EDUCATION_TOPICS.length} topics ({progressPercent}%)</div>
        </div>
        <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: 4, height: 8, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ width: `${progressPercent}%`, height: 8, background: 'var(--color-success)', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          placeholder="Search topics (insurance, HMO, prevention...)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        >
          {HEALTH_EDUCATION_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(t => {
          const isDone = completed.includes(t.id);
          return (
            <div key={t.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 15 }}>{t.title}</h4>
                {isDone && <span className="badge info">Completed</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.category} · {t.readTime} read</div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.summary}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => setSelected(t)}>Read Topic</button>
                <button className="btn-secondary" onClick={() => askAboutTopic(t)}>Ask AI</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No topics match your search.</p>}
      </div>

      <div className="card" style={{ padding: 14, border: '1px dashed var(--border-color)' }}>
        <strong>Disclaimer:</strong> This content is for financial and insurance education only — it is not medical advice. For medical decisions, consult a qualified healthcare professional. For plan terms, confirm directly with your HMO.
      </div>
    </div>
  );
}
