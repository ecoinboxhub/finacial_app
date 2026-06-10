import React, { useState } from 'react';
import { useToast } from './ToastContext';
import { useCurrency } from './CurrencyContext';

export default function LearningHub({ user, onUpdateUser, onAskAi, onConfetti }) {
  const addToast = useToast();
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState('education');
  const [selectedModule, setSelectedModule] = useState(null);

  const educationModules = [
    {
      id: 'edu_budgeting',
      title: 'Budgeting & Expense Allocation',
      level: 'Beginner',
      category: 'Education',
      desc: 'Learn how to partition and track your income using popular frameworks like 50/30/20 rule to maintain positive cash flow.',
      explanation: 'Budgeting is the foundation of financial wellness. It involves tracking your income and mapping out categories for expenses. By setting limits, you avoid overspending and guarantee regular savings for future goals. A popular method is the 50/30/20 rule: 50% on Needs (rent, bills, food), 30% on Wants (entertainment, dining out), and 20% on Savings or Debt repayment.',
      benefits: ['Guarantees you live below your means', 'Reduces financial anxiety by planning ahead', 'Creates a clear path to save for milestones'],
      risks: ['Can feel restrictive if too rigid', 'Requires disciplined tracking of small expenses', 'Unexpected emergencies can disrupt strict plans'],
      example: `If your monthly income is ${formatAmount(4000)}, allocate ${formatAmount(2000)} to needs, ${formatAmount(1200)} to wants, and ${formatAmount(800)} to savings/investments.`
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
      example: `Placing your emergency fund of ${formatAmount(10000)} in a HYSA earning 4.5% APY yields ${formatAmount(450)} in interest over a year — far more than a standard savings account.`
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
      example: 'Using M-Pesa in Kenya, over 30 million people send money, pay bills, and access microloans (KSh 500-50,000) directly from their mobile phones without a traditional bank account.'
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
      example: 'A borrower with a strong credit profile qualifies for a 6% mortgage rate, while someone with poor credit might get 12%, costing hundreds of thousands extra in interest.'
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
      example: `Buying a home with a 20% down payment of ${formatAmount(60000)} on a ${formatAmount(300000)} property. At 6.5% fixed interest, the monthly payment is approximately ${formatAmount(1517)}.`
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
      example: `Contributing ${formatAmount(200)} monthly to a retirement account from age 25 to 55. With an average 8% return, you could accumulate over ${formatAmount(300000)} for retirement.`
    }
  ];

  const investmentModules = [
    {
      id: 'inv_mutual',
      title: 'Mutual Funds & ETFs',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Understand diversified index funds and exchange-traded funds to track stock markets safely.',
      explanation: 'Mutual Funds and ETFs (Exchange-Traded Funds) pool capital from thousands of investors to buy a diversified basket of stocks, bonds, or other assets. Instead of buying individual shares of a single company (which is risky), you purchase a tiny slice of hundreds of companies. Index funds track a market benchmark like the S&P 500 or NGX 30 (Nigeria), offering automatic diversification.',
      benefits: ['Instant diversification reduces individual company risk', 'ETFs can be bought and sold throughout the trading day', 'Low fees for passive index funds'],
      risks: ['No control over individual companies held in the fund', 'Some actively managed funds carry high management fees', 'Subject to general stock market downturns'],
      example: 'An S&P 500 ETF spreads your investment across Apple, Microsoft, Amazon, and 497 other leading companies, guarding you if any single company fails. In Nigeria, the NGX 30 ETF tracks the 30 biggest companies on the Nigerian Exchange.'
    },
    {
      id: 'inv_bonds',
      title: 'Bonds & Fixed Income',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Learn how government and corporate debt securities act as reliable portfolio stabilizers.',
      explanation: 'Bonds are debt instruments. When you buy a bond, you are lending capital to an entity (like a government or corporation) in exchange for regular interest payments (coupons) and the return of the bond\'s face value at maturity. Bonds are considered safer than stocks and are used to stabilize portfolios and generate reliable income.',
      benefits: ['Highly predictable income payments', 'Much lower volatility than stocks', 'Government bonds are backed by the issuing nation'],
      risks: ['Lower potential returns compared to equities', 'Bond prices drop when interest rates rise', 'Inflation can outpace the fixed return rate'],
      example: 'Many African governments issue Eurobonds and local currency bonds. For example, a Nigerian 10-year FGN Bond might yield 12-14% annually, offering high fixed income relative to global bonds.'
    },
    {
      id: 'inv_stocks',
      title: 'Stocks & Equity Markets',
      level: 'Intermediate',
      category: 'Investment',
      desc: 'Demystify public equity ownership, dividends, capital gains, and stock valuation metrics.',
      explanation: 'Stocks (equities) represent fractional ownership in a corporation. When you purchase a share, you own a tiny portion of the company\'s assets and earnings. Stock prices fluctuate constantly based on company performance, earnings reports, and market sentiment. Wealth is built through Capital Gains (selling shares higher than purchased) and Dividends (cash distributions paid out to shareholders).',
      benefits: ['Historically high long-term returns (average ~10% annually)', 'Liquidity (easily sold on exchange markets)', 'Opportunity to participate in company growth'],
      risks: ['High volatility (prices can plunge rapidly)', 'No guarantee of dividends or returns', 'Total loss possible if the company goes bankrupt'],
      example: 'African stock exchanges like the Nigerian Exchange (NGX), Nairobi Securities Exchange (NSE), and Ghana Stock Exchange (GSE) offer access to leading companies. Buying shares of a bank or telco could provide both capital appreciation and dividends.'
    },
    {
      id: 'inv_tbills',
      title: 'Treasury Bills (T-Bills) & Government Securities',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Lock in risk-free short-term interest yields backed by the government — very popular in African markets.',
      explanation: 'Treasury Bills (T-Bills) are short-term government debt securities issued by a country\'s treasury. In African markets, T-Bills often offer much higher yields (10-20% in Nigeria, 10-15% in Ghana, 8-12% in Kenya) compared to global markets, reflecting inflation and currency risk. They are sold at a discount and mature at face value.',
      benefits: ['Virtually zero default risk (backed by government)', 'High yields relative to global T-Bills', 'Excellent short-term holding tool for cash'],
      risks: ['Currency devaluation can erode foreign investor returns', 'Fixed returns may still lag high inflation', 'Reinvestment risk when bills mature'],
      example: `Buying a 364-day Nigerian T-Bill for ${formatAmount(975)} with 12.5% yield. At maturity, the government pays you the full ${formatAmount(1000)}, earning ${formatAmount(25)} in interest.`
    },
    {
      id: 'inv_commercial',
      title: 'Commercial Papers & Corporate Notes',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Explore short-term corporate debt notes utilized by large institutions for payroll and inventory.',
      explanation: 'Commercial Paper is an unsecured, short-term debt instrument issued by corporations, typically to finance short-term obligations like payroll, accounts payable, and inventory. Maturity rarely exceeds 270 days. They are usually issued at a discount and are typically purchased by institutional investors, though retail access exists via money market funds.',
      benefits: ['Short maturity means quick cash turnaround', 'Typically higher yields than government T-Bills', 'Backed by highly creditworthy major corporations'],
      risks: ['Unsecured (no collateral backing)', 'Minor default risk exists if the issuing company crashes', 'High minimum investment thresholds for direct purchase'],
      example: 'In Nigeria, commercial paper from top-tier banks and manufacturing firms can yield 12-16% annually, making them attractive to high-net-worth individuals and institutional investors.'
    },
    {
      id: 'inv_forex',
      title: 'Forex (Foreign Exchange) & Remittances',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Navigate the global currency trading markets, diaspora remittances, and African currency pairs.',
      explanation: 'Forex (Foreign Exchange) is the global marketplace for exchanging national currencies. In the African context, forex is crucial for diaspora remittances — Africans abroad sending money home ($95 billion flows into Africa annually). Major pairs involving African currencies include USD/NGN, USD/KES, USD/GHS, and USD/ZAR.',
      benefits: ['Open 24 hours a day, 5 days a week', 'Immense liquidity ensures easy entry and exit', 'Diaspora remittances benefit from favorable rate timing'],
      risks: ['Extreme volatility and rapid movements', 'High leverage can lead to catastrophic losses', 'African currencies can depreciate sharply against USD'],
      example: 'The Nigerian Naira (NGN) has fluctuated from 360/USD to over 1,500/USD in recent years. Understanding forex helps diaspora send money at optimal times to maximize value.'
    },
    {
      id: 'inv_crypto',
      title: 'Cryptocurrency & Blockchain',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Deconstruct decentralized digital assets, smart contracts, and high-risk token speculation.',
      explanation: 'Cryptocurrencies are decentralized digital currencies secured by cryptography and recorded on public ledgers called blockchains. Bitcoin (digital gold) and Ethereum (smart contract network) are the largest. In Africa, crypto adoption has grown rapidly — Nigeria, Kenya, and South Africa lead in peer-to-peer crypto trading volume.',
      benefits: ['Potential for massive exponential returns', 'Decentralized structure prevents central censorship', 'Instant global transfer and 24/7 market trading'],
      risks: ['Severe volatility (can crash 50-80% in weeks)', 'Lack of regulatory protections; hack/scam risks', 'Technical complexity and potential for lost private keys'],
      example: 'Nigeria is one of the world\'s largest crypto markets, with P2P Bitcoin trading volumes exceeding $1B monthly. Young professionals use crypto to hedge against Naira devaluation and send money abroad.'
    },
    {
      id: 'inv_realestate',
      title: 'Real Estate & REITs',
      level: 'Intermediate',
      category: 'Investment',
      desc: 'Analyze property investing, rental income, house flipping, and liquid Real Estate Investment Trusts.',
      explanation: 'Real Estate investing involves purchasing physical land or buildings to earn rental income and benefit from property value appreciation. REITs (Real Estate Investment Trusts) are corporations that own and operate income-producing real estate and trade like stocks. Many African markets have growing REIT sectors.',
      benefits: ['Tangible asset with historical inflation protection', 'Rental income provides steady recurring cash flow', 'REITs offer real estate exposure with stock-market liquidity'],
      risks: ['Physical real estate is highly illiquid and requires heavy capital', 'Property vacancies, damage, and tenant issues', 'High interest rates increase borrowing costs'],
      example: 'In Nairobi, rental yields of 6-10% are common. A REIT like the Nigeria-focused UPDC REIT allows investment in commercial real estate for as little as a few thousand Naira.'
    },
    {
      id: 'inv_agriculture',
      title: 'Agriculture & Agribusiness Investments',
      level: 'Intermediate',
      category: 'Investment',
      desc: 'Support Africa\'s food supply chains by investing in farmland, crop production, and agro-crowdfunding.',
      explanation: 'Agriculture investing is especially relevant in Africa, where 60% of the population works in agriculture. Investors can purchase physical farmland, invest in agro-processing companies, or use platforms like Farmcrowdy (Nigeria) and Thrive Agric that connect investors to farmers, providing capital for seeds and equipment in exchange for profit sharing after harvest.',
      benefits: ['Direct hedge against rising global food costs', 'Low correlation with stock market volatility', 'Farmland is a finite, highly appreciating physical asset'],
      risks: ['Highly dependent on weather, drought, pests, and climate change', 'Crop price volatility can wipe out season profits', 'Illiquid investments with long payback periods'],
      example: `Investing ${formatAmount(5000)} in an organic grain farm project through an agro-platform. You receive a 12-18% yield paid out after harvest, while supporting local farmers and food security.`
    },
    {
      id: 'inv_transportation',
      title: 'Transportation & Logistics',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Explore supply chain assets, trucking fleets, shipping, and transit companies across African trade corridors.',
      explanation: 'Transportation investing centers on the movement of people and cargo across Africa\'s rapidly growing trade corridors. This includes public shares in logistics companies, private equity in regional trucking fleets, or investment in ride-hailing platforms. Africa\'s logistics market is projected to grow significantly due to the African Continental Free Trade Area (AfCFTA).',
      benefits: ['Core pillar of African commerce expansion', 'Contracts often feature guaranteed minimum rates', 'Tangible vehicle assets retain residual value'],
      risks: ['Fluctuating fuel prices represent a major expense', 'Economic recessions instantly drag down shipping volumes', 'Heavy equipment maintenance and depreciation costs'],
      example: 'Investing in a logistics company operating along the Mombasa-Nairobi-Kampala corridor. With intra-African trade growing, cargo shipping demand is projected to rise 20-30% in the next 5 years.'
    },
    {
      id: 'inv_oilgas',
      title: 'Oil & Gas / Energy Investments',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Analyze energy exploration, production, pipeline transport, and power generation across Africa.',
      explanation: 'Oil and Gas investments span upstream (exploration and drilling), midstream (pipelines and storage), and downstream (refining and marketing) assets. In Africa, major producers include Nigeria, Angola, and Ghana. The renewable energy transition also creates opportunities in solar, wind, and hydro-electric projects across the continent.',
      benefits: ['Very high dividend yields are common sector-wide', 'Direct exposure to global energy commodities', 'Renewable energy offers growth in underserved markets'],
      risks: ['Highly volatile energy commodity prices', 'Environmental liabilities and regulatory transition risks', 'Depleting reserves require constant capital reinvestment'],
      example: 'Nigeria\'s NNPC, Shell Nigeria, and Seplat Energy offer exposure to oil & gas. Meanwhile, solar companies like M-KOPA provide off-grid energy solutions across East Africa.'
    },
    {
      id: 'inv_referrals',
      title: 'Business Referral & Affiliate Opportunities',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Monetize networks through affiliate marketing, broker referrals, and passive finder fees.',
      explanation: 'Business Referral investments involve utilizing your social or professional network to match buyers with sellers, earning referral commissions or finder fees. Unlike capital-heavy investments, referral investing requires time and networking, creating a high return on investment with virtually zero cash outlay.',
      benefits: ['Requires zero starting capital', 'High returns based purely on connection skills', 'Easy to run in your spare time'],
      risks: ['Unstable, unpredictable income streams', 'Spamming networks can harm personal relationships', 'Often requires strong marketing or sales skills'],
      example: 'Referring a commercial real estate buyer to a mortgage broker, earning a 0.5% finder fee on a $1 Million loan ($5,000) upon successful close.'
    },
    {
      id: 'inv_localbuying',
      title: 'Local Buying & Selling (Market Arbitrage)',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Identify undervalued inventory in local markets, refurbish, and sell online or in African marketplaces.',
      explanation: 'Local commerce arbitrage is purchasing undervalued assets in local settings (thrift stores, garage sales, liquidation auctions) and reselling them at market value online (Jumia, Konga, Facebook Marketplace). This turns sweat equity and local search skills into rapid cash gains — a common side hustle for students and market traders across Africa.',
      benefits: ['Instant cash cycles and high markup percentages', 'Extremely low barrier to entry', 'Builds fundamental supply/demand and sales skills'],
      risks: ['Requires physical storage space and shipping logistics', 'Unsold inventory represents tied-up cash capital', 'Platform fees and return policies can eat margins'],
      example: 'Buying second-hand electronics at computer village in Lagos or Kaizen in Accra, refurbishing, and reselling on Jumia for 2-3x the purchase price.'
    }
  ];

  const platformDirectory = [
    { name: 'Nigerian Exchange (NGX)', type: 'Stocks, ETFs, Bonds', info: 'Nigeria\'s premier securities exchange, featuring over 150 listed companies across banking, consumer goods, oil & gas, and telecom sectors.' },
    { name: 'Nairobi Securities Exchange (NSE)', type: 'Stocks, Bonds, ETFs', info: 'Kenya\'s primary stock exchange with companies like Safaricom, Equity Bank, and KCB. Growing ETF market and corporate bond listings.' },
    { name: 'Ghana Stock Exchange (GSE)', type: 'Stocks, Bonds', info: 'Accra-based exchange featuring leading Ghanaian companies. Known for its stable financial sector listings and government bond market.' },
    { name: 'Fidelity Investments', type: 'Stocks, Bonds, Mutual Funds, ETFs', info: 'Well-established global brokerage offering zero-fee index funds, fractional shares, and retirement IRAs.' },
    { name: 'Vanguard', type: 'Mutual Funds, ETFs, Retirement', info: 'Pioneer of low-cost index investing, ideal for long-term retirement accounts and set-it-and-forget-it portfolios.' },
    { name: 'Chipper Cash', type: 'Cross-border Payments, Crypto', info: 'Leading African fintech for cross-border money transfers and crypto trading, operating in 20+ African countries.' },
    { name: 'PiggyVest', type: 'Savings, Investments', info: 'Nigeria\'s #1 savings & investment platform. Offers automated savings, fixed deposits, and access to Nigerian T-Bills and mutual funds — starting from ₦100.' },
    { name: 'TreasuryDirect (Nigeria)', type: 'FGN Bonds, T-Bills', info: 'The Central Bank of Nigeria portal for purchasing government securities directly, with yields often exceeding 10-15% annually.' },
    { name: 'Coinbase', type: 'Cryptocurrency', info: 'Leading secure crypto exchange featuring educational lessons that reward you with free crypto tokens.' },
    { name: 'M-KOPA', type: 'Solar Energy, Asset Financing', info: 'Kenya-based pay-as-you-go solar company. Offers investment in off-grid energy solutions while providing financing for low-income households.' }
  ];

  const handleModuleClick = (mod) => {
    setSelectedModule(mod);
  };

  const handleToggleComplete = (modId) => {
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
                    className={`auth-button btn-press`}
                    style={{ 
                      width: '100%', justifyContent: 'center',
                      background: user.completedModules?.includes(selectedModule.id) ? 'var(--color-danger)' : 'var(--grad-primary)',
                      color: 'white', border: 'none', padding: '12px', borderRadius: 'var(--radius-full)', fontWeight: '700', cursor: 'pointer'
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
                Curated platforms for African investors. Includes local African exchanges, fintech savings apps, and global brokerages. Always do your own research before committing funds.
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
