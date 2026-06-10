import React, { useState, useRef, useEffect } from 'react';
import { useToast } from './ToastContext';
import type { ChatMessage } from '../types';

interface AiAssistantProps {
  chatPrompt: string;
  clearChatPrompt: () => void;
}

export default function AiAssistant({ chatPrompt, clearChatPrompt }: AiAssistantProps) {
  const addToast = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Financial Assistant. I can help answer questions about budgeting, savings, stocks, real estate, compound interest, risk assessment, or create a custom plan. Ask me anything!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (chatPrompt) {
      handleSendMessage(chatPrompt);
      clearChatPrompt();
    }
  }, [chatPrompt]);

  const getGeminiResponse = async (userText: string): Promise<string> => {
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error(data.error?.message || 'Invalid API response format');
      }
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return `⚠️ API Error: Unable to fetch response from Gemini API. ${err.message}. Falling back to Offline mode.\n\n${getLocalMockResponse(userText)}`;
    }
  };

  const getLocalMockResponse = (text: string): string => {
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
- **High-Yield Savings Accounts (HYSA)**: Standard banks pay 0.01%. High-yield options offer 4% to 5% APY.
- **Compound Interest formula**: $A = P(1 + r/n)^{nt}$.
- **The Rule of 72**: Divide 72 by your annual interest rate to see how many years it takes to double your capital.`;
    } else if (lower.includes('stock') || lower.includes('bond') || lower.includes('mutual')) {
      reply += `💼 **Equities & Fixed Income Overview**
1. **Stocks (Equities)**: Fractional ownership of companies. Historically ~10% annual returns.
2. **Bonds (Debt)**: Safer than stocks, providing stable coupon payments.
3. **ETFs & Mutual Funds**: Bundled companies for instant diversification.`;
    } else if (lower.includes('risk') || lower.includes('suggest')) {
      reply += `⚖️ **Risk Assessment**
- **Low Risk**: T-Bills, HYSAs, CDs, Government Bonds.
- **Moderate Risk**: Multi-asset ETFs, REITs, Blue-chip stocks.
- **High Risk**: Crypto, Forex, Individual tech stocks, Venture capital.

*Rule of Thumb*: Subtract your age from 110 for % in growth assets.`;
    } else if (lower.includes('retirement') || lower.includes('ira') || lower.includes('401k')) {
      reply += `⏳ **Retirement Planning Basics**
- **401(k)**: Capture employer matching (100% risk-free return).
- **Traditional IRA**: Tax-deductible contributions, taxed on withdrawal.
- **Roth IRA**: After-tax contributions, tax-free withdrawals.`;
    } else if (lower.includes('crypto') || lower.includes('bitcoin')) {
      reply += `🪙 **Cryptocurrency**
- **Bitcoin (BTC)**: Digital gold, finite supply (21M max).
- **Ethereum (ETH)**: Smart contract network.
- **Warning**: Crypto can lose 50%+ in weeks. Limit to 1-5% of net worth.`;
    } else {
      reply += `🤔 **General Financial Literacy Advice**
1. **Automate Savings**: Set up auto-transfers on paydays.
2. **Avoid High-Interest Debt**: Pay off 20%+ credit cards first.
3. **Stay Educated**: Complete Learning Hub modules and use Calculators.`;
    }

    return reply;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    const botReply = await getGeminiResponse(text);

    setMessages(prev => [...prev, { sender: 'bot', text: botReply, timestamp: new Date() }]);
    setIsLoading(false);

    const lower = text.toLowerCase();
    if (lower.includes('thank')) {
      addToast('🙌 You are welcome! Keep learning!', 'success', 3000);
    }
  };

  const handleChipClick = (chip: string) => {
    handleSendMessage(chip);
    addToast(`💡 Exploring: "${chip}"`, 'info', 2000);
  };

  const helperChips = [
    'How do I build a budget?',
    'What is compound interest?',
    'Explain Stocks vs Bonds',
    'How does a Roth IRA work?',
    'Evaluate my risk assessment',
  ];

  return (
    <div className="chat-container">
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

      <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}>
        {helperChips.map((chip, idx) => (
          <button
            key={idx}
            className="module-tab-btn"
            style={{ fontSize: '11px', padding: '6px 12px', borderStyle: 'dashed' }}
            onClick={() => handleChipClick(chip)}
          >
            💡 {chip}
          </button>
        ))}
      </div>

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
