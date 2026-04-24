import React from 'react';
import { Users, Swords, TrendingUp } from 'lucide-react';
import './CompareStats.css';

const CompareStats = ({ user1, user2 }) => {
  if (!user1 || !user2) return null;

  const metrics = [
    { label: 'Total Solved', val1: user1.profile.totalSolved, val2: user2.profile.totalSolved },
    { label: 'Easy', val1: user1.profile.easySolved, val2: user2.profile.easySolved },
    { label: 'Medium', val1: user1.profile.mediumSolved, val2: user2.profile.mediumSolved },
    { label: 'Hard', val1: user1.profile.hardSolved, val2: user2.profile.hardSolved },
    { label: 'Acceptance Rate', val1: user1.profile.acceptanceRate, val2: user2.profile.acceptanceRate, suffix: '%' },
    { label: 'Ranking', val1: user1.profile.ranking, val2: user2.profile.ranking, inverse: true }
  ];

  const calculatePoints = (stats) => {
    return (stats.easySolved * 1) + (stats.mediumSolved * 3) + (stats.hardSolved * 5);
  };

  const points1 = calculatePoints(user1.profile);
  const points2 = calculatePoints(user2.profile);

  return (
    <div className="compare-container animate-in">
      <div className="compare-header">
        <div className="compare-user-box">
          <div className="compare-avatar">{user1.profile.username[0].toUpperCase()}</div>
          <span className="compare-name">@{user1.profile.username}</span>
        </div>
        <div className="vs-badge">
          <Swords size={20} />
          <span>VS</span>
        </div>
        <div className="compare-user-box">
          <div className="compare-avatar alt">{user2.profile.username[0].toUpperCase()}</div>
          <span className="compare-name">@{user2.profile.username}</span>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="xp-battle-card glass-card">
          <h4 className="battle-title">XP Battle</h4>
          <div className="battle-bar-container">
            <div className="battle-val">{points1.toLocaleString()} XP</div>
            <div className="battle-track">
              <div 
                className="battle-fill u1" 
                style={{ width: `${(points1 / (points1 + points2)) * 100}%` }}
              ></div>
              <div 
                className="battle-fill u2" 
                style={{ width: `${(points2 / (points1 + points2)) * 100}%` }}
              ></div>
            </div>
            <div className="battle-val right">{points2.toLocaleString()} XP</div>
          </div>
        </div>

        {metrics.map((m, i) => {
          const isWinner1 = m.inverse ? m.val1 < m.val2 : m.val1 > m.val2;
          const isWinner2 = m.inverse ? m.val2 < m.val1 : m.val2 > m.val1;
          
          return (
            <div key={i} className="metric-compare-row glass-card">
              <div className={`metric-val ${isWinner1 ? 'winner' : ''}`}>
                {m.val1?.toLocaleString()}{m.suffix}
                {isWinner1 && <TrendingUp size={14} className="win-icon" />}
              </div>
              <div className="metric-label-mid">{m.label}</div>
              <div className={`metric-val right ${isWinner2 ? 'winner' : ''}`}>
                {isWinner2 && <TrendingUp size={14} className="win-icon" />}
                {m.val2?.toLocaleString()}{m.suffix}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompareStats;
