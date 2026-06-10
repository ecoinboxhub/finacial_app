import React, { useState } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';
import { api } from '../api/client';
import type { User, EducationModule, PlatformEntry } from '../types';

interface LearningHubProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onAskAi: (prompt: string) => void;
  onConfetti: () => void;
}

const educationModules: EducationModule[] = [
  {
    id: 'edu_budgeting',
    title: 'Budgeting & Expense Allocation',
    level: 'Beginner',
    category: 'Education',
    desc: 'Learn how to partition and track your income using popular frameworks like 50/30/20 rule to maintain positive cash flow.',
    explanation: 'Budgeting is the foundation of financial wellness. It involves tracking your income and mapping out categories for expenses. By setting limits, you avoid overspending and guarantee regular savings for future goals. A popular method is the 50/30/20 rule: 50% on Needs (rent, bills, food), 30% on Wants (entertainment, dining out), and 20% on Savings or Debt repayment.',
    benefits: ['Guarantees you live below your means', 'Reduces financial anxiety by planning ahead', 'Creates a clear path to save for milestones'],
    risks: ['Can feel restrictive if too rigid', 'Requires disciplined tracking of small expenses', 'Unexpected emergencies can disrupt strict plans'],
    example: `If your monthly income is $4,000, allocate $2,000 to needs, $1,200 to wants, and $800 to savings/investments.`,
  },
  {
    id: 'edu_savings',
    title: 'Savings & High-Yield Accounts',
    level: 'Beginner',
    category: 'Education',
    desc: 'Understand the power of emergency funds and how high-yield savings accounts outpace traditional banking.',
    explanation: 'Saving is setting money aside rather than spending it immediately. A vital first step is building an Emergency Fund—ideally 3 to 6 months of living expenses. Traditional savings accounts pay minimal interest (often 0.01%), whereas High-Yield Savings Accounts (HYSAs) or money market funds pay much higher rates, helping your money grow securely with compound interest.',
    benefits: ['Ensures cash availability during emergencies', 'HYSAs offer low-risk interest compounding', 'Insured up to $250,000 by FDIC or equivalent local deposit insurance'],
    risks: ['Inflation can slowly erode purchasing power', 'Low-yield accounts offer virtually zero growth', 'Some accounts penalize early withdrawals'],
    example: `Placing your emergency fund of $10,000 in a HYSA earning 4.5% APY yields $450 in interest over a year — far more than a standard savings account.`,
  },
  {
    id: 'edu_banking',
    title: 'Banking & Core Finance Systems',
    level: 'Beginner',
    category: 'Education',
    desc: 'Navigate checking, savings accounts, credit unions, mobile money (M-Pesa, Airtel Money), and basic banking protocols.',
    explanation: 'Banking serves as the secure vault for your daily financial transactions. In Africa, mobile money platforms like M-Pesa (Kenya), Airtel Money, and MoMo have revolutionized banking, allowing millions to send, save, and borrow from their phones. Understanding bank transfers, e-wallets, and digital banking helps you avoid fees and manage cash flow efficiently.',
    benefits: ['Secure environment for liquid funds', 'Access to mobile money and digital payments', 'Establishes a financial footprint for future loans'],
    risks: ['Maintenance fees and overdraft penalties', 'Card fraud and SIM swap scams require vigilance', 'Low interest returns compared to investment assets'],
    example: 'Using M-Pesa in Kenya, over 30 million people send money, pay bills, and access microloans (KSh 500-50,000) directly from their mobile phones without a traditional bank account.',
  },
  {
    id: 'edu_credit',
    title: 'Credit & Debt Management',
    level: 'Intermediate',
    category: 'Education',
    desc: 'Decipher credit scores, interest rates, and active strategies for paying down debt like avalanche and snowball.',
    explanation: 'Credit is your ability to borrow money based on trust that you will repay it. Your Credit Score represents this trustworthiness. High-interest debt, like credit card debt, can drain your wealth rapidly. Effective repayment methods include the Snowball Method (paying smallest balances first for psychological wins) and the Avalanche Method (paying highest interest rate debts first to minimize overall interest).',
    benefits: ['High credit score unlocks low interest rates on loans', 'Credit cards offer rewards and purchase protections', 'Strategic debt can fund appreciating assets'],
    risks: ['High-interest rates compound quickly against you', 'Missed payments severely drag down credit scores', 'Overborrowing leads to debt spirals'],
    example: 'A borrower with a strong credit profile qualifies for a 6% mortgage rate, while someone with poor credit might get 12%, costing hundreds of thousands extra in interest.',
  },
  {
    id: 'edu_mortgage',
    title: 'Mortgage & Homeownership',
    level: 'Intermediate',
    category: 'Education',
    desc: 'Demystify down payments, fixed vs adjustable rates, and home buying closing procedures.',
    explanation: 'A mortgage is a long-term loan specifically utilized to buy real estate. The property serves as collateral. Mortgages are typically structured as 15 or 30-year terms. They come in two primary types: Fixed-Rate Mortgages (interest rate stays identical for the duration) and Adjustable-Rate Mortgages (ARMs, interest rate fluctuates based on the market after an initial period).',
    benefits: ['Builds equity and ownership in a hard asset', 'Home values historically appreciate over the long term', 'Mortgage interest payments can be tax-deductible'],
    risks: ['Requires large upfront capital (down payment and closing costs)', 'Defaults lead to foreclosure and total loss of the property', 'Maintenance, property taxes, and insurance add ongoing costs'],
    example: `Buying a home with a 20% down payment of $60,000 on a $300,000 property. At 6.5% fixed interest, the monthly payment is approximately $1,517.`,
  },
  {
    id: 'edu_retirement',
    title: 'Retirement Planning & Pension',
    level: 'Advanced',
    category: 'Education',
    desc: 'Unlock retirement vehicles like 401(k), pension schemes (RSA in Nigeria, NSSF in Kenya), and IRAs for tax-advantaged compounding.',
    explanation: 'Retirement planning is the process of setting aside wealth during your working years for when you stop working. In Africa, pension schemes like Nigeria\'s RSA (Retirement Savings Account) and Kenya\'s NSSF provide mandatory retirement contributions. For self-employed individuals, voluntary pension plans and investments in stocks, bonds, or real estate are critical for building retirement nest eggs.',
    benefits: ['Tax-advantaged compounding growth', 'Employer matching contributions are free money', 'Mandatory pension schemes provide a safety net'],
    risks: ['Penalties for early withdrawals', 'Market fluctuations can decrease balances temporarily', 'Some pension funds have high administrative fees'],
    example: `Contributing $200 monthly to a retirement account from age 25 to 55. With an average 8% return, you could accumulate over $300,000 for retirement.`,
  },
];

