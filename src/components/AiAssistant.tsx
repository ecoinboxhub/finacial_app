import React, { useState, useRef, useEffect } from 'react';
import { useToast } from './ToastContext';
import type { ChatMessage } from '../types';

const DEFAULT_GROQ_KEY = 'gsk_7zJ4HU7PrMgW29qEzLh0WGdyb3FYhsuZHWoIPdvZx1BkAh16';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface AiAssistantProps {
  chatPrompt: string;
  clearChatPrompt: () => void;
}

function sanitizeText(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{2300}-\u{23FF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\*\*/g, '')
    .replace(/```/g, '')
    .replace(/`/g, "'")
    .trim();
}

export default function AiAssistant({ chatPrompt, clearChatPrompt }: AiAssistantProps) {
  const addToast = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello. I am your AI Financial Assistant. I can help you with budgeting, savings, stocks, real estate, compound interest, risk assessment, and financial planning. What would you like to learn about?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fin_groq_key');
    if (!stored) {
      localStorage.setItem('fin_groq_key', DEFAULT_GROQ_KEY);
    }
    setApiKeyReady(true);
  }, []);

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

  const getGroqResponse = async (userText: string): Promise<string> => {
    const apiKey = localStorage.getItem('fin_groq_key') || DEFAULT_GROQ_KEY;

    try {
      const systemPrompt = [
        'You are a financial education and investment coach. Your role is to provide clear, accurate, and beginner-friendly financial guidance.',
        '',
        'Response rules:',
        '- Use only plain text with proper punctuation.',
        '- Do not use any emojis, icons, or special Unicode characters.',
        '- Do not use markdown formatting such as asterisks or backticks.',
        '- Use numbered lists or bullet points (hyphens) where appropriate.',
        '- Keep paragraphs short and well-structured.',
        '- Include a disclaimer at the end of each response.',
        '- Focus purely on financial education and literacy.',
        '- Never provide certified legal or investment action advice.',
      ].join('\n');

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Groq API error');
      }

      if (data.choices && data.choices[0]?.message?.content) {
        return sanitizeText(data.choices[0].message.content);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err: any) {
      console.error('Groq API Error:', err);
      const fallback = getLocalMockResponse(userText);
      return `Error: Unable to fetch response from Groq API. ${err.message}.\n\n${fallback}`;
    }
  };

  const getLocalMockResponse = (text: string): string => {
    const lower = text.toLowerCase();

    let reply = 'I am here to help you learn about finance. In offline mode, I can provide preset guidance. The Groq API key is configured and will be used when the connection is available.\n\n';

    if (lower.includes('budget')) {
      reply += 'Budgeting Guidelines:\n'
        + '- The 50/30/20 rule allocates 50% of income to needs (housing, bills), 30% to wants (dining, hobbies), and 20% to savings and investments.\n'
        + '- Track your daily expenses. Small purchases such as coffee and subscriptions can add up significantly.\n'
        + '- Build an emergency cushion of 3 to 6 months of living costs before investing.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else if (lower.includes('saving') || lower.includes('interest')) {
      reply += 'Understanding Savings and Compound Interest:\n'
        + '- High-yield savings accounts offer 4% to 5% APY compared to standard bank rates of 0.01%.\n'
        + '- Compound interest means your money earns interest on previously earned interest.\n'
        + '- The Rule of 72: Divide 72 by your annual interest rate to estimate how many years it takes to double your money.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else if (lower.includes('stock') || lower.includes('bond') || lower.includes('mutual')) {
      reply += 'Equities and Fixed Income Overview:\n'
        + '- Stocks represent fractional ownership in companies with historically ~10% annual returns.\n'
        + '- Bonds are debt instruments that are safer than stocks and provide stable coupon payments.\n'
        + '- ETFs and mutual funds bundle many companies for instant diversification.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else if (lower.includes('risk') || lower.includes('suggest')) {
      reply += 'Risk Assessment:\n'
        + '- Low risk: Treasury bills, high-yield savings accounts, certificates of deposit, government bonds.\n'
        + '- Moderate risk: Multi-asset ETFs, REITs, blue-chip stocks.\n'
        + '- High risk: Cryptocurrency, forex, individual tech stocks, venture capital.\n'
        + '- Rule of thumb: Subtract your age from 110 to determine the percentage of your portfolio in growth assets.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else if (lower.includes('retirement') || lower.includes('ira') || lower.includes('401k')) {
      reply += 'Retirement Planning Basics:\n'
        + '- 401(k): Capture employer matching for a 100% risk-free return on your contribution.\n'
        + '- Traditional IRA: Tax-deductible contributions with taxes paid on withdrawal.\n'
        + '- Roth IRA: After-tax contributions with tax-free withdrawals in retirement.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else if (lower.includes('crypto') || lower.includes('bitcoin')) {
      reply += 'Cryptocurrency:\n'
        + '- Bitcoin is digital gold with a finite supply of 21 million coins.\n'
        + '- Ethereum is a smart contract network that powers decentralized applications.\n'
        + '- Warning: Cryptocurrency can lose 50% or more in weeks. Limit exposure to 1-5% of your net worth.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    } else {
      reply += 'General Financial Literacy Advice:\n'
        + '- Automate your savings by setting up auto-transfers on paydays.\n'
        + '- Pay off high-interest debt, especially credit cards with rates above 20%, before investing.\n'
        + '- Stay educated by completing Learning Hub modules and using the financial calculators.\n\n'
        + 'Disclaimer: This is for educational purposes only.';
    }

    return reply;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    const botReply = await getGroqResponse(text);

    setMessages(prev => [...prev, { sender: 'bot', text: botReply, timestamp: new Date() }]);
    setIsLoading(false);

    const lower = text.toLowerCase();
    if (lower.includes('thank')) {
      addToast('You are welcome. Keep learning.', 'success', 3000);
    }
  };

  const handleChipClick = (chip: string) => {
    handleSendMessage(chip);
    addToast('Exploring: "' + chip + '"', 'info', 2000);
  };

  const helperChips = [
    'How do I build a budget?',
    'What is compound interest?',
    'Explain Stocks vs Bonds',
    'How does a Roth IRA work?',
    'Evaluate my risk assessment',
  ];

  const hasGroqKey = !!localStorage.getItem('fin_groq_key');

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-bot-info">
          <div className="chat-bot-avatar">AI</div>
          <div>
            <div className="chat-bot-title">AI Financial Coach</div>
            <span className="chat-bot-status">Powered by Groq / llama-3.3-70b</span>
          </div>
        </div>
        {!hasGroqKey && (
          <div className="badge warning" style={{ fontSize: '11px' }}>
            Using Default Key
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
            <span className="loading-dot">●</span>
            <span className="loading-dot" style={{ animationDelay: '0.2s' }}>●</span>
            <span className="loading-dot" style={{ animationDelay: '0.4s' }}>●</span>
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
            {chip}
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
          Send
        </button>
      </div>
    </div>
  );
}
