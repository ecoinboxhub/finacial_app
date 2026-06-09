import React, { useState } from 'react';

export default function LearningHub({ user, onUpdateUser, onAskAi }) {
  const [activeTab, setActiveTab] = useState('education'); // 'education' | 'investments' | 'directory'
  const [selectedModule, setSelectedModule] = useState(null);

  // 1. Financial Education Modules
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
      example: 'If your monthly take-home income is $4,000, you allocate $2,000 to housing/utilities, $1,200 to personal shopping/activities, and $800 directly to savings or investments.'
    },
    {
      id: 'edu_savings',
      title: 'Savings & High-Yield Accounts',
      level: 'Beginner',
      category: 'Education',
      desc: 'Understand the power of emergency funds and how high-yield savings accounts outpace traditional banking.',
      explanation: 'Saving is setting money aside rather than spending it immediately. A vital first step is building an Emergency Fund—ideally 3 to 6 months of living expenses. Traditional savings accounts pay minimal interest (often 0.01%), whereas High-Yield Savings Accounts (HYSAs) or certificates of deposit (CDs) pay much higher rates, helping your money grow securely with compound interest.',
      benefits: ['Ensures cash availability during emergencies', 'HYSAs offer low-risk interest compounding', 'Insured up to $250,000 by FDIC in most cases'],
      risks: ['Inflation can slowly erode purchasing power', 'Low-yield accounts offer virtually zero growth', 'Some accounts penalize early withdrawals (like CDs)'],
      example: 'Placing your $10,000 emergency fund in a HYSA earning 4.5% annual yield yields $450 in interest over a year, compared to only $1 in a standard 0.01% savings account.'
    },
    {
      id: 'edu_banking',
      title: 'Banking & Core Finance Systems',
      level: 'Beginner',
      category: 'Education',
      desc: 'Navigate checking, savings accounts, credit unions, and basic banking protocols for maximum efficiency.',
      explanation: 'Banking serves as the secure vault for your daily financial transactions. Checking accounts are used for regular expenses, deposits, and bill payments. Credit Unions are customer-owned and often offer lower fees and higher rates than commercial banks. Knowing how banking clearing times, wires, and debit cards work helps you avoid overdraft fees.',
      benefits: ['Secure environment for liquid funds', 'Access to online bills pay and direct deposit', 'Establishes a financial relationship for future loans'],
      risks: ['Maintenance fees and overdraft penalties if not monitored', 'Card fraud and identity theft require constant vigilance', 'Low interest returns compared to investment assets'],
      example: 'Setting up automated bill payments on your checking account ensures you never miss utility payments, preventing late fees and shielding your credit rating.'
    },
    {
      id: 'edu_credit',
      title: 'Credit & Debt Management',
      level: 'Intermediate',
      category: 'Education',
      desc: 'Decipher credit scores, interest rates, and active strategies for paying down debt like avalanche and snowball.',
      explanation: 'Credit is your ability to borrow money based on trust that you will repay it. Your Credit Score (FICO) represents this trustworthiness. High-interest debt, like credit card debt, can drain your wealth rapidly. Effective repayment methods include the Snowball Method (paying smallest balances first for psychological wins) and the Avalanche Method (paying highest interest rate debts first to minimize overall interest).',
      benefits: ['High credit score unlocks low interest rates on loans', 'Credit cards offer rewards and purchase protections', 'Strategic debt can fund appreciating assets (like real estate)'],
      risks: ['High-interest rates compound quickly against you', 'Missed payments severely drag down credit scores', 'Overborrowing leads to debt spirals and bankruptcy'],
      example: 'A borrower with an 800 credit score qualifies for a 6% mortgage rate, while an individual with a 620 score might get an 8% rate, costing them over $100,000 extra in interest.'
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
      example: 'Buying a $300,000 home with a 20% down payment ($60,000) leaves a $240,000 mortgage. At 6.5% fixed interest, the monthly principal and interest payment is $1,517.'
    },
    {
      id: 'edu_retirement',
      title: 'Retirement Planning & Accounts',
      level: 'Advanced',
      category: 'Education',
      desc: 'Unlock retirement vehicles like 401(k), Traditional IRA, and Roth IRA for tax-advantaged compounding.',
      explanation: 'Retirement planning is the process of setting aside wealth during your working years to support yourself once you stop working. Utilizing tax-advantaged accounts is key: 401(k) (employer-sponsored, often with matching contributions), Traditional IRA (tax-deductible deposits, taxed on withdrawal), and Roth IRA (deposits made with after-tax money, withdrawals are 100% tax-free in retirement).',
      benefits: ['Tax-free compounding growth inside accounts', 'Employer matching in a 401(k) is free money', 'Roth IRAs guard you against future income tax hikes'],
      risks: ['Strict penalties (usually 10%) for withdrawals before age 59½', 'Market fluctuations can decrease balances temporarily', 'Required Minimum Distributions (RMDs) mandate withdrawals in old age'],
      example: 'Contributing $500 monthly to a Roth IRA from age 25 to 65. With an average 8% return, you accumulate over $1.5 Million, all of which can be withdrawn completely tax-free.'
    }
  ];

  // 2. Investment Learning Modules
  const investmentModules = [
    {
      id: 'inv_mutual',
      title: 'Mutual Funds & ETFs',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Understand diversified index funds and exchange-traded funds to track stock markets safely.',
      explanation: 'Mutual Funds and ETFs (Exchange-Traded Funds) pool capital from thousands of investors to buy a diversified basket of stocks, bonds, or other assets. Instead of buying individual shares of a single company (which is risky), you purchase a tiny slice of hundreds of companies. Index funds track a market benchmark like the S&P 500, offering automatic diversification and low management fees.',
      benefits: ['Instant diversification reduces individual company risk', 'ETFs can be bought and sold throughout the trading day', 'Low fees (expense ratios) for passive index funds'],
      risks: ['No control over individual companies held in the fund', 'Some actively managed funds carry high management fees', 'Subject to general stock market downturns'],
      example: 'Investing in an S&P 500 ETF spreads your money across Apple, Microsoft, Amazon, Nvidia, and 496 other leading companies, guarding you if any single company fails.'
    },
    {
      id: 'inv_bonds',
      title: 'Bonds & Fixed Income',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Learn how government and corporate debt securities act as reliable portfolio stabilizers.',
      explanation: 'Bonds are debt instruments. When you buy a bond, you are lending capital to an entity (like a government or corporation) in exchange for regular interest payments (coupons) and the return of the bond\'s face value at maturity. Bonds are considered safer than stocks and are used to stabilize portfolios and generate reliable income.',
      benefits: ['Highly predictable income payments', 'Much lower volatility than stocks', 'US government bonds are backed by the full faith of the treasury'],
      risks: ['Lower potential returns compared to equities', 'Bond prices drop when interest rates rise (Interest Rate Risk)', 'Inflation can outpace the fixed return rate'],
      example: 'Buying a $10,000 corporate bond with a 5% coupon rate and a 10-year term means you receive $500 every year, and get your full $10,000 back at the end of the 10 years.'
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
      example: 'Buying 10 shares of a tech company at $100 each. If the share price rises to $150 and the company pays a $2 dividend per share, your total value is $1,520 (a 52% total return).'
    },
    {
      id: 'inv_tbills',
      title: 'Treasury Bills (T-Bills)',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Lock in risk-free short-term interest yields backed by the Federal Government.',
      explanation: 'Treasury Bills (T-Bills) are short-term government debt securities issued by the U.S. Treasury, with maturities ranging from a few days to 52 weeks. They are sold at a discount from their face value. Upon maturity, the government pays the full face value. The difference between the discounted purchase price and face value represents the interest earned.',
      benefits: ['Virtually zero default risk', 'Exempt from state and local income taxes', 'Excellent short-term holding tool for cash'],
      risks: ['Fixed interest returns might not match inflation rates', 'Early selling on secondary markets can trigger minor losses', 'Low growth potential compared to long-term stock holdings'],
      example: 'You buy a 26-week $1,000 T-Bill for $975. At the end of the 26 weeks, the treasury pays you the full $1,000, earning you $25 in interest.'
    },
    {
      id: 'inv_commercial',
      title: 'Commercial Papers',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Explore short-term corporate debt notes utilized by large institutions for payroll and inventory.',
      explanation: 'Commercial Paper is an unsecured, short-term debt instrument issued by corporations, typically to finance short-term obligations like payroll, accounts payable, and inventory. Maturity rarely exceeds 270 days. They are usually issued at a discount and are typically purchased by institutional investors, though retail access exists via money market funds.',
      benefits: ['Short maturity means quick cash turnaround', 'Typically higher yields than government T-Bills', 'Backed by highly creditworthy major corporations'],
      risks: ['Unsecured (no collateral backing)', 'Minor default risk exists if the issuing company crashes', 'High minimum investment thresholds for direct purchase'],
      example: 'A large retail corporation issues a $100,000 commercial paper maturing in 90 days. An investment fund buys it for $98,500, collecting $1,500 in profit when the term ends.'
    },
    {
      id: 'inv_forex',
      title: 'Forex (Foreign Exchange)',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Navigate the global currency trading markets, leverage, and currency pair dynamics.',
      explanation: 'Forex (Foreign Exchange) is the global marketplace for exchanging national currencies against one another. Forex trading is done in pairs (e.g., EUR/USD). It is the largest, most liquid financial market in the world. Traders speculate on exchange rate fluctuations, often utilizing high leverage (borrowed capital) to amplify trade sizes.',
      benefits: ['Open 24 hours a day, 5 days a week', 'Immense liquidity ensures easy entry and exit', 'Opportunity to profit in both rising and falling currency trends'],
      risks: ['Extreme volatility and rapid movements', 'High leverage can lead to catastrophic losses exceeding initial capital', 'Highly complex macroeconomic factors drive rates'],
      example: 'Buying the EUR/USD pair at 1.10, expecting the Euro to strengthen. If the exchange rate moves to 1.12, you sell for a profit. If it falls to 1.08, you take a loss.'
    },
    {
      id: 'inv_crypto',
      title: 'Cryptocurrency & Blockchain',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Deconstruct decentralized digital assets, smart contracts, and high-risk token speculation.',
      explanation: 'Cryptocurrencies are decentralized digital currencies secured by cryptography and recorded on public ledgers called blockchains. Bitcoin (digital gold) and Ethereum (smart contract network) are the largest. Cryptocurrencies operate without central banking authorities, making them global, peer-to-peer, but highly speculative assets with massive price swings.',
      benefits: ['Potential for massive exponential returns', 'Decentralized structure prevents central censorship', 'Instant global transfer and 24/7 market trading'],
      risks: ['Severe volatility (can crash 50-80% in weeks)', 'Lack of regulatory protections; hack/scam risks', 'Technical complexity and potential for lost private keys'],
      example: 'Investing $1,000 in Bitcoin. Due to market speculation, its price doubles in 6 months, making your investment worth $2,000. However, it could just as easily fall to $300.'
    },
    {
      id: 'inv_realestate',
      title: 'Real Estate & REITs',
      level: 'Intermediate',
      category: 'Investment',
      desc: 'Analyze property investing, rental income, house flipping, and liquid Real Estate Investment Trusts.',
      explanation: 'Real Estate investing involves purchasing physical land or buildings to earn rental income and benefit from property value appreciation. For investors seeking liquidity and low entry capital, REITs (Real Estate Investment Trusts) are corporations that own and operate income-producing real estate. REITs trade like stocks and are legally required to pay out 90% of taxable income to investors as dividends.',
      benefits: ['Tangible asset with historical inflation protection', 'Rental income provides steady recurring cash flow', 'REITs offer real estate exposure with stock-market liquidity'],
      risks: ['Physical real estate is highly illiquid and requires heavy capital', 'Property vacancies, damage, and tenant issues', 'High interest rates increase borrowing costs'],
      example: 'Buying shares of a residential REIT for $1,000. The REIT owns 5,000 apartments, and you receive quarterly dividend checks representing your share of the rents collected.'
    },
    {
      id: 'inv_agriculture',
      title: 'Agriculture Investments',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Support food supply chains by investing in farmland, crop production, and agro-crowdfunding.',
      explanation: 'Agriculture investing supports food and raw material production. Investors can purchase physical farmland, buy agricultural commodity futures contracts (like corn or soy), or invest in agro-crowdfunding platforms that pool funds to lease farmland and purchase seed/equipment, distributing profits after harvest.',
      benefits: ['Direct hedge against rising global food costs', 'Low correlation with stock market volatility', 'Farmland is a finite, highly appreciating physical asset'],
      risks: ['Highly dependent on weather, drought, pests, and climate change', 'Crop price volatility can wipe out season profits', 'Illiquid investments with long payback periods'],
      example: 'Investing $5,000 in an organic grain farm project. You receive a 12% yield paid out after the harvest is processed and sold to distribution chains.'
    },
    {
      id: 'inv_transportation',
      title: 'Transportation & Logistics',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Explore supply chain assets, trucking fleets, shipping lanes, and transit companies.',
      explanation: 'Transportation investing centers on the movement of people and cargo. This includes public shares in airlines, shipping lines, and railroads, or direct private equity investments in regional trucking fleets, cargo containers, or local delivery courier networks.',
      benefits: ['Core pillar of global and local commerce', 'Contracts often feature guaranteed minimum rates', 'Tangible vehicle assets retain residual value'],
      risks: ['Fluctuating fuel prices represent a major expense', 'Economic recessions instantly drag down shipping volumes', 'Heavy equipment maintenance and depreciation costs'],
      example: 'Investing in a private fleet logistics company that acquires short-haul freight trucks. You receive monthly dividends derived from shipping cargo fees.'
    },
    {
      id: 'inv_oilgas',
      title: 'Oil & Gas Investments',
      level: 'Advanced',
      category: 'Investment',
      desc: 'Analyze energy exploration, production, pipeline transport, and master limited partnerships (MLPs).',
      explanation: 'Oil and Gas investments span upstream (exploration and drilling), midstream (pipelines and storage), and downstream (refining and marketing) assets. MLPs (Master Limited Partnerships) are popular publicly traded entities in the energy sector that offer high yields because they pass income directly to partners.',
      benefits: ['Very high dividend yields are common (MLPs)', 'Direct exposure to global energy commodities', 'Significant tax incentives for direct well investments'],
      risks: ['Highly volatile energy commodity prices', 'Environmental liabilities and regulatory transition risks', 'Depleting reserves require constant capital reinvestment'],
      example: 'Investing in an energy MLP that owns natural gas pipelines. The steady flow of gas yields a reliable 7.5% annual dividend payout.'
    },
    {
      id: 'inv_referrals',
      title: 'Business Referral Opportunities',
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
      title: 'Local Buying & Selling (Arbitrage)',
      level: 'Beginner',
      category: 'Investment',
      desc: 'Identify undervalued inventory locally, refurbish, and sell online or in marketplaces.',
      explanation: 'Local commerce arbitrage is purchasing undervalued assets in local settings (thrift stores, garage sales, liquidation auctions) and reselling them at market value online (eBay, Amazon, Facebook Marketplace). This turns sweat equity and local search skills into rapid cash gains.',
      benefits: ['Instant cash cycles and high markup percentages', 'Extremely low barrier to entry', 'Builds fundamental supply/demand and sales skills'],
      risks: ['Requires physical storage space and shipping logistics', 'Unsold inventory represents tied-up cash capital', 'Platform fees and return policies can eat margins'],
      example: 'Buying a vintage designer leather jacket at a garage sale for $15, cleaning it, and reselling it online to a collector for $180.'
    }
  ];

  // 3. Investment Platforms Directory
  const platformDirectory = [
    { name: 'Fidelity Investments', type: 'Stocks, Bonds, Mutual Funds, ETFs', info: 'Well-established brokerage offering zero-fee index funds, fractional shares, and retirement IRAs.' },
    { name: 'Vanguard', type: 'Mutual Funds, ETFs, Retirement', info: 'Pioneer of low-cost index investing, ideal for long-term retirement accounts and set-it-and-forget-it portfolios.' },
    { name: 'Robinhood', type: 'Stocks, Crypto, Option Trading', info: 'User-friendly mobile app offering zero-commission stock trading, recurring deposits, and simple crypto access.' },
    { name: 'Coinbase', type: 'Cryptocurrency', info: 'Leading secure crypto exchange featuring educational lessons that reward you with free crypto tokens.' },
    { name: 'Fundrise', type: 'Real Estate / REITs', info: 'Crowdfunding platform allowing retail investors to buy into diversified portfolios of commercial and residential properties starting at $10.' },
    { name: 'TreasuryDirect', type: 'Treasury Bills, Bonds', info: 'The official U.S. government portal to purchase savings bonds and short-term Treasury Bills directly, bypassing broker fees.' }
  ];

  const handleModuleClick = (mod) => {
    setSelectedModule(mod);
  };

  const handleToggleComplete = (modId) => {
    if (!user) return;
    
    let updatedCompleted = [...(user.completedModules || [])];
    if (updatedCompleted.includes(modId)) {
      updatedCompleted = updatedCompleted.filter(id => id !== modId);
    } else {
      updatedCompleted.push(modId);
    }

    const updatedUser = {
      ...user,
      completedModules: updatedCompleted
    };

    onUpdateUser(updatedUser);
  };

  const activeModules = activeTab === 'education' ? educationModules : investmentModules;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Detail View Overlay */}
      {selectedModule ? (
        <div className="card">
          <button className="back-button" onClick={() => setSelectedModule(null)}>
            ⬅ Back to Learning Hub
          </button>
          
          <div className="module-detail-container">
            
            {/* Left Content */}
            <div className="detail-content">
              <div className="detail-header">
                <span className="badge info">{selectedModule.level}</span>
                <h2 className="detail-title" style={{ marginTop: '8px' }}>{selectedModule.title}</h2>
                <div className="detail-meta">
                  <span>Category: {selectedModule.category}</span>
                  <span>Estimated time: 10 mins</span>
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

            {/* Right Panel Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ backgroundColor: 'var(--bg-surface-muted)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 className="detail-section-title" style={{ fontSize: '16px' }}>Action Center</h4>
                
                {user ? (
                  <button 
                    className="auth-button login" 
                    style={{ width: '100%', justifyContent: 'center', background: user.completedModules?.includes(selectedModule.id) ? 'var(--color-danger)' : 'var(--grad-primary)' }}
                    onClick={() => handleToggleComplete(selectedModule.id)}
                  >
                    {user.completedModules?.includes(selectedModule.id) ? '✖ Mark Incomplete' : '✔ Complete Lesson'}
                  </button>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Sign in to track your learning progress and earn milestones!
                  </div>
                )}

                <button 
                  className="auth-button logout" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onAskAi(`Explain "${selectedModule.title}" and give me practical strategies. Let's discuss it.`)}
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
          {/* Tabs Selector */}
          <div className="module-tabs">
            <button 
              className={`module-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              📘 Financial Education
            </button>
            <button 
              className={`module-tab-btn ${activeTab === 'investments' ? 'active' : ''}`}
              onClick={() => setActiveTab('investments')}
            >
              💼 Investment Modules
            </button>
            <button 
              className={`module-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              🏢 Platform Directory
            </button>
          </div>

          {/* List Content */}
          {activeTab === 'directory' ? (
            <div className="card">
              <h3 className="card-title">🏢 Trusted Investment Platforms Directory</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Below is a curated list of trusted platforms for starting your investment journey. Note: This directory is for educational purposes only. Always do your own research before committing funds.
              </p>
              
              <div className="posts-list">
                {platformDirectory.map((plat, idx) => (
                  <div key={idx} className="card" style={{ backgroundColor: 'var(--bg-surface-muted)', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-main)' }}>{plat.name}</h4>
                      <span className="badge info">{plat.type}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{plat.info}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="modules-grid">
              {activeModules.map((mod) => {
                const isCompleted = user?.completedModules?.includes(mod.id);
                return (
                  <div key={mod.id} className="card module-card" onClick={() => handleModuleClick(mod)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="module-level" style={{ color: mod.level === 'Advanced' ? 'var(--color-danger)' : mod.level === 'Intermediate' ? 'var(--color-warning)' : 'var(--color-info)' }}>
                        {mod.level}
                      </span>
                      {isCompleted && <span className="badge success">Completed</span>}
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