const investmentModules: EducationModule[] = [
  {
    id: 'inv_mutual', title: 'Mutual Funds & ETFs', level: 'Beginner', category: 'Investment',
    desc: 'Understand diversified index funds and exchange-traded funds to track stock markets safely.',
    explanation: 'Mutual Funds and ETFs pool capital from thousands of investors to buy a diversified basket of stocks, bonds, or other assets. Instead of buying individual shares of a single company (which is risky), you purchase a tiny slice of hundreds of companies. Index funds track a market benchmark like the S&P 500 or NGX 30 (Nigeria), offering automatic diversification.',
    benefits: ['Instant diversification reduces individual company risk', 'ETFs can be bought and sold throughout the trading day', 'Low fees for passive index funds'],
    risks: ['No control over individual companies held in the fund', 'Some actively managed funds carry high management fees', 'Subject to general stock market downturns'],
    example: 'An S&P 500 ETF spreads your investment across Apple, Microsoft, Amazon, and 497 other leading companies, guarding you if any single company fails.',
  },
  {
    id: 'inv_bonds', title: 'Bonds & Fixed Income', level: 'Beginner', category: 'Investment',
    desc: 'Learn how government and corporate debt securities act as reliable portfolio stabilizers.',
    explanation: 'Bonds are debt instruments. When you buy a bond, you are lending capital to an entity (like a government or corporation) in exchange for regular interest payments (coupons) and the return of the bond\'s face value at maturity.',
    benefits: ['Highly predictable income payments', 'Much lower volatility than stocks', 'Government bonds are backed by the issuing nation'],
    risks: ['Lower potential returns compared to equities', 'Bond prices drop when interest rates rise', 'Inflation can outpace the fixed return rate'],
    example: 'Many African governments issue Eurobonds and local currency bonds. A Nigerian 10-year FGN Bond might yield 12-14% annually.',
  },
  {
    id: 'inv_stocks', title: 'Stocks & Equity Markets', level: 'Intermediate', category: 'Investment',
    desc: 'Demystify public equity ownership, dividends, capital gains, and stock valuation metrics.',
    explanation: 'Stocks (equities) represent fractional ownership in a corporation. When you purchase a share, you own a tiny portion of the company\'s assets and earnings. Wealth is built through Capital Gains and Dividends.',
    benefits: ['Historically high long-term returns (~10% annually)', 'Liquidity (easily sold on exchange markets)', 'Opportunity to participate in company growth'],
    risks: ['High volatility (prices can plunge rapidly)', 'No guarantee of dividends or returns', 'Total loss possible if the company goes bankrupt'],
    example: 'African stock exchanges like the Nigerian Exchange (NGX), Nairobi Securities Exchange (NSE), and Ghana Stock Exchange (GSE) offer access to leading companies.',
  },
  {
    id: 'inv_tbills', title: 'Treasury Bills & Government Securities', level: 'Beginner', category: 'Investment',
    desc: 'Lock in risk-free short-term interest yields backed by the government — very popular in African markets.',
    explanation: 'Treasury Bills (T-Bills) are short-term government debt securities. In African markets, T-Bills often offer much higher yields (10-20% in Nigeria, 10-15% in Ghana, 8-12% in Kenya).',
    benefits: ['Virtually zero default risk', 'High yields relative to global T-Bills', 'Excellent short-term holding tool'],
    risks: ['Currency devaluation can erode foreign investor returns', 'Fixed returns may still lag high inflation', 'Reinvestment risk when bills mature'],
    example: `Buying a 364-day Nigerian T-Bill for $975 with 12.5% yield. At maturity, the government pays you $1,000, earning $25.`,
  },
  {
    id: 'inv_commercial', title: 'Commercial Papers & Corporate Notes', level: 'Advanced', category: 'Investment',
    desc: 'Explore short-term corporate debt notes utilized by large institutions for payroll and inventory.',
    explanation: 'Commercial Paper is an unsecured, short-term debt instrument issued by corporations to finance short-term obligations like payroll and inventory.',
    benefits: ['Short maturity means quick cash turnaround', 'Typically higher yields than government T-Bills', 'Backed by highly creditworthy corporations'],
    risks: ['Unsecured (no collateral backing)', 'Minor default risk if the issuing company crashes', 'High minimum investment thresholds'],
    example: 'In Nigeria, commercial paper from top-tier banks can yield 12-16% annually.',
  },
  {
    id: 'inv_forex', title: 'Forex & Remittances', level: 'Advanced', category: 'Investment',
    desc: 'Navigate the global currency trading markets, diaspora remittances, and African currency pairs.',
    explanation: 'Forex is the global marketplace for exchanging national currencies. In the African context, forex is crucial for diaspora remittances — $95 billion flows into Africa annually.',
    benefits: ['Open 24 hours a day, 5 days a week', 'Immense liquidity', 'Diaspora remittances benefit from favorable rate timing'],
    risks: ['Extreme volatility', 'High leverage can lead to catastrophic losses', 'African currencies can depreciate sharply against USD'],
    example: 'The Nigerian Naira (NGN) has fluctuated from 360/USD to over 1,500/USD in recent years.',
  },
  {
    id: 'inv_crypto', title: 'Cryptocurrency & Blockchain', level: 'Advanced', category: 'Investment',
    desc: 'Deconstruct decentralized digital assets, smart contracts, and high-risk token speculation.',
    explanation: 'Cryptocurrencies are decentralized digital currencies secured by cryptography. In Africa, crypto adoption has grown rapidly — Nigeria, Kenya, and South Africa lead in P2P trading volume.',
    benefits: ['Potential for massive exponential returns', 'Decentralized and censorship-resistant', 'Instant global transfer 24/7'],
    risks: ['Severe volatility (can crash 50-80% in weeks)', 'Lack of regulatory protections', 'Risk of hacks and lost private keys'],
    example: 'Nigeria is one of the world\'s largest crypto markets, with P2P Bitcoin trading volumes exceeding $1B monthly.',
  },
  {
    id: 'inv_realestate', title: 'Real Estate & REITs', level: 'Intermediate', category: 'Investment',
    desc: 'Analyze property investing, rental income, house flipping, and liquid Real Estate Investment Trusts.',
    explanation: 'Real Estate investing involves purchasing physical land or buildings to earn rental income and benefit from appreciation. REITs are corporations that own income-producing real estate and trade like stocks.',
    benefits: ['Tangible asset with inflation protection', 'Rental income provides steady cash flow', 'REITs offer liquidity'],
    risks: ['Physical real estate is highly illiquid', 'Property vacancies and tenant issues', 'High interest rates increase costs'],
    example: 'In Nairobi, rental yields of 6-10% are common. A REIT like UPDC REIT allows investment in commercial real estate for as little as a few thousand Naira.',
  },
  {
    id: 'inv_agriculture', title: 'Agriculture & Agribusiness Investments', level: 'Intermediate', category: 'Investment',
    desc: 'Support Africa\'s food supply chains by investing in farmland, crop production, and agro-crowdfunding.',
    explanation: 'Agriculture investing is especially relevant in Africa, where 60% of the population works in agriculture. Platforms like Farmcrowdy connect investors to farmers.',
    benefits: ['Direct hedge against rising global food costs', 'Low correlation with stock market', 'Farmland is a finite appreciating asset'],
    risks: ['Weather-dependent (drought, pests)', 'Crop price volatility', 'Illiquid with long payback periods'],
    example: `Investing $5,000 in an organic grain farm project through an agro-platform can yield 12-18%.`,
  },
  {
    id: 'inv_transportation', title: 'Transportation & Logistics', level: 'Advanced', category: 'Investment',
    desc: 'Explore supply chain assets, trucking fleets, shipping, and transit companies across African trade corridors.',
    explanation: 'Transportation investing spans logistics companies, trucking fleets, and ride-hailing platforms. Africa\'s logistics market is growing due to the African Continental Free Trade Area (AfCFTA).',
    benefits: ['Core pillar of African commerce', 'Contracts often have guaranteed minimum rates', 'Tangible assets retain residual value'],
    risks: ['Fluctuating fuel prices', 'Economic recessions drag down shipping volumes', 'High maintenance costs'],
    example: 'Investing in a logistics company on the Mombasa-Nairobi-Kampala corridor benefits from rising intra-African trade.',
  },
  {
    id: 'inv_oilgas', title: 'Oil & Gas / Energy Investments', level: 'Advanced', category: 'Investment',
    desc: 'Analyze energy exploration, production, pipeline transport, and power generation across Africa.',
    explanation: 'Oil and Gas investments span upstream (exploration), midstream (pipelines), and downstream (refining). Major African producers include Nigeria, Angola, and Ghana.',
    benefits: ['High dividend yields', 'Exposure to global energy commodities', 'Renewable energy growth opportunities'],
    risks: ['Volatile commodity prices', 'Environmental liabilities', 'Depleting reserves require reinvestment'],
    example: 'Nigeria\'s NNPC, Shell Nigeria, and Seplat Energy offer oil & gas exposure. M-KOPA provides off-grid solar across East Africa.',
  },
  {
    id: 'inv_referrals', title: 'Business Referral & Affiliate Opportunities', level: 'Beginner', category: 'Investment',
    desc: 'Monetize networks through affiliate marketing, broker referrals, and passive finder fees.',
    explanation: 'Referral investing uses your social network to match buyers with sellers, earning commissions with virtually zero cash outlay.',
    benefits: ['Requires zero starting capital', 'High returns based on connection skills', 'Easy to run in spare time'],
    risks: ['Unstable income streams', 'Spamming networks can harm relationships', 'Requires marketing skills'],
    example: 'Referring a commercial real estate buyer to a mortgage broker, earning a 0.5% finder fee on a $1M loan ($5,000).',
  },
  {
    id: 'inv_localbuying', title: 'Local Buying & Selling (Market Arbitrage)', level: 'Beginner', category: 'Investment',
    desc: 'Identify undervalued inventory in local markets, refurbish, and sell online or in African marketplaces.',
    explanation: 'Local commerce arbitrage is buying undervalued assets (thrift stores, garage sales, auctions) and reselling them online (Jumia, Konga, Facebook Marketplace).',
    benefits: ['Instant cash cycles and high markup', 'Extremely low barrier to entry', 'Builds supply/demand skills'],
    risks: ['Requires storage space and shipping logistics', 'Unsold inventory ties up cash', 'Platform fees eat margins'],
    example: 'Buying second-hand electronics at computer village in Lagos, refurbishing, and reselling on Jumia for 2-3x the purchase price.',
  },
];

