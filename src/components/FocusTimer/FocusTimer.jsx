import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Timer, Zap } from 'lucide-react';
import './FocusTimer.css';

const FocusTimer = ({ onToggleFocus }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const toggleTimer = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggleFocus(newState);
  };

  const resetTimer = () => {
    setIsActive(false);
    onToggleFocus(false);
    setTimeLeft(25 * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onToggleFocus(false);
      if (timerRef.current) clearInterval(timerRef.current);
      alert("Session Complete! Take a break.");
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, onToggleFocus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`focus-timer-card glass-card ${isActive ? 'timer-active' : ''}`}>
      <div className="timer-header">
        <div className="timer-icon-box">
          <Zap size={14} className={isActive ? 'zap-glow' : ''} />
        </div>
        <span className="timer-title">FOCUS SESSION</span>
      </div>

      <div className="timer-display">
        <h2 className="time-text">{formatTime(timeLeft)}</h2>
        <div className="progress-bg">
          <div 
            className="progress-fill" 
            style={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
          />
        </div>
      </div>

      <div className="timer-controls">
        <button className={`control-btn play-btn ${isActive ? 'active' : ''}`} onClick={toggleTimer}>
          <Play size={18} fill={isActive ? 'currentColor' : 'none'} />
          <span>{isActive ? 'Pause' : 'Start Session'}</span>
        </button>
        <button className="control-btn reset-btn" onClick={resetTimer}>
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
