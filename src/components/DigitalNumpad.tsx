import React, { useState, useRef, useEffect } from 'react';

interface DigitalNumpadProps {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  formatDisplay?: (v: number) => string;
  min?: number;
  max?: number;
  step?: number;
}

export default function DigitalNumpad({ value, onChange, label, formatDisplay, min, max, step }: DigitalNumpadProps) {
  const [open, setOpen] = useState(false);
  const [inputStr, setInputStr] = useState('');
  const padRef = useRef<HTMLDivElement>(null);

  const display = formatDisplay ? formatDisplay(value) : String(value);

  const handleOpen = () => {
    setInputStr(value === 0 ? '' : String(value));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKey = (k: string) => {
    if (k === 'backspace') {
      setInputStr(prev => prev.slice(0, -1));
    } else if (k === 'clear') {
      setInputStr('');
    } else if (k === '.') {
      if (!inputStr.includes('.')) {
        setInputStr(prev => prev + '.');
      }
    } else if (k === 'neg') {
      setInputStr(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    } else {
      setInputStr(prev => prev + k);
    }
  };

  const handleConfirm = () => {
    let num = inputStr === '' || inputStr === '-' ? 0 : parseFloat(inputStr);
    if (isNaN(num)) num = 0;
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    if (step !== undefined) num = Math.round(num / step) * step;
    onChange(num);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (padRef.current && !padRef.current.contains(e.target as Node)) {
        handleConfirm();
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, inputStr]);

  return (
    <div className="numpad-wrapper">
      {label && <div className="numpad-label">{label}</div>}
      <div className="numpad-display" onClick={handleOpen} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleOpen()}>
        <span className="numpad-value">{display}</span>
        <span className="numpad-tap-hint">TAP TO EDIT</span>
      </div>
      {open && (
        <div className="numpad-overlay" ref={padRef}>
          <div className="numpad-input-row">
            <span className="numpad-input-display">{inputStr || '0'}</span>
          </div>
          <div className="numpad-grid">
            {['1','2','3','4','5','6','7','8','9', '.', '0', '00'].map(k => (
              <button key={k} className="numpad-key numpad-num" onClick={() => handleKey(k)}>
                {k}
              </button>
            ))}
            <button className="numpad-key numpad-neg" onClick={() => handleKey('neg')}>+/−</button>
            <button className="numpad-key numpad-clear" onClick={() => handleKey('clear')}>C</button>
            <button className="numpad-key numpad-back" onClick={() => handleKey('backspace')}>⌫</button>
          </div>
          <button className="numpad-confirm" onClick={handleConfirm}>✓ CONFIRM</button>
        </div>
      )}
    </div>
  );
}
