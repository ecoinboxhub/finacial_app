import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';

export default function Calculators({ user }) {
  const addToast = useToast();
  const { formatAmount } = useCurrency();
  const [activeCalc, setActiveCalc] = useState('mortgage');

  const [inputs, setInputs] = useState({
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
    savingsRate: 4
  });

  const [results, setResults] = useState({
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
    savingsTotalInterest: 0
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
      const fvPrincipal = p * Math.pow(1 + r/n, n * t);
      const fvAnnuity = pm * ((Math.pow(1 + r/n, n * t) - 1) / (r/n));
      investmentFutureValue = fvPrincipal + fvAnnuity;
    }
    
    const investmentTotalInterest = Math.max(0, investmentFutureValue - investmentTotalDeposits);

    const cp = inputs.principal;
    const cr = inputs.annualReturn / 100;
    const ct = inputs.years;
    const cn = inputs.compoundingFrequency;

    const compoundFutureValue = cp * Math.pow(1 + cr/cn, cn * ct);
    const compoundTotalDeposits = cp;
    const compoundTotalInterest = Math.max(0, compoundFutureValue - cp);

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
      savingsTotalInterest: Math.round(savingsTotalInterest)
    });
  }, [inputs]);

  const handleInputChange = (name, val) => {
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(val) || 0
    }));
  };

  const handleCalcSwitch = (calc) => {
    setActiveCalc(calc);
    addToast(`Switched to ${calc.charAt(0).toUpperCase() + calc.slice(1)} Calculator`, 'info', 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="module-tabs">
        {[
          { id: 'mortgage', label: '🏡 Mortgage', emoji: '🏡' },
          { id: 'investment', label: '📈 Investment Growth', emoji: '📈' },
          { id: 'compound', label: '🔄 Compound Interest', emoji: '🔄' },
          { id: 'simple', label: '➖ Simple Interest', emoji: '➖' },
          { id: 'savings', label: '🎯 Savings Goal', emoji: '🎯' }
        ].map(calc => (
          <button 
            key={calc.id}
            className={`module-tab-btn btn-press ${activeCalc === calc.id ? 'active' : ''}`}
            onClick={() => handleCalcSwitch(calc.id)}
          >
            {calc.emoji} {calc.label}
          </button>
        ))}
      </div>

      <div className="card page-enter">
        <div className="calculator-grid">
          
          <div className="calc-inputs">
            {activeCalc === 'mortgage' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>🏡 Home Loan Details</h3>
                
                <div className="input-group">
                  <div className="input-label-row">
                    <span>Home Purchase Price</span>
                    <span className="input-val-display count-up" key={`homePrice-${inputs.homePrice}`}>{formatAmount(inputs.homePrice)}</span>
                  </div>
                  <input type="range" min="50000" max="2000000" step="10000"
                    value={inputs.homePrice} className="slider-input"
                    onChange={e => handleInputChange('homePrice', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Down Payment</span>
                    <span className="input-val-display count-up" key={`downPmt-${inputs.downPayment}`}>{formatAmount(inputs.downPayment)}</span>
                  </div>
                  <input type="range" min="0" max={inputs.homePrice} step="5000"
                    value={inputs.downPayment} className="slider-input"
                    onChange={e => handleInputChange('downPayment', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Interest Rate (Annual %)</span>
                    <span className="input-val-display">{inputs.interestRate}%</span>
                  </div>
                  <input type="range" min="1" max="15" step="0.1"
                    value={inputs.interestRate} className="slider-input"
                    onChange={e => handleInputChange('interestRate', e.target.value)} />
                </div>

                <div className="input-group">
                  <label className="input-label-row">Loan Term (Years)</label>
                  <select className="number-input-field"
                    value={inputs.mortgageTerm}
                    onChange={e => handleInputChange('mortgageTerm', e.target.value)}>
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </>
            )}

            {activeCalc === 'investment' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>📈 Investment Growth Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Starting Lump Sum</span>
                    <span className="input-val-display count-up" key={`principal-inv-${inputs.principal}`}>{formatAmount(inputs.principal)}</span>
                  </div>
                  <input type="range" min="0" max="250000" step="1000"
                    value={inputs.principal} className="slider-input"
                    onChange={e => handleInputChange('principal', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Monthly Contribution</span>
                    <span className="input-val-display">{formatAmount(inputs.monthlyContribution)}/mo</span>
                  </div>
                  <input type="range" min="0" max="5000" step="50"
                    value={inputs.monthlyContribution} className="slider-input"
                    onChange={e => handleInputChange('monthlyContribution', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Estimated Annual Return (%)</span>
                    <span className="input-val-display">{inputs.annualReturn}%</span>
                  </div>
                  <input type="range" min="1" max="25" step="0.5"
                    value={inputs.annualReturn} className="slider-input"
                    onChange={e => handleInputChange('annualReturn', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Time Horizon (Years)</span>
                    <span className="input-val-display">{inputs.years} Years</span>
                  </div>
                  <input type="range" min="1" max="40" step="1"
                    value={inputs.years} className="slider-input"
                    onChange={e => handleInputChange('years', e.target.value)} />
                </div>
              </>
            )}

            {activeCalc === 'compound' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>🔄 Compounding Setup (Lump Sum)</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Lump Sum Principal</span>
                    <span className="input-val-display count-up" key={`principal-comp-${inputs.principal}`}>{formatAmount(inputs.principal)}</span>
                  </div>
                  <input type="range" min="500" max="500000" step="500"
                    value={inputs.principal} className="slider-input"
                    onChange={e => handleInputChange('principal', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Annual Interest Rate (%)</span>
                    <span className="input-val-display">{inputs.annualReturn}%</span>
                  </div>
                  <input type="range" min="1" max="25" step="0.5"
                    value={inputs.annualReturn} className="slider-input"
                    onChange={e => handleInputChange('annualReturn', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Investment Term (Years)</span>
                    <span className="input-val-display">{inputs.years} Years</span>
                  </div>
                  <input type="range" min="1" max="50" step="1"
                    value={inputs.years} className="slider-input"
                    onChange={e => handleInputChange('years', e.target.value)} />
                </div>

                <div className="input-group">
                  <label className="input-label-row">Compounding Frequency</label>
                  <select className="number-input-field"
                    value={inputs.compoundingFrequency}
                    onChange={e => handleInputChange('compoundingFrequency', e.target.value)}>
                    <option value={1}>Annually (1x/year)</option>
                    <option value={2}>Semi-Annually (2x/year)</option>
                    <option value={4}>Quarterly (4x/year)</option>
                    <option value={12}>Monthly (12x/year)</option>
                    <option value={365}>Daily (365x/year)</option>
                  </select>
                </div>
              </>
            )}

            {activeCalc === 'simple' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>➖ Simple Interest Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Principal Amount</span>
                    <span className="input-val-display count-up" key={`simpleP-${inputs.simplePrincipal}`}>{formatAmount(inputs.simplePrincipal)}</span>
                  </div>
                  <input type="range" min="100" max="100000" step="100"
                    value={inputs.simplePrincipal} className="slider-input"
                    onChange={e => handleInputChange('simplePrincipal', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Annual Interest Rate (%)</span>
                    <span className="input-val-display">{inputs.simpleRate}%</span>
                  </div>
                  <input type="range" min="1" max="25" step="0.5"
                    value={inputs.simpleRate} className="slider-input"
                    onChange={e => handleInputChange('simpleRate', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Duration (Years)</span>
                    <span className="input-val-display">{inputs.simpleTime} Years</span>
                  </div>
                  <input type="range" min="1" max="30" step="1"
                    value={inputs.simpleTime} className="slider-input"
                    onChange={e => handleInputChange('simpleTime', e.target.value)} />
                </div>
              </>
            )}

            {activeCalc === 'savings' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>🎯 Savings Goal Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Target Savings Goal</span>
                    <span className="input-val-display count-up" key={`target-${inputs.targetSavings}`}>{formatAmount(inputs.targetSavings)}</span>
                  </div>
                  <input type="range" min="1000" max="500000" step="1000"
                    value={inputs.targetSavings} className="slider-input"
                    onChange={e => handleInputChange('targetSavings', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Starting Balance</span>
                    <span className="input-val-display">{formatAmount(inputs.startingSavings)}</span>
                  </div>
                  <input type="range" min="0" max={inputs.targetSavings} step="500"
                    value={inputs.startingSavings} className="slider-input"
                    onChange={e => handleInputChange('startingSavings', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Monthly Savings Contribution</span>
                    <span className="input-val-display">{formatAmount(inputs.savingsMonthly)}/mo</span>
                  </div>
                  <input type="range" min="10" max="5000" step="10"
                    value={inputs.savingsMonthly} className="slider-input"
                    onChange={e => handleInputChange('savingsMonthly', e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Savings APY (%)</span>
                    <span className="input-val-display">{inputs.savingsRate}% APY</span>
                  </div>
                  <input type="range" min="0" max="10" step="0.1"
                    value={inputs.savingsRate} className="slider-input"
                    onChange={e => handleInputChange('savingsRate', e.target.value)} />
                </div>
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
                  <div className="breakdown-row">
                    <span className="breakdown-label">Principal Loan Amount:</span>
                    <span className="breakdown-val">{formatAmount(inputs.homePrice - inputs.downPayment)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Cash Payments:</span>
                    <span className="breakdown-val">{formatAmount(results.mortgageTotalPayment)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Paid:</span>
                    <span className="breakdown-val">{formatAmount(results.mortgageTotalInterest)}</span>
                  </div>
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
                  <div className="breakdown-row">
                    <span className="breakdown-label">Your Principal Deposit:</span>
                    <span className="breakdown-val">{formatAmount(inputs.principal)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Monthly Contributions:</span>
                    <span className="breakdown-val">{formatAmount(inputs.monthlyContribution * 12 * inputs.years)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Earned:</span>
                    <span className="breakdown-val">{formatAmount(results.investmentTotalInterest)}</span>
                  </div>
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
                  <div className="breakdown-row">
                    <span className="breakdown-label">Initial Lump Sum:</span>
                    <span className="breakdown-val">{formatAmount(inputs.principal)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Compounded:</span>
                    <span className="breakdown-val">{formatAmount(results.compoundTotalInterest)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Compounding:</span>
                    <span className="breakdown-val">
                      {inputs.compoundingFrequency === 1 && 'Annual'}
                      {inputs.compoundingFrequency === 2 && 'Semi-Annual'}
                      {inputs.compoundingFrequency === 4 && 'Quarterly'}
                      {inputs.compoundingFrequency === 12 && 'Monthly'}
                      {inputs.compoundingFrequency === 365 && 'Daily'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeCalc === 'simple' && (
              <>
                <div>
                  <div className="calc-result-header">Total Value (Simple Interest)</div>
                  <div className="calc-main-result count-up" key={`simple-${results.simpleFutureValue}`}>{formatAmount(results.simpleFutureValue)}</div>
                </div>
                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Original Principal:</span>
                    <span className="breakdown-val">{formatAmount(inputs.simplePrincipal)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Accumulated Simple Interest:</span>
                    <span className="breakdown-val">{formatAmount(results.simpleTotalInterest)}</span>
                  </div>
                </div>
              </>
            )}

            {activeCalc === 'savings' && (
              <>
                <div>
                  <div className="calc-result-header">Estimated Time To Goal</div>
                  <div className="calc-main-result">
                    {results.savingsMonthsToGoal === 0 ? '🎯 Goal Reached!' : `${Math.floor(results.savingsMonthsToGoal / 12)}yr ${results.savingsMonthsToGoal % 12}mo`}
                  </div>
                </div>
                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Deposits Made:</span>
                    <span className="breakdown-val">{formatAmount(results.savingsTotalDeposits)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Interest Earned:</span>
                    <span className="breakdown-val">{formatAmount(results.savingsTotalInterest)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Time Required:</span>
                    <span className="breakdown-val">{results.savingsMonthsToGoal} months</span>
                  </div>
                </div>
              </>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', opacity: 0.7 }}>
              💱 All values shown in selected currency
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
