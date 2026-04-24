import React from 'react';
import { Trophy, Target, Sparkles } from 'lucide-react';
import './MilestoneProgress.css';

const MILESTONES = [10, 50, 100, 250, 500, 1000, 1500, 2000, 2500, 3000, 3500];

const RANKS = [
  { limit: 50, name: 'Novice', color: '#9ca3af' },
  { limit: 100, name: 'Apprentice', color: '#00b8a3' },
  { limit: 250, name: 'Guardian', color: '#3b82f6' },
  { limit: 500, name: 'Knight', color: '#8b5cf6' },
  { limit: 1000, name: 'Master', color: '#f59e0b' },
  { limit: 2000, name: 'Grandmaster', color: '#ef4743' },
  { limit: Infinity, name: 'Legend', color: '#ffa116' }
];

const MilestoneProgress = ({ solvedCount }) => {
  const currentSolved = solvedCount || 0;
  
  const nextMilestone = MILESTONES.find(m => m > currentSolved) || (Math.ceil(currentSolved / 500) * 500);
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= currentSolved) || 0;
  
  const progress = ((currentSolved - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
  const remaining = nextMilestone - currentSolved;
  
  const currentRank = RANKS.find(r => currentSolved < r.limit) || RANKS[RANKS.length - 1];
  const nextRank = RANKS.find(r => nextMilestone <= r.limit) || currentRank;

  return (
    <div className="milestone-container glass-card animate-in">
      <div className="milestone-header">
        <div className="rank-info">
          <div className="rank-badge" style={{ backgroundColor: `${currentRank.color}22`, color: currentRank.color }}>
            <Trophy size={14} />
            <span>{currentRank.name}</span>
          </div>
          <h3 className="milestone-title">Road to {nextMilestone} Solved</h3>
        </div>
        <div className="milestone-remaining">
          <Target size={14} />
          <span>{remaining} to go</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-labels">
          <span className="milestone-label">{prevMilestone}</span>
          <div className="current-count-wrapper" style={{ left: `${progress}%` }}>
            <span className="current-count">{currentSolved}</span>
            <div className="count-pointer" />
          </div>
          <span className="milestone-label">{nextMilestone}</span>
        </div>
        <div className="milestone-progress-bar">
          <div className="milestone-progress-bg" />
          <div 
            className="milestone-progress-fill" 
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`
            }}
          >
            <div className="progress-glow" />
            <Sparkles size={12} className="progress-sparkle" />
          </div>
        </div>
      </div>

      <div className="milestone-footer">
        <p className="milestone-hint">
          Keep going! You're <strong>{Math.floor(progress)}%</strong> of the way to your next major milestone.
        </p>
      </div>
    </div>
  );
};

export default MilestoneProgress;
