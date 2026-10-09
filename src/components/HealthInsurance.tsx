import React, { useState } from 'react';
import type { User, HMO } from '../types';
import hmosData from '../data/hmos.json';

interface Props {
  user: User | null;
  onUpdateUser: (u: User) => void;
}

export default function HealthInsurance({ user, onUpdateUser }: Props) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const hmos = hmosData as HMO[];

  const filtered = hmos.filter(h => {
    const q = query.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q) ||
      h.coverageTypes?.some(t => t.toLowerCase().includes(q))
    ) && (!location || h.location?.toLowerCase().includes(location.toLowerCase()));
  });

  const setInsurance = (hmoId: string | undefined, status: 'none' | 'covered') => {
    if (!user) return;
    onUpdateUser({ ...user, insuranceStatus: status, hmoId });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h3 className="card-title">Health Insurance — Find an HMO</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={() => setInsurance(undefined, 'none')}>
            Mark as Uninsured
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        <strong>Disclaimer:</strong> EcoFinApp does not provide insurance or brokerage. We help you discover and connect to existing HMOs. Coverage, terms, premiums, and eligibility are determined solely by the provider. Always verify details on the provider’s official website before enrolling.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Search HMOs (name, coverage, location)" value={query} onChange={e => setQuery(e.target.value)} />
        <input placeholder="Filter by location" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(h => (
          <div key={h.id} className="card" style={{ gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0 }}>{h.name}</h4>
              {user?.hmoId === h.id && user?.insuranceStatus === 'covered' && (
                <span className="badge info">Covered (Selected)</span>
              )}
            </div>
            {h.nhiaId && <small>NHIA ID: {h.nhiaId}</small>}
            {h.location && <div>{h.location}</div>}
            {h.coverageTypes && <div>{h.coverageTypes.join(', ')}</div>}
            <small style={{ color: 'var(--text-muted)' }}>
              Source: {h.source} • Verified: {h.verifiedDate}
            </small>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {h.website && (
                <a className="btn-secondary" href={h.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
              )}
              {h.phone && <a className="btn-secondary" href={`tel:${h.phone}`}>Call</a>}
              <button className="btn-primary" onClick={() => setInsurance(h.id, 'covered')}>
                Select as My HMO
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No HMOs match your filters.</p>}
      </div>
    </div>
  );
}
