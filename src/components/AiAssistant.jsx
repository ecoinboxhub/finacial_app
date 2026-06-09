import React, { useState, useRef, useEffect } from 'react';

export default function AiAssistant({ chatPrompt, clearChatPrompt }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Financial Assistant. I can help answer questions about budgeting, savings, stocks, real estate, compound interest, risk assessment, or create a custom plan. Ask me anything!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle external prompts (e.g. from Learning Hub)
  useEffect(() => {
    if (chatPrompt) {
      handleSendMessage(chatPrompt);
      clearChatPrompt();
    }
  }, [chatPrompt]);

  const getGeminiResponse = async (userText) => {
    const apiKey = localStorage.getItem('fin_gemini_key');
    if (!apiKey) {
      return getLocalMockResponse(userText);
    }

    try {
      const systemPrompt = `You are a helpful, certified Financial Education & Investment Coach AI. Keep answers structured, beginner-friendly, and focus purely on financial education. Include clear bullet points or numbered lists where appropriate. Never provide certified legal/investment action advice (always add a disclaimer). Current context: The user is learning about finance.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }]
              }
            ]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error(data.error?.message || 'Invalid API response format');
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      return `⚠️ API Error: Unable to fetch response from Gemini API. ${err.message}. Falling back to Offline mode.\n\n${getLocalMockResponse(userText)}`;
    }
  };

  const getLocalMockResponse = (text) => {
    const lower = text.toLowerCase();
    
    let reply = "I'm here to help you learn about finance! In offline sandbox mode, I can give you preset guidance. If you'd like real-time AI capabilities, please add your **Gemini API Key** in the **Settings** page.\n\n";

    if (lower.includes('budget')) {
      reply += `📋 **Budgeting Guidelines**
A solid budget is your primary shield. Here's how to structure it:
1. **The 50/30/20 Rule**: Allocate 50% of income to *Needs* (housing, bills), 30% to *Wants* (dining, hobbies), and 20% to *Savings/Investments*.
2. **Track Expenses Daily**: Small purchases (coffee, subscriptions) add up and drag your cash flow.
3. **Emergency Cushion**: Before investing, set aside 3 to 6 months of living costs.

*Disclaimer: This is for educational purposes only.*`;
    } else if (lower.includes('saving') || lower.includes('interest')) {
      reply += `📈 **Understanding Savings & Compound Interest**
Interest is either working for you or against you:
- **High-Yield Savings Accounts (HYSA)**: Standard banks pay 0.01%. High-yield options offer 4% to 5% APY, compounding your money safely.
- **Compound Interest formula**: $A = P(1 + r/n)^{nt}$.
- **The Rule of 72**: Divide 72 by your annual interest rate to see how many years it takes to double your capital. (e.g., at 8% growth, your money doubles every 9 years!).`;
    } else if (lower.includes('stock') || lower.includes('bond') || lower.includes('mutual')) {
      reply += `💼 **Equities & Fixed Income Overview**
Building an investment portfolio requires balance:
1. **Stocks (Equities)**: Purchasing fractional ownership of public companies. Highly volatile, but historically yield ~10% annual returns over long terms.
2. **Bonds (Debt)**: Lending funds to governments or businesses. Safer than stocks, providing stable coupon payments.
3. **ETFs & Mutual Funds**: Bundled companies. Ideal for instant diversification to minimize individual company default risks.`;
    } else if (lower.includes('risk') || lower.includes('suggest')) {
      reply += `⚖️ **Risk Assessment & Suggestions**
Before choosing where to put your capital, identify your risk profile:
- **Low Risk (Conservative)**: T-Bills, HYSAs, CDs, and Government Bonds. Perfect if you need the funds in under 3 years.
- **Moderate Risk (Balanced)**: Multi-asset ETFs, REITs, Blue-chip stock portfolios.
- **High Risk (Aggressive)**: Cryptocurrencies, Forex trading, Individual tech stocks, Venture capital.

*Rule of Thumb*: Subtract your age from 110. The resulting number is the percentage of your portfolio that should reside in growth assets (stocks/crypto), with the rest in fixed income (bonds/cash).`;
    } else if (lower.includes('retirement') || lower.includes('ira') || lower.includes('401k')) {
      reply += `⏳ **Retirement Planning Basics**
Maximize tax-advantaged accounts to build long-term assets:
- **401(k)**: Offered by employers. Always contribute enough to capture any employer matching contribution (this is a 100% risk-free return!).
- **Traditional IRA**: Contributions reduce current year taxable income. Growth is deferred, and withdrawals in retirement are taxed.
- **Roth IRA**: Funded with after-tax money. Grow completely tax-free, and future withdrawals are 100% tax-free!`;
    } else if (lower.includes('crypto') || lower.includes('bitcoin')) {
      reply += `🪙 **Cryptocurrency & Decentralized Assets**
Digital tokens representing blockchain ledgers:
- **Bitcoin (BTC)**: Often regarded as digital gold, finite supply (21 Million max).
- **Ethereum (ETH)**: Decentralized computer network for smart contracts.
- **Volatility Warning**: Crypto can lose 50%+ of its value in weeks. Limit allocation to a small percentage (e.g., 1-5%) of your total net worth.`;
    } else {
      reply += `🤔 **General Financial Literacy Advice**
Here are three essential habits for building wealth:
1. **Automate Savings**: Set up automatic transfers to savings/investments on paydays.
2. **Avoid High-Interest Debt**: Credit card balances accruing 20%+ interest will wipe out any investment profits. Pay them off first!
3. **Stay Educated**: Read books, complete our **Learning Hub** modules, and experiment with calculations in the **Calculators** tab.

Let me know if you want to detail a specific topic!`;
    }

    return reply;
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    const botReply = await getGeminiResponse(text);
    
    setMessages(prev => [...prev, { sender: 'bot', text: botReply, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const helperChips = [
    'How do I build a budget?',
    'What is compound interest?',
    'Explain Stocks vs Bonds',
    'How does a Roth IRA work?',
    'Evaluate my risk assessment'
  ];

  return (
    <div className="chat-container">
      
      {/* Header */}
      <div className="chat-header">
        <div className="chat-bot-info">
          <div className="chat-bot-avatar">🤖</div>
          <div>
            <div className="chat-bot-title">AI Financial Coach</div>
            <span className="chat-bot-status">● Online / Sandbox Fallback</span>
          </div>
        </div>
        {!localStorage.getItem('fin_gemini_key') && (
          <div className="badge warning" style={{ fontSize: '11px' }}>
            Offline Mode Active
          </div>
        )}
      </div>

      {/* Messages list */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            <div className="chat-bubble-text" style={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
            <div style={{ fontSize: '9px', textAlign: 'right', marginTop: '6px', opacity: 0.6 }}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', padding: '14px 18px' }}>
            <span style={{ animation: 'fadeIn 1s infinite' }}>●</span>
            <span style={{ animation: 'fadeIn 1s infinite 0.2s' }}>●</span>
            <span style={{ animation: 'fadeIn 1s infinite 0.4s' }}>●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Helper Suggestion Chips */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}>
        {helperChips.map((chip, idx) => (
          <button 
            key={idx}
            className="module-tab-btn"
            style={{ fontSize: '11px', padding: '6px 12px', borderStyle: 'dashed' }}
            onClick={() => handleSendMessage(chip)}
          >
            💡 {chip}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-text-input" 
          placeholder="Ask about budgets, investments, crypto..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <button 
          className="chat-send-btn"
          onClick={() => handleSendMessage()}
          disabled={isLoading}
        >
          ➔
        </button>
      </div>

    </div>
  );
}
