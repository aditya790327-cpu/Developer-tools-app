import React from 'react';
import { Crown, Swords } from 'lucide-react';
import './CompareStats.css';

const CompareStats = ({ user1, user2 }) => {
  if (!user1 || !user2) return null;

  // Robust data extractor for both users
  const extractStats = (u) => {
    const p = u.profile || {};
    
    const getAcceptedCount = (diff) => {
      const ac = p.acSubmissionNum || [];
      const found = ac.find(i => i.difficulty === diff);
      return found ? found.count : 0;
    };

    const totalSolved = getAcceptedCount('All') || p.totalSolved || 0;
    const easy = getAcceptedCount('Easy') || p.easySolved || 0;
    const medium = getAcceptedCount('Medium') || p.mediumSolved || 0;
    const hard = getAcceptedCount('Hard') || p.hardSolved || 0;

    const totalSubList = p.totalSubmissionNum || [];
    const allSubs = totalSubList.find(i => i.difficulty === 'All');
    const totalSubs = allSubs ? allSubs.submissions : (totalSolved * 1.5 || 1);
    const acceptedSubs = allSubs ? allSubs.count : totalSolved;

    return {
      username: p.username || 'User',
      totalSolved,
      easy,
      medium,
      hard,
      ranking: p.ranking || 1000000,
      acceptance: ((acceptedSubs / totalSubs) * 100).toFixed(1)
    };
  };

  const s1 = extractStats(user1);
  const s2 = extractStats(user2);

  const calculatePoints = (s) => {
    return (s.easy * 10) + (s.medium * 20) + (s.hard * 30) || 0;
  };

  const xp1 = calculatePoints(s1);
  const xp2 = calculatePoints(s2);
  const totalXp = xp1 + xp2 || 1;

  const metrics = [
    { label: 'TOTAL SOLVED', val1: s1.totalSolved, val2: s2.totalSolved },
    { label: 'EASY', val1: s1.easy, val2: s2.easy },
    { label: 'MEDIUM', val1: s1.medium, val2: s2.medium },
    { label: 'HARD', val1: s1.hard, val2: s2.hard },
    { label: 'ACCEPTANCE', val1: parseFloat(s1.acceptance), val2: parseFloat(s2.acceptance), suffix: '%' },
    { label: 'GLOBAL RANK', val1: s1.ranking, val2: s2.ranking, inverse: true }
  ];

  return (
    <div className="compare-container animate-in">
      <div className="compare-header">
        <div className="compare-user-box left-user">
          <div className="compare-avatar u1-avatar">{s1.username[0].toUpperCase()}</div>
          <span className="compare-name">@{s1.username}</span>
        </div>
        
        <div className="vs-battle-badge">
          <div className="vs-glow"></div>
          <Swords size={32} className="vs-icon-pulse" />
          <span className="vs-text">VS</span>
        </div>

        <div className="compare-user-box right-user">
          <div className="compare-avatar u2-avatar">{s2.username[0].toUpperCase()}</div>
          <span className="compare-name">@{s2.username}</span>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="xp-battle-card glass-card">
          <div className="battle-header">
            <span className={xp1 >= xp2 ? 'winner-text' : ''}>{xp1.toLocaleString()} XP</span>
            <span className="battle-label">XP BATTLE</span>
            <span className={xp2 >= xp1 ? 'winner-text' : ''}>{xp2.toLocaleString()} XP</span>
          </div>
          <div className="battle-track-outer">
            <div 
              className="battle-fill u1" 
              style={{ width: `${(xp1 / totalXp) * 100}%` }}
            ></div>
            <div 
              className="battle-fill u2" 
              style={{ width: `${(xp2 / totalXp) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="comparison-table glass-card">
          {metrics.map((m, i) => {
            const isWinner1 = m.inverse ? m.val1 < m.val2 : m.val1 > m.val2;
            const isWinner2 = m.inverse ? m.val2 < m.val1 : m.val2 > m.val1;
            
            return (
              <div key={i} className="comparison-row-grid">
                <div className={`comp-val-side left-side ${isWinner1 ? 'winner-highlight' : ''}`}>
                  {isWinner1 && <Crown size={16} className="crown-icon-left" />}
                  {m.val1.toLocaleString()}{m.suffix}
                </div>
                
                <div className="comp-label-center">{m.label}</div>
                
                <div className={`comp-val-side right-side ${isWinner2 ? 'winner-highlight' : ''}`}>
                  {m.val2.toLocaleString()}{m.suffix}
                  {isWinner2 && <Crown size={16} className="crown-icon-right" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareStats;