const platformDirectory: PlatformEntry[] = [
  { name: 'Nigerian Exchange (NGX)', type: 'Stocks, ETFs, Bonds', info: 'Nigeria\'s premier securities exchange with over 150 listed companies.' },
  { name: 'Nairobi Securities Exchange (NSE)', type: 'Stocks, Bonds, ETFs', info: 'Kenya\'s primary stock exchange with companies like Safaricom, Equity Bank.' },
  { name: 'Ghana Stock Exchange (GSE)', type: 'Stocks, Bonds', info: 'Accra-based exchange featuring leading Ghanaian companies.' },
  { name: 'Fidelity Investments', type: 'Stocks, Bonds, Mutual Funds', info: 'Global brokerage offering zero-fee index funds and fractional shares.' },
  { name: 'Vanguard', type: 'Mutual Funds, ETFs, Retirement', info: 'Pioneer of low-cost index investing for long-term portfolios.' },
  { name: 'Chipper Cash', type: 'Cross-border Payments, Crypto', info: 'Leading African fintech for cross-border transfers and crypto.' },
  { name: 'PiggyVest', type: 'Savings, Investments', info: 'Nigeria\'s #1 savings platform with T-Bills and mutual funds from ₦100.' },
  { name: 'TreasuryDirect (Nigeria)', type: 'FGN Bonds, T-Bills', info: 'CBN portal for government securities with yields often exceeding 10-15%.' },
  { name: 'Coinbase', type: 'Cryptocurrency', info: 'Secure crypto exchange with educational rewards.' },
  { name: 'M-KOPA', type: 'Solar Energy, Financing', info: 'Kenya-based pay-as-you-go solar company and asset financing.' },
];

