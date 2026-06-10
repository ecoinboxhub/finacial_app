import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';
import BasicCalculator from './BasicCalculator';
import type { User, CalculatorInputs, CalculatorResults } from '../types';

interface CalculatorsProps {
  user: User | null;
}

function DualInput({ label, value, onChange, min, max, step, formatDisplay, slider = true }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatDisplay?: (v: number) => string;
  slider?: boolean;
}) {
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value) || 0);
  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value === '' ? '' : parseFloat(e.target.value);
    if (v === '' || (!isNaN(v) && v >= (min ?? -Infinity) && v <= (max ?? Infinity))) {
      onChange(v === '' ? 0 : v);
    }
  };

  return (
    <div className="dual-input-group">
      <div className="input-label-row">
        <span>{label}</span>
        <span className="input-val-display">
          {formatDisplay ? formatDisplay(value) : value}
        </span>
      </div>
      <div className="dual-input-row">
        {slider !== false && (
          <input
            type="range" min={min ?? 0} max={max ?? 1000000} step={step ?? 1}
            value={typeof value === 'number' ? value : 0}
            className="slider-input"
            onChange={handleSlider}
          />
        )}
        <input
          type="number"
          className="number-input-field dual-number-input"
          value={value}
          onChange={handleNumber}
          min={min}
          max={max}
          step={step ?? 1}
        />
      </div>
    </div>
  );
}

