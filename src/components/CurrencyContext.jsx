import React, { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext();

export function useCurrency() {
  return useContext(CurrencyContext);
}

const exchangeRates = {
  USD: 1,
  NGN: 1550,
  KES: 130,
  GHS: 12.5,
  ZAR: 18.2,
  EGP: 48,
  GBP: 0.79,
  EUR: 0.92
};

const currencySymbols = {
  USD: '$',
  NGN: '₦',
  KES: 'KSh',
  GHS: 'GH₵',
  ZAR: 'R',
  EGP: 'E£',
  GBP: '£',
  EUR: '€'
};

const currencyNames = {
  USD: 'US Dollar',
  NGN: 'Nigerian Naira',
  KES: 'Kenyan Shilling',
  GHS: 'Ghanaian Cedi',
  ZAR: 'South African Rand',
  EGP: 'Egyptian Pound',
  GBP: 'British Pound',
  EUR: 'Euro'
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('fin_currency') || 'USD';
  });

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    localStorage.setItem('fin_currency', code);
  }, []);

  const formatAmount = useCallback((usdAmount) => {
    const rate = exchangeRates[currency] || 1;
    const converted = (usdAmount || 0) * rate;
    const symbol = currencySymbols[currency] || '$';

    if (currency === 'NGN' || currency === 'KES') {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, exchangeRates, currencySymbols, currencyNames }}>
      {children}
    </CurrencyContext.Provider>
  );
}
