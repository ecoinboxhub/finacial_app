import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ToastProvider } from '../components/ToastContext';
import HealthProtection from '../components/HealthProtection';
import HealthEducation from '../components/HealthEducation';
import InsuranceGuide from '../components/InsuranceGuide';
import { HEALTH_EDUCATION_TOPICS } from '../data/healthEducation';
import { INSURANCE_GUIDE_STEPS } from '../data/insuranceGuide';
import type { User } from '../types';

const mockUser: User = {
  name: 'Test User',
  email: 'test@example.com',
  balance: 15000,
  savings: 5000,
  investments: 8000,
  debts: 2000,
  monthlyIncome: 3500,
  budgetHousing: 1200,
  budgetFood: 500,
  budgetUtilities: 300,
  budgetSavings: 800,
  budgetInvestments: 500,
  completedModules: ['edu_budgeting'],
  createdAt: new Date().toISOString(),
  insuranceStatus: 'none',
  healthEducationCompleted: [],
};

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('HealthProtection', () => {
  it('renders the health page header and tabs', () => {
    renderWithToast(<HealthProtection user={mockUser} onUpdateUser={() => {}} />);
    expect(screen.getByText('Health & Protection')).toBeDefined();
    expect(screen.getByText('Education')).toBeDefined();
    expect(screen.getByText('Insurance Guide')).toBeDefined();
    expect(screen.getByText('Emergency Fund')).toBeDefined();
    expect(screen.getByText('Find an HMO')).toBeDefined();
  });

  it('shows the status summary with insurance and education progress', () => {
    renderWithToast(<HealthProtection user={mockUser} onUpdateUser={() => {}} />);
    expect(screen.getByText(/Uninsured/)).toBeDefined();
    expect(screen.getByText('0 / 7 topics', { exact: true })).toBeDefined();
    expect(screen.getByText('0 / 8 steps', { exact: true })).toBeDefined();
  });

  it('opens the Education tab by default', () => {
    renderWithToast(<HealthProtection user={mockUser} onUpdateUser={() => {}} />);
    expect(screen.getByText('Health Education Library')).toBeDefined();
  });

  it('switches to the Insurance Guide tab', () => {
    renderWithToast(<HealthProtection user={mockUser} onUpdateUser={() => {}} />);
    fireEvent.click(screen.getByText('Insurance Guide'));
    expect(screen.getByText('Step-by-Step Health Insurance Guide')).toBeDefined();
    expect(screen.getByText('Frequently Asked Questions')).toBeDefined();
    expect(screen.getByText(/Guide Progress/)).toBeDefined();
  });

  it('switches to the Find an HMO tab', () => {
    renderWithToast(<HealthProtection user={mockUser} onUpdateUser={() => {}} />);
    fireEvent.click(screen.getByText('Find an HMO'));
    expect(screen.getByText(/Health Insurance . Find an HMO/)).toBeDefined();
  });
});

describe('HealthEducation', () => {
  it('renders all education topics', () => {
    renderWithToast(<HealthEducation user={mockUser} onUpdateUser={() => {}} />);
    for (const t of HEALTH_EDUCATION_TOPICS) {
      expect(screen.getAllByText(t.title).length).toBeGreaterThan(0);
    }
  });

  it('filters topics by search query', () => {
    renderWithToast(<HealthEducation user={mockUser} onUpdateUser={() => {}} />);
    const input = screen.getByPlaceholderText(/Search topics/);
    fireEvent.change(input, { target: { value: 'HMO' } });
    expect(screen.getByText(/Understanding HMOs/)).toBeDefined();
    expect(screen.queryByText(/Emergency Health Fund: Your Second Line/)).toBeNull();
  });

  it('opens a topic and shows key takeaways', () => {
    renderWithToast(<HealthEducation user={mockUser} onUpdateUser={() => {}} />);
    const readButtons = screen.getAllByText('Read Topic');
    fireEvent.click(readButtons[0]);
    expect(screen.getByText('Key Takeaways')).toBeDefined();
    expect(screen.getByText(/Back to Topics/)).toBeDefined();
  });

  it('marks a topic as complete', () => {
    let updated: User | null = null;
    renderWithToast(
      <HealthEducation
        user={mockUser}
        onUpdateUser={(u) => { updated = u; }}
      />
    );
    const readButtons = screen.getAllByText('Read Topic');
    fireEvent.click(readButtons[0]);
    fireEvent.click(screen.getByText('Mark as Complete'));
    expect(updated).not.toBeNull();
    expect((updated as unknown as User).healthEducationCompleted).toContain('health_fundamentals');
  });
});

describe('InsuranceGuide', () => {
  it('renders all guide steps', () => {
    renderWithToast(<InsuranceGuide />);
    for (const s of INSURANCE_GUIDE_STEPS) {
      expect(screen.getAllByText(s.title).length).toBeGreaterThan(0);
    }
  });

  it('expands a step and shows its actions', () => {
    renderWithToast(<InsuranceGuide />);
    const stepBtn = screen.getByText(/Learn the Plan Types/);
    fireEvent.click(stepBtn);
    expect(screen.getByText(/HMO plan \(capitation\)/)).toBeDefined();
  });

  it('renders the FAQ section', () => {
    renderWithToast(<InsuranceGuide />);
    expect(screen.getByText('Frequently Asked Questions')).toBeDefined();
    expect(screen.getAllByText(/How much does health insurance cost/).length).toBeGreaterThan(0);
  });

  it('toggles an action checkbox', () => {
    renderWithToast(<InsuranceGuide />);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    const first = checkboxes[0];
    const before = first.checked;
    fireEvent.click(first);
    expect(first.checked).toBe(!before);
  });
});