export default function Calculators({ user }: CalculatorsProps) {
  const addToast = useToast();
  const { formatAmount } = useCurrency();
  const [activeCalc, setActiveCalc] = useState<string>('mortgage');

  const [inputs, setInputs] = useState<CalculatorInputs>({
    homePrice: 300000,
    downPayment: 60000,
    mortgageTerm: 30,
    interestRate: 6.5,
    principal: 10000,
    monthlyContribution: 500,
    years: 15,
    annualReturn: 8,
    compoundingFrequency: 12,
    simplePrincipal: 5000,
    simpleRate: 5,
    simpleTime: 3,
    targetSavings: 50000,
    startingSavings: 5000,
    savingsMonthly: 400,
    savingsRate: 4,
  });

  const [results, setResults] = useState<CalculatorResults>({
    mortgageMonthly: 0,
    mortgageTotalInterest: 0,
    mortgageTotalPayment: 0,
    investmentFutureValue: 0,
    investmentTotalDeposits: 0,
    investmentTotalInterest: 0,
    compoundFutureValue: 0,
    compoundTotalDeposits: 0,
    compoundTotalInterest: 0,
    simpleTotalInterest: 0,
    simpleFutureValue: 0,
    savingsMonthsToGoal: 0,
    savingsTotalDeposits: 0,
    savingsTotalInterest: 0,
  });

  useEffect(() => {
    const loanAmount = inputs.homePrice - inputs.downPayment;
    const monthlyRate = (inputs.interestRate / 100) / 12;
    const numberOfPayments = inputs.mortgageTerm * 12;

    let mortgageMonthly = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        mortgageMonthly = loanAmount / numberOfPayments;
      } else {
        mortgageMonthly = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
    }

    const mortgageTotalPayment = mortgageMonthly * numberOfPayments;
    const mortgageTotalInterest = Math.max(0, mortgageTotalPayment - loanAmount);

    const p = inputs.principal;
    const pm = inputs.monthlyContribution;
    const r = inputs.annualReturn / 100;
    const t = inputs.years;
    const n = inputs.compoundingFrequency;

    let investmentFutureValue = p;
    let investmentTotalDeposits = p + pm * 12 * t;

    if (r === 0) {
      investmentFutureValue = p + pm * 12 * t;
    } else {
      const fvPrincipal = p * Math.pow(1 + r / n, n * t);
      const fvAnnuity = pm * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      investmentFutureValue = fvPrincipal + fvAnnuity;
    }

    const investmentTotalInterest = Math.max(0, investmentFutureValue - investmentTotalDeposits);

    const compoundFutureValue = p * Math.pow(1 + r / n, n * t);
    const compoundTotalDeposits = p;
    const compoundTotalInterest = Math.max(0, compoundFutureValue - p);

    const sp = inputs.simplePrincipal;
    const sr = inputs.simpleRate / 100;
    const st = inputs.simpleTime;
    const simpleTotalInterest = sp * sr * st;
    const simpleFutureValue = sp + simpleTotalInterest;

    const target = inputs.targetSavings;
    const start = inputs.startingSavings;
    const monthlySave = inputs.savingsMonthly;
    const sRate = inputs.savingsRate / 100 / 12;

    let savingsMonthsToGoal = 0;
    let savingsTotalDeposits = start;
    let savingsTotalInterest = 0;

    if (monthlySave > 0) {
      if (start >= target) {
        savingsMonthsToGoal = 0;
      } else {
        let currentBalance = start;
        let months = 0;
        while (currentBalance < target && months < 600) {
          currentBalance = currentBalance * (1 + sRate) + monthlySave;
          months++;
        }
        savingsMonthsToGoal = months;
        savingsTotalDeposits = start + (monthlySave * months);
        savingsTotalInterest = Math.max(0, currentBalance - savingsTotalDeposits);
      }
    }

    setResults({
      mortgageMonthly: Math.round(mortgageMonthly),
      mortgageTotalInterest: Math.round(mortgageTotalInterest),
      mortgageTotalPayment: Math.round(mortgageTotalPayment),
      investmentFutureValue: Math.round(investmentFutureValue),
      investmentTotalDeposits: Math.round(investmentTotalDeposits),
      investmentTotalInterest: Math.round(investmentTotalInterest),
      compoundFutureValue: Math.round(compoundFutureValue),
      compoundTotalDeposits: Math.round(compoundTotalDeposits),
      compoundTotalInterest: Math.round(compoundTotalInterest),
      simpleTotalInterest: Math.round(simpleTotalInterest),
      simpleFutureValue: Math.round(simpleFutureValue),
      savingsMonthsToGoal,
      savingsTotalDeposits: Math.round(savingsTotalDeposits),
      savingsTotalInterest: Math.round(savingsTotalInterest),
    });
  }, [inputs]);

  const handleInputChange = (name: string, val: number) => {
    setInputs(prev => ({ ...prev, [name]: parseFloat(String(val)) || 0 }));
  };

  const handleCalcSwitch = (calc: string) => {
    setActiveCalc(calc);
    const names: Record<string, string> = { mortgage: 'Mortgage', investment: 'Investment Growth', compound: 'Compound Interest', simple: 'Simple Interest', savings: 'Savings Goal', basic: 'Basic Calculator' };
    addToast(`Switched to ${names[calc] || calc}`, 'info', 2000);
  };

  const calcTabs = [
    { id: 'mortgage', label: '🏡 Mortgage' },
    { id: 'investment', label: '📈 Investment' },
    { id: 'compound', label: '🔄 Compound' },
    { id: 'simple', label: '➖ Simple' },
    { id: 'savings', label: '🎯 Savings' },
    { id: 'basic', label: '🔢 Basic Calc' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="module-tabs">
        {calcTabs.map(calc => (
          <button
            key={calc.id}
            className={`module-tab-btn btn-press ${activeCalc === calc.id ? 'active' : ''}`}
            onClick={() => handleCalcSwitch(calc.id)}
          >
            {calc.label}
          </button>
        ))}
      </div>

      {activeCalc === 'basic' ? (
        <BasicCalculator />
      ) : (
        <div className="card page-enter">
          <div className="calculator-grid">
            <div className="calc-inputs">
              {activeCalc === 'mortgage' && (
                <>
                  <h3 className="calc-section-title">🏡 Home Loan Details</h3>
                  <DualInput label="Home Purchase Price" value={inputs.homePrice} min={50000} max={20000000} step={10000}
                    onChange={v => handleInputChange('homePrice', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Down Payment" value={inputs.downPayment} min={0} max={inputs.homePrice} step={5000}
                    onChange={v => handleInputChange('downPayment', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Interest Rate (Annual %)" value={inputs.interestRate} min={0.1} max={30} step={0.1}
                    onChange={v => handleInputChange('interestRate', v)} formatDisplay={v => `${v}%`} />
                  <div className="input-group">
                    <label className="input-label-row">Loan Term (Years)</label>
                    <select className="number-input-field"
                      value={inputs.mortgageTerm}
                      onChange={e => handleInputChange('mortgageTerm', parseInt(e.target.value))}>
                      <option value={5}>5 Years</option>
                      <option value={10}>10 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={25}>25 Years</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>
                </>
              )}

              {activeCalc === 'investment' && (
                <>
                  <h3 className="calc-section-title">📈 Investment Growth Settings</h3>
                  <DualInput label="Starting Lump Sum" value={inputs.principal} min={0} max={10000000} step={1000}
                    onChange={v => handleInputChange('principal', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Monthly Contribution" value={inputs.monthlyContribution} min={0} max={100000} step={50}
                    onChange={v => handleInputChange('monthlyContribution', v)} formatDisplay={v => `${formatAmount(v)}/mo`} />
                  <DualInput label="Annual Return (%)" value={inputs.annualReturn} min={0.1} max={50} step={0.5}
                    onChange={v => handleInputChange('annualReturn', v)} formatDisplay={v => `${v}%`} />
                  <DualInput label="Time Horizon (Years)" value={inputs.years} min={1} max={80} step={1}
                    onChange={v => handleInputChange('years', v)} formatDisplay={v => `${v} Years`} />
                </>
              )}

              {activeCalc === 'compound' && (
                <>
                  <h3 className="calc-section-title">🔄 Compounding (Lump Sum)</h3>
                  <DualInput label="Lump Sum Principal" value={inputs.principal} min={100} max={10000000} step={500}
                    onChange={v => handleInputChange('principal', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Annual Interest Rate (%)" value={inputs.annualReturn} min={0.1} max={50} step={0.1}
                    onChange={v => handleInputChange('annualReturn', v)} formatDisplay={v => `${v}%`} />
                  <DualInput label="Investment Term (Years)" value={inputs.years} min={1} max={100} step={1}
                    onChange={v => handleInputChange('years', v)} formatDisplay={v => `${v} Years`} />
                  <div className="input-group">
                    <label className="input-label-row">Compounding Frequency</label>
                    <select className="number-input-field"
                      value={inputs.compoundingFrequency}
                      onChange={e => handleInputChange('compoundingFrequency', parseInt(e.target.value))}>
                      <option value={1}>Annually</option>
                      <option value={2}>Semi-Annually</option>
                      <option value={4}>Quarterly</option>
                      <option value={12}>Monthly</option>
                      <option value={365}>Daily</option>
                    </select>
                  </div>
                </>
              )}

              {activeCalc === 'simple' && (
                <>
                  <h3 className="calc-section-title">➖ Simple Interest Settings</h3>
                  <DualInput label="Principal Amount" value={inputs.simplePrincipal} min={100} max={10000000} step={100}
                    onChange={v => handleInputChange('simplePrincipal', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Annual Interest Rate (%)" value={inputs.simpleRate} min={0.1} max={50} step={0.1}
                    onChange={v => handleInputChange('simpleRate', v)} formatDisplay={v => `${v}%`} />
                  <DualInput label="Duration (Years)" value={inputs.simpleTime} min={0.5} max={50} step={0.5}
                    onChange={v => handleInputChange('simpleTime', v)} formatDisplay={v => `${v} Years`} />
                </>
              )}

              {activeCalc === 'savings' && (
                <>
                  <h3 className="calc-section-title">🎯 Savings Goal Settings</h3>
                  <DualInput label="Target Savings Goal" value={inputs.targetSavings} min={1000} max={10000000} step={1000}
                    onChange={v => handleInputChange('targetSavings', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Starting Balance" value={inputs.startingSavings} min={0} max={inputs.targetSavings} step={500}
                    onChange={v => handleInputChange('startingSavings', v)} formatDisplay={v => formatAmount(v)} />
                  <DualInput label="Monthly Savings" value={inputs.savingsMonthly} min={10} max={100000} step={10}
                    onChange={v => handleInputChange('savingsMonthly', v)} formatDisplay={v => `${formatAmount(v)}/mo`} />
                  <DualInput label="Savings APY (%)" value={inputs.savingsRate} min={0} max={25} step={0.1}
                    onChange={v => handleInputChange('savingsRate', v)} formatDisplay={v => `${v}% APY`} />
                </>
              )}
            </div>

            <div className="calc-results-card">
              {activeCalc === 'mortgage' && (
                <>
                  <div>
                    <div className="calc-result-header">Estimated Monthly Payment</div>
                    <div className="calc-main-result count-up" key={`mortgage-${results.mortgageMonthly}`}>{formatAmount(results.mortgageMonthly)}</div>
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row"><span className="breakdown-label">Loan Amount:</span><span className="breakdown-val">{formatAmount(inputs.homePrice - inputs.downPayment)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Total Payments:</span><span className="breakdown-val">{formatAmount(results.mortgageTotalPayment)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Total Interest:</span><span className="breakdown-val">{formatAmount(results.mortgageTotalInterest)}</span></div>
                  </div>
                </>
              )}

              {activeCalc === 'investment' && (
                <>
                  <div>
                    <div className="calc-result-header">Future Portfolio Value</div>
                    <div className="calc-main-result count-up" key={`invest-${results.investmentFutureValue}`}>{formatAmount(results.investmentFutureValue)}</div>
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row"><span className="breakdown-label">Principal:</span><span className="breakdown-val">{formatAmount(inputs.principal)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Total Contributions:</span><span className="breakdown-val">{formatAmount(inputs.monthlyContribution * 12 * inputs.years)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Interest Earned:</span><span className="breakdown-val">{formatAmount(results.investmentTotalInterest)}</span></div>
                  </div>
                </>
              )}

              {activeCalc === 'compound' && (
                <>
                  <div>
                    <div className="calc-result-header">Compounded Future Value</div>
                    <div className="calc-main-result count-up" key={`comp-${results.compoundFutureValue}`}>{formatAmount(results.compoundFutureValue)}</div>
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row"><span className="breakdown-label">Initial Sum:</span><span className="breakdown-val">{formatAmount(inputs.principal)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Interest Compounded:</span><span className="breakdown-val">{formatAmount(results.compoundTotalInterest)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Frequency:</span><span className="breakdown-val">{['', 'Annual', 'Semi-Annual', '', 'Quarterly', '', '', '', '', '', '', '', 'Monthly', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Daily'][inputs.compoundingFrequency] || 'Monthly'}</span></div>
                  </div>
                </>
              )}

              {activeCalc === 'simple' && (
                <>
                  <div>
                    <div className="calc-result-header">Total Value (Simple)</div>
                    <div className="calc-main-result count-up" key={`simple-${results.simpleFutureValue}`}>{formatAmount(results.simpleFutureValue)}</div>
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row"><span className="breakdown-label">Principal:</span><span className="breakdown-val">{formatAmount(inputs.simplePrincipal)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Interest Earned:</span><span className="breakdown-val">{formatAmount(results.simpleTotalInterest)}</span></div>
                  </div>
                </>
              )}

              {activeCalc === 'savings' && (
                <>
                  <div>
                    <div className="calc-result-header">Time To Reach Goal</div>
                    <div className="calc-main-result">
                      {results.savingsMonthsToGoal === 0 ? '🎯 Goal Reached!' : `${Math.floor(results.savingsMonthsToGoal / 12)}yr ${results.savingsMonthsToGoal % 12}mo`}
                    </div>
                  </div>
                  <div className="calc-breakdown">
                    <div className="breakdown-row"><span className="breakdown-label">Total Deposits:</span><span className="breakdown-val">{formatAmount(results.savingsTotalDeposits)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Interest Earned:</span><span className="breakdown-val">{formatAmount(results.savingsTotalInterest)}</span></div>
                    <div className="breakdown-row"><span className="breakdown-label">Total Months:</span><span className="breakdown-val">{results.savingsMonthsToGoal}</span></div>
                  </div>
                </>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', opacity: 0.7 }}>
                💱 All values in selected currency &bull; Use sliders or type directly
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
