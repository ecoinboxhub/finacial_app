import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CurrencyProvider, useCurrency } from '../components/CurrencyContext';

function TestComponent() {
  const { formatAmount, currency, currencyNames } = useCurrency();
  return (
    <div>
      <span data-testid="currency">{currency}</span>
      <span data-testid="formatted">{formatAmount(1000)}</span>
      <span data-testid="names">{Object.keys(currencyNames).join(',')}</span>
    </div>
  );
}

describe('CurrencyContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default USD currency', () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    );
    expect(screen.getByTestId('currency').textContent).toBe('USD');
  });

  it('formats USD correctly', () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    );
    expect(screen.getByTestId('formatted').textContent).toContain('$');
    expect(screen.getByTestId('formatted').textContent).toContain('1,000');
  });

  it('provides all currency names', () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    );
    const names = screen.getByTestId('names').textContent;
    expect(names).toContain('USD');
    expect(names).toContain('NGN');
    expect(names).toContain('KES');
    expect(names).toContain('GHS');
    expect(names).toContain('ZAR');
  });
});
