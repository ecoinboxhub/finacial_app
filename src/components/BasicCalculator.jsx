import React, { useState } from 'react';
import { useToast } from './ToastContext';

export default function BasicCalculator() {
  const addToast = useToast();
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(null);
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState([]);

  const inputDigit = (digit) => {
    if (newNumber) {
      setDisplay(String(digit));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setOperator(null);
    setPrevValue(null);
    setNewNumber(true);
  };

  const clearEntry = () => {
    setDisplay('0');
    setNewNumber(true);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const percent = () => {
    const num = parseFloat(display);
    setDisplay(String(num / 100));
  };

  const sqrt = () => {
    const num = parseFloat(display);
    if (num < 0) {
      addToast('Cannot calculate square root of a negative number', 'error');
      return;
    }
    const result = Math.sqrt(num);
    setDisplay(String(result));
    setNewNumber(true);
    setHistory(prev => [...prev.slice(-19), `√(${num}) = ${result}`]);
  };

  const square = () => {
    const num = parseFloat(display);
    const result = num * num;
    setDisplay(String(result));
    setNewNumber(true);
    setHistory(prev => [...prev.slice(-19), `${num}² = ${result}`]);
  };

  const reciprocal = () => {
    const num = parseFloat(display);
    if (num === 0) {
      addToast('Cannot divide by zero', 'error');
      return;
    }
    const result = 1 / num;
    setDisplay(String(result));
    setNewNumber(true);
    setHistory(prev => [...prev.slice(-19), `1/${num} = ${result}`]);
  };

  const pi = () => {
    setDisplay(String(Math.PI));
    setNewNumber(true);
  };

  const performOperation = (nextOperator) => {
    const currentValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(currentValue);
    } else if (operator) {
      const result = calculate(prevValue, currentValue, operator);
      setDisplay(String(result));
      setPrevValue(result);
      setHistory(prev => [...prev.slice(-19), `${prevValue} ${operator} ${currentValue} = ${result}`]);
    }

    setNewNumber(true);
    setOperator(nextOperator);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : (addToast('Cannot divide by zero', 'error'), 0);
      default: return b;
    }
  };

  const equals = () => {
    if (operator === null) return;
    const currentValue = parseFloat(display);
    if (prevValue !== null) {
      const result = calculate(prevValue, currentValue, operator);
      setHistory(prev => [...prev.slice(-19), `${prevValue} ${operator} ${currentValue} = ${result}`]);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setNewNumber(true);
    }
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
    addToast('M+ Stored', 'info', 1500);
    setNewNumber(true);
  };

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
      setNewNumber(true);
      addToast('M+ Recalled', 'info', 1500);
    }
  };

  const memoryClear = () => {
    setMemory(null);
    addToast('M+ Cleared', 'info', 1500);
  };

  const clearHistory = () => setHistory([]);

  const btnStyle = (color = 'var(--bg-surface-muted)') => ({
    background: color,
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 8px',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: 'pointer',
    color: 'var(--text-main)',
    transition: 'all 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none'
  });

  return (
    <div className="card page-enter">
      <div className="calculator-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="calc-section-title">🔢 Basic Arithmetic Calculator</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Use buttons below or your keyboard. History of last 20 calculations shown on the right.
          </p>

          <div className="calc-display">
            <div className="calc-display-value">{display}</div>
          </div>

          <div className="calc-keypad">
            <button style={btnStyle('rgba(239,68,68,0.15)')} onClick={clearAll}>AC</button>
            <button style={btnStyle('rgba(239,68,68,0.1)')} onClick={clearEntry}>CE</button>
            <button style={btnStyle()} onClick={backspace}>⌫</button>
            <button style={btnStyle('rgba(59,130,246,0.15)')} onClick={toggleSign}>±</button>

            <button style={btnStyle()} onClick={() => inputDigit(7)}>7</button>
            <button style={btnStyle()} onClick={() => inputDigit(8)}>8</button>
            <button style={btnStyle()} onClick={() => inputDigit(9)}>9</button>
            <button style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#f59e0b' }} onClick={() => performOperation('÷')}>÷</button>

            <button style={btnStyle()} onClick={() => inputDigit(4)}>4</button>
            <button style={btnStyle()} onClick={() => inputDigit(5)}>5</button>
            <button style={btnStyle()} onClick={() => inputDigit(6)}>6</button>
            <button style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#f59e0b' }} onClick={() => performOperation('×')}>×</button>

            <button style={btnStyle()} onClick={() => inputDigit(1)}>1</button>
            <button style={btnStyle()} onClick={() => inputDigit(2)}>2</button>
            <button style={btnStyle()} onClick={() => inputDigit(3)}>3</button>
            <button style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#f59e0b' }} onClick={() => performOperation('-')}>−</button>

            <button style={btnStyle()} onClick={toggleSign}>−/+</button>
            <button style={btnStyle()} onClick={() => inputDigit(0)}>0</button>
            <button style={btnStyle()} onClick={inputDecimal}>.</button>
            <button style={{ ...btnStyle('rgba(16,185,129,0.2)'), color: '#10b981', fontSize: '1.3rem' }} onClick={equals}>=</button>

            <button style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#f59e0b' }} onClick={() => performOperation('+')}>+</button>
            <button style={btnStyle('#1e293b')} onClick={percent}>%</button>
            <button style={btnStyle('#1e293b')} onClick={sqrt}>√</button>
            <button style={btnStyle('#1e293b')} onClick={square}>x²</button>
          </div>

          <div className="calc-memory-row">
            <button className="module-tab-btn btn-press" onClick={memoryStore}>M+ Store</button>
            <button className="module-tab-btn btn-press" onClick={memoryRecall}>MR Recall</button>
            <button className="module-tab-btn btn-press" onClick={memoryClear}>MC Clear</button>
            <button className="module-tab-btn btn-press" onClick={reciprocal}>1/x</button>
            <button className="module-tab-btn btn-press" onClick={pi}>π</button>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>
            {memory !== null && <span>🧠 Memory: {memory} &nbsp;|&nbsp; </span>}
            Keyboard supported: type numbers and +, -, *, /, Enter, Escape
          </div>
        </div>

        <div className="calc-history-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px' }}>📋 History</h4>
            {history.length > 0 && (
              <button className="module-tab-btn btn-press" onClick={clearHistory} style={{ fontSize: '11px', padding: '4px 10px' }}>
                Clear
              </button>
            )}
          </div>
          <div className="calc-history-list">
            {history.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No calculations yet.<br/>Use the keypad or keyboard to start.
              </div>
            ) : (
              [...history].reverse().map((entry, idx) => (
                <div key={idx} className="calc-history-item">
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
