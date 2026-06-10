import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ToastProvider } from '../components/ToastContext';
import { CurrencyProvider } from '../components/CurrencyContext';
import Dashboard from '../components/Dashboard';

const mockUser = {
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
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ToastProvider>
      <CurrencyProvider>
        {ui}
      </CurrencyProvider>
    </ToastProvider>
  );
}

describe('Dashboard', () => {
  it('renders welcome message with user name', () => {
    renderWithProviders(
      <Dashboard user={mockUser} onUpdateUser={() => {}} onConfetti={() => {}} />
    );
    expect(screen.getAllByText(/Welcome back/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Test User/).length).toBeGreaterThan(0);
  });

  it('renders net worth section', () => {
    renderWithProviders(
      <Dashboard user={mockUser} onUpdateUser={() => {}} onConfetti={() => {}} />
    );
    expect(screen.getByText(/Net Portfolio Worth/i)).toBeDefined();
  });

  it('renders budget section', () => {
    renderWithProviders(
      <Dashboard user={mockUser} onUpdateUser={() => {}} onConfetti={() => {}} />
    );
    expect(screen.getByText(/Budget & Expense Allocations/i)).toBeDefined();
  });

  it('renders progress section', () => {
    renderWithProviders(
      <Dashboard user={mockUser} onUpdateUser={() => {}} onConfetti={() => {}} />
    );
    expect(screen.getByText(/Financial Literacy Progress/i)).toBeDefined();
  });

  it('renders wealth projection', () => {
    renderWithProviders(
      <Dashboard user={mockUser} onUpdateUser={() => {}} onConfetti={() => {}} />
    );
    expect(screen.getByText(/Future Wealth Projection/i)).toBeDefined();
  });
});
