import React, { useState, useEffect } from 'react';

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState('mortgage'); // 'mortgage' | 'investment' | 'compound' | 'simple' | 'savings'

  // Calculator Inputs
  const [inputs, setInputs] = useState({
    // Mortgage
    homePrice: 300000,
    downPayment: 60000,
    mortgageTerm: 30, // years
    interestRate: 6.5, // %
    
    // Investment / Compound
    principal: 10000,
    monthlyContribution: 500,
    years: 15,
    annualReturn: 8, // %
    compoundingFrequency: 12, // monthly

    // Simple Interest
    simplePrincipal: 5000,
    simpleRate: 5,
    simpleTime: 3, // years

    // Savings Growth
    targetSavings: 50000,
    startingSavings: 5000,
    savingsMonthly: 400,
    savingsRate: 4 // %
  });

  // Results
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

  // Re-calculate when inputs change
  useEffect(() => {
    // 1. Mortgage Calculator
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

    // 2. Investment Calculator (with Monthly Contribution)
    const p = inputs.principal;
    const pm = inputs.monthlyContribution;
    const r = inputs.annualReturn / 100;
    const t = inputs.years;
    const n = inputs.compoundingFrequency; // 12

    let investmentFutureValue = p;
    let investmentTotalDeposits = p + pm * 12 * t;
    
    if (r === 0) {
      investmentFutureValue = p + pm * 12 * t;
    } else {
      // Future value of principal: P * (1 + r/n)^(nt)
      const fvPrincipal = p * Math.pow(1 + r/n, n * t);
      // Future value of annuity: PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
      const fvAnnuity = pm * ((Math.pow(1 + r/n, n * t) - 1) / (r/n));
      investmentFutureValue = fvPrincipal + fvAnnuity;
    }
    
    const investmentTotalInterest = Math.max(0, investmentFutureValue - investmentTotalDeposits);

    // 3. Compound Interest (No continuous monthly, focus on pure lump-sum compounding frequency)
    const cp = inputs.principal;
    const cr = inputs.annualReturn / 100;
    const ct = inputs.years;
    const cn = inputs.compoundingFrequency; // e.g. 1 (Annual), 4 (Quarterly), 12 (Monthly)

    const compoundFutureValue = cp * Math.pow(1 + cr/cn, cn * ct);
    const compoundTotalDeposits = cp;
    const compoundTotalInterest = Math.max(0, compoundFutureValue - cp);

    // 4. Simple Interest Calculator
    const sp = inputs.simplePrincipal;
    const sr = inputs.simpleRate / 100;
    const st = inputs.simpleTime;
    const simpleTotalInterest = sp * sr * st;
    const simpleFutureValue = sp + simpleTotalInterest;

    // 5. Savings Growth Goal Calculator
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
        // Cap loop to prevent freeze
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Selector Tabs */}
      <div className="module-tabs">
        <button 
          className={`module-tab-btn ${activeCalc === 'mortgage' ? 'active' : ''}`}
          onClick={() => setActiveCalc('mortgage')}
        >
          🏡 Mortgage Calculator
        </button>
        <button 
          className={`module-tab-btn ${activeCalc === 'investment' ? 'active' : ''}`}
          onClick={() => setActiveCalc('investment')}
        >
          📈 Investment Growth
        </button>
        <button 
          className={`module-tab-btn ${activeCalc === 'compound' ? 'active' : ''}`}
          onClick={() => setActiveCalc('compound')}
        >
          🔄 Compound Interest
        </button>
        <button 
          className={`module-tab-btn ${activeCalc === 'simple' ? 'active' : ''}`}
          onClick={() => setActiveCalc('simple')}
        >
          ➖ Simple Interest
        </button>
        <button 
          className={`module-tab-btn ${activeCalc === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveCalc('savings')}
        >
          🎯 Savings Goal
        </button>
      </div>

      <div className="card">
        <div className="calculator-grid">
          
          {/* Inputs Section */}
          <div className="calc-inputs">
            {activeCalc === 'mortgage' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>Home Loan Details</h3>
                
                <div className="input-group">
                  <div className="input-label-row">
                    <span>Home Purchase Price</span>
                    <span className="input-val-display">${inputs.homePrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="50000" max="2000000" step="10000"
                    value={inputs.homePrice}
                    className="slider-input"
                    onChange={e => handleInputChange('homePrice', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Down Payment</span>
                    <span className="input-val-display">${inputs.downPayment.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max={inputs.homePrice} step="5000"
                    value={inputs.downPayment}
                    className="slider-input"
                    onChange={e => handleInputChange('downPayment', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Interest Rate (Annual %)</span>
                    <span className="input-val-display">{inputs.interestRate}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="15" step="0.1"
                    value={inputs.interestRate}
                    className="slider-input"
                    onChange={e => handleInputChange('interestRate', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label-row">Loan Term (Years)</label>
                  <select 
                    className="number-input-field"
                    value={inputs.mortgageTerm}
                    onChange={e => handleInputChange('mortgageTerm', e.target.value)}
                  >
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
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>Investment Growth Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Starting Lump Sum</span>
                    <span className="input-val-display">${inputs.principal.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="250000" step="1000"
                    value={inputs.principal}
                    className="slider-input"
                    onChange={e => handleInputChange('principal', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Monthly Contribution</span>
                    <span className="input-val-display">${inputs.monthlyContribution.toLocaleString()}/mo</span>
                  </div>
                  <input 
                    type="range" min="0" max="5000" step="50"
                    value={inputs.monthlyContribution}
                    className="slider-input"
                    onChange={e => handleInputChange('monthlyContribution', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Estimated Annual Return (%)</span>
                    <span className="input-val-display">{inputs.annualReturn}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="25" step="0.5"
                    value={inputs.annualReturn}
                    className="slider-input"
                    onChange={e => handleInputChange('annualReturn', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Time Horizon (Years)</span>
                    <span className="input-val-display">{inputs.years} Years</span>
                  </div>
                  <input 
                    type="range" min="1" max="40" step="1"
                    value={inputs.years}
                    className="slider-input"
                    onChange={e => handleInputChange('years', e.target.value)}
                  />
                </div>
              </>
            )}

            {activeCalc === 'compound' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>Compounding Setup (Lump Sum)</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Lump Sum Principal</span>
                    <span className="input-val-display">${inputs.principal.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="500" max="500000" step="500"
                    value={inputs.principal}
                    className="slider-input"
                    onChange={e => handleInputChange('principal', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Annual Interest Rate (%)</span>
                    <span className="input-val-display">{inputs.annualReturn}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="25" step="0.5"
                    value={inputs.annualReturn}
                    className="slider-input"
                    onChange={e => handleInputChange('annualReturn', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Investment Term (Years)</span>
                    <span className="input-val-display">{inputs.years} Years</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" step="1"
                    value={inputs.years}
                    className="slider-input"
                    onChange={e => handleInputChange('years', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label-row">Compounding Frequency</label>
                  <select 
                    className="number-input-field"
                    value={inputs.compoundingFrequency}
                    onChange={e => handleInputChange('compoundingFrequency', e.target.value)}
                  >
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
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>Simple Interest Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Principal Amount</span>
                    <span className="input-val-display">${inputs.simplePrincipal.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="100" max="100000" step="100"
                    value={inputs.simplePrincipal}
                    className="slider-input"
                    onChange={e => handleInputChange('simplePrincipal', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Annual Interest Rate (%)</span>
                    <span className="input-val-display">{inputs.simpleRate}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="25" step="0.5"
                    value={inputs.simpleRate}
                    className="slider-input"
                    onChange={e => handleInputChange('simpleRate', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Duration (Years)</span>
                    <span className="input-val-display">{inputs.simpleTime} Years</span>
                  </div>
                  <input 
                    type="range" min="1" max="30" step="1"
                    value={inputs.simpleTime}
                    className="slider-input"
                    onChange={e => handleInputChange('simpleTime', e.target.value)}
                  />
                </div>
              </>
            )}

            {activeCalc === 'savings' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px' }}>Savings Goal Settings</h3>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Target Savings Goal</span>
                    <span className="input-val-display">${inputs.targetSavings.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="500000" step="1000"
                    value={inputs.targetSavings}
                    className="slider-input"
                    onChange={e => handleInputChange('targetSavings', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Starting Balance</span>
                    <span className="input-val-display">${inputs.startingSavings.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max={inputs.targetSavings} step="500"
                    value={inputs.startingSavings}
                    className="slider-input"
                    onChange={e => handleInputChange('startingSavings', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Monthly Savings Contribution</span>
                    <span className="input-val-display">${inputs.savingsMonthly.toLocaleString()}/mo</span>
                  </div>
                  <input 
                    type="range" min="10" max="5000" step="10"
                    value={inputs.savingsMonthly}
                    className="slider-input"
                    onChange={e => handleInputChange('savingsMonthly', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label-row">
                    <span>Savings APY (%)</span>
                    <span className="input-val-display">{inputs.savingsRate}% APY</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="0.1"
                    value={inputs.savingsRate}
                    className="slider-input"
                    onChange={e => handleInputChange('savingsRate', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Results Summary Card */}
          <div className="calc-results-card">
            {activeCalc === 'mortgage' && (
              <>
                <div>
                  <div className="calc-result-header">Estimated Monthly Payment</div>
                  <div className="calc-main-result">${results.mortgageMonthly.toLocaleString()}</div>
                </div>
                
                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Principal Loan Amount:</span>
                    <span className="breakdown-val">${(inputs.homePrice - inputs.downPayment).toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Cash Payments:</span>
                    <span className="breakdown-val">${results.mortgageTotalPayment.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Paid:</span>
                    <span className="breakdown-val">${results.mortgageTotalInterest.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {activeCalc === 'investment' && (
              <>
                <div>
                  <div className="calc-result-header">Future Portfolio Value</div>
                  <div className="calc-main-result">${results.investmentFutureValue.toLocaleString()}</div>
                </div>

                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Your Principal Deposit:</span>
                    <span className="breakdown-val">${inputs.principal.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Monthly Contributions:</span>
                    <span className="breakdown-val">${(inputs.monthlyContribution * 12 * inputs.years).toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Earned:</span>
                    <span className="breakdown-val">${results.investmentTotalInterest.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {activeCalc === 'compound' && (
              <>
                <div>
                  <div className="calc-result-header">Compounded Future Value</div>
                  <div className="calc-main-result">${results.compoundFutureValue.toLocaleString()}</div>
                </div>

                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Initial Lump Sum:</span>
                    <span className="breakdown-val">${inputs.principal.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Interest Compounded:</span>
                    <span className="breakdown-val">${results.compoundTotalInterest.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Compounding Events:</span>
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
                  <div className="calc-result-header">Total Value (Simple)</div>
                  <div className="calc-main-result">${results.simpleFutureValue.toLocaleString()}</div>
                </div>

                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Original Principal:</span>
                    <span className="breakdown-val">${inputs.simplePrincipal.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Accumulated Simple Interest:</span>
                    <span className="breakdown-val">${results.simpleTotalInterest.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {activeCalc === 'savings' && (
              <>
                <div>
                  <div className="calc-result-header">Estimated Time To Goal</div>
                  <div className="calc-main-result">
                    {results.savingsMonthsToGoal === 0 ? 'Goal Reached!' : `${Math.floor(results.savingsMonthsToGoal / 12)} years, ${results.savingsMonthsToGoal % 12} months`}
                  </div>
                </div>

                <div className="calc-breakdown">
                  <div className="breakdown-row">
                    <span className="breakdown-label">Total Deposits Made:</span>
                    <span className="breakdown-val">${results.savingsTotalDeposits.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Interest Earned:</span>
                    <span className="breakdown-val">${results.savingsTotalInterest.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-label">Months Count:</span>
                    <span className="breakdown-val">{results.savingsMonthsToGoal} months total</span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
