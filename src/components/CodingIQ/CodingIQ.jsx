import React from 'react';
import { Shield, Zap, Star, Crown, Terminal } from 'lucide-react';
import './CodingIQ.css';

const RANKS = [
  { threshold: 0, name: 'Array Amateur', icon: <Terminal size={20} />, color: '#94a3b8' },
  { threshold: 100, name: 'Recursion Rookie', icon: <Zap size={20} />, color: '#00b8a3' },
  { threshold: 500, name: 'Stack Specialist', icon: <Shield size={20} />, color: '#3b82f6' },
  { threshold: 1200, name: 'Binary Beast', icon: <Star size={20} />, color: '#8b5cf6' },
  { threshold: 2500, name: 'Dynamic Dynamo', icon: <Star size={20} />, color: '#f59e0b' },
  { threshold: 5000, name: 'Graph Gladiator', icon: <Crown size={20} />, color: '#ef4743' },
  { threshold: 10000, name: 'Algorithmic Architect', icon: <Crown size={20} />, color: '#ffc01e' }
];

const CodingIQ = ({ stats }) => {
  if (!stats) return null;

  const easy = stats.easySolved || 0;
  const medium = stats.mediumSolved || 0;
  const hard = stats.hardSolved || 0;

  const totalPoints = (easy * 1) + (medium * 3) + (hard * 5);
  
  // Find current rank
  const currentRank = [...RANKS].reverse().find(r => totalPoints >= r.threshold) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1] || null;

  // Level is basically log base of points or similar
  const level = Math.floor(Math.sqrt(totalPoints / 10)) + 1;
  
  // Progress to next rank
  const progress = nextRank 
    ? ((totalPoints - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100 
    : 100;

  // IQ Score (scaled points / total solved * difficulty weight)
  const iqScore = Math.min(200, Math.round(100 + (totalPoints / (stats.totalSolved || 1)) * 10));

  return (
    <div className="iq-container glass-card animate-in">
      <div className="iq-header">
        <div className="iq-main-info">
          <div className="level-badge">LVL {level}</div>
          <h3 className="rank-name" style={{ color: currentRank.color }}>{currentRank.name}</h3>
        </div>
        <div className="iq-score-box">
          <span className="iq-label">Coding IQ</span>
          <span className="iq-value">{iqScore}</span>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-labels">
          <span className="xp-text">{totalPoints.toLocaleString()} XP</span>
          {nextRank && <span className="xp-text">Next: {nextRank.name} ({nextRank.threshold.toLocaleString()} XP)</span>}
        </div>
        <div className="xp-bar-bg">
          <div 
            className="xp-bar-fill" 
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentRank.color}, #fff)` }}
          >
            <div className="xp-glow" />
          </div>
        </div>
      </div>

      <div className="points-breakdown">
        <div className="point-stat">
          <span className="point-val">+{easy * 1}</span>
          <span className="point-label">Easy</span>
        </div>
        <div className="point-stat">
          <span className="point-val">+{medium * 3}</span>
          <span className="point-label">Medium</span>
        </div>
        <div className="point-stat">
          <span className="point-val">+{hard * 5}</span>
          <span className="point-label">Hard</span>
        </div>
      </div>

      <div className="rank-perks">
         <div className="perk-icon" style={{ borderColor: currentRank.color, color: currentRank.color }}>
           {currentRank.icon}
         </div>
         <p className="perk-text">
           Ranked as a <strong>{currentRank.name}</strong> based on your solve distribution and difficulty mastery.
         </p>
      </div>
    </div>
  );
};

export default CodingIQ;