export default function LearningHub({ user, onUpdateUser, onAskAi, onConfetti }: LearningHubProps) {
  const addToast = useToast();
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<'education' | 'investments' | 'directory'>('education');
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);

  const handleModuleClick = (mod: EducationModule) => {
    setSelectedModule(mod);
  };

  const handleToggleComplete = async (modId: string) => {
    if (!user) {
      addToast('Sign in to track your learning progress!', 'warning');
      return;
    }

    let updatedCompleted = [...(user.completedModules || [])];
    let justCompleted = false;

    if (updatedCompleted.includes(modId)) {
      updatedCompleted = updatedCompleted.filter(id => id !== modId);
      addToast('Lesson marked incomplete.', 'info');
    } else {
      updatedCompleted.push(modId);
      justCompleted = true;
      addToast('🎉 Lesson completed! Great progress!', 'success', 4000);

      const totalCompleted = updatedCompleted.length;
      if (totalCompleted === 5) {
        addToast('🏆 Rank Up: You are now an Intermediate learner!', 'success', 5000);
        if (onConfetti) onConfetti();
      } else if (totalCompleted === 12) {
        addToast('🎓 Rank Up: You are now a Finance Scholar!', 'success', 5000);
        if (onConfetti) onConfetti();
      }
    }

    const updatedUser = { ...user, completedModules: updatedCompleted };
    onUpdateUser(updatedUser);

    // Sync to backend if authenticated
    if (user.email) {
      try {
        await api.updateProfile({ completedModules: updatedCompleted });
      } catch {
        // Silently fall back to local
      }
    }
  };

  const activeModules = activeTab === 'education' ? educationModules : investmentModules;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {selectedModule ? (
        <div className="card page-enter">
          <button className="back-button btn-press" onClick={() => setSelectedModule(null)}>
            ⬅ Back to Learning Hub
          </button>

          <div className="module-detail-container">
            <div className="detail-content">
              <div className="detail-header">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge info">{selectedModule.level}</span>
                  {user?.completedModules?.includes(selectedModule.id) && (
                    <span className="badge success">✓ Completed</span>
                  )}
                </div>
                <h2 className="detail-title">{selectedModule.title}</h2>
                <div className="detail-meta">
                  <span>📂 {selectedModule.category}</span>
                  <span>⏱ 10 mins read</span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">📖 Explanation</h4>
                <p className="detail-text">{selectedModule.explanation}</p>
              </div>

              <div className="benefits-risks">
                <div className="benefit-box">
                  <h5 className="box-title">✔ Key Benefits</h5>
                  <ul className="box-list">
                    {selectedModule.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>
                <div className="risk-box">
                  <h5 className="box-title">⚠ Potential Risks</h5>
                  <ul className="box-list">
                    {selectedModule.risks.map((r, idx) => <li key={idx}>{r}</li>)}
                  </ul>
                </div>
              </div>

              <div className="detail-section" style={{ backgroundColor: 'var(--bg-surface-muted)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h4 className="detail-section-title">💡 Real-World Example</h4>
                <p className="detail-text" style={{ fontStyle: 'italic' }}>{selectedModule.example}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ backgroundColor: 'var(--bg-surface-muted)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 className="detail-section-title" style={{ fontSize: '16px' }}>⚡ Action Center</h4>
                {user ? (
                  <button
                    className="auth-button btn-press"
                    style={{
                      width: '100%', justifyContent: 'center',
                      background: user.completedModules?.includes(selectedModule.id) ? 'var(--color-danger)' : 'var(--grad-primary)',
                      color: 'white', border: 'none', padding: '12px', borderRadius: 'var(--radius-full)', fontWeight: '700', cursor: 'pointer',
                    }}
                    onClick={() => handleToggleComplete(selectedModule.id)}
                  >
                    {user.completedModules?.includes(selectedModule.id) ? '✖ Mark Incomplete' : '✔ Complete Lesson'}
                  </button>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                    🔒 Sign in to track your learning progress and earn milestones!
                  </div>
                )}
                <button
                  className="auth-button logout btn-press"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    onAskAi(`Explain "${selectedModule.title}" and give me practical strategies. Let's discuss it.`);
                    addToast('Opening AI Assistant with your question...', 'info');
                  }}
                >
                  💬 Ask AI Assistant
                </button>
              </div>

              <div className="card" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontWeight: '700' }}>🎓 Did You Know?</h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Active learning retention increases by 70% when you discuss topics or use calculators to experiment with different interest yields.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="module-tabs">
            <button
              className={`module-tab-btn btn-press ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              📘 Financial Education
            </button>
            <button
              className={`module-tab-btn btn-press ${activeTab === 'investments' ? 'active' : ''}`}
              onClick={() => setActiveTab('investments')}
            >
              💼 Investment Modules (African Markets)
            </button>
            <button
              className={`module-tab-btn btn-press ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              🏢 Platform Directory
            </button>
          </div>

          {activeTab === 'directory' ? (
            <div className="card page-enter">
              <h3 className="card-title">🏢 Trusted Investment Platforms — Africa & Global</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Curated platforms for African investors. Includes local African exchanges, fintech savings apps, and global brokerages.
              </p>
              <div className="posts-list">
                {platformDirectory.map((plat, idx) => (
                  <div key={idx} className="card stagger-item" style={{ animationDelay: `${idx * 0.05}s`, backgroundColor: 'var(--bg-surface-muted)', border: 'none' }}
                    onClick={() => addToast(`📌 ${plat.name}: ${plat.info.substring(0, 60)}...`, 'info', 3000)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}>{plat.name}</h4>
                      <span className="badge info">{plat.type}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{plat.info}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="modules-grid page-enter">
              {activeModules.map((mod, idx) => {
                const isCompleted = user?.completedModules?.includes(mod.id);
                return (
                  <div key={mod.id}
                    className="card module-card stagger-item"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                    onClick={() => handleModuleClick(mod)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="module-level" style={{ color: mod.level === 'Advanced' ? 'var(--color-danger)' : mod.level === 'Intermediate' ? 'var(--color-warning)' : 'var(--color-info)' }}>
                        {mod.level}
                      </span>
                      {isCompleted && <span className="badge success">✓ Completed</span>}
                    </div>
                    <h3 className="module-card-title">{mod.title}</h3>
                    <p className="module-description">{mod.desc}</p>
                    <div className="module-progress-bar">
                      <div className="module-progress-fill" style={{ width: isCompleted ? '100%' : '0%' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
