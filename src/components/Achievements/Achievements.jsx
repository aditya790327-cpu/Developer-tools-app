import React from 'react';
import { Trophy, Moon, Swords, Flame, Zap, Award } from 'lucide-react';
import './Achievements.css';

const Achievements = ({ data, streaks }) => {
  const { submissions, profile } = data;
  const subList = submissions?.submission || submissions?.recentSubmissionList || [];

  const checkNightOwl = () => {
    return subList.some(sub => {
      const date = new Date(sub.timestamp * 1000);
      const hours = date.getHours();
      return hours >= 0 && hours <= 4;
    });
  };

  const checkHardCarry = () => {
    const last7Days = Date.now() / 1000 - (7 * 24 * 60 * 60);
    const hardSolves = subList.filter(sub => 
      sub.statusDisplay === 'Accepted' && 
      sub.timestamp > last7Days &&
      (sub.title?.toLowerCase().includes('hard') || sub.difficulty === 'Hard') // Difficulty info might be missing in basic list, but let's assume we can detect it
    );
    // Note: The basic submission list often doesn't have difficulty. 
    // For this demo, we'll look at the total hardSolved from profile if needed.
    return profile.hardSolved >= 5; 
  };

  const badges = [
    {
      id: 'night-owl',
      name: 'Night Owl',
      desc: 'Solved a problem between 12 AM – 4 AM',
      icon: <Moon size={24} />,
      unlocked: checkNightOwl()
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      desc: 'Hit a 7-day consistency streak',
      icon: <Flame size={24} />,
      unlocked: (streaks?.longest || 0) >= 7
    },
    {
      id: 'hard-carry',
      name: 'Hard Carry',
      desc: 'Solved 5+ Hard problems',
      icon: <Swords size={24} />,
      unlocked: profile.hardSolved >= 5
    },
    {
      id: 'fast-fingers',
      name: 'Fast Fingers',
      desc: 'Beats 90% of community in speed',
      icon: <Zap size={24} />,
      unlocked: profile.totalSolved > 100 // Sample logic
    },
    {
      id: 'grandmaster',
      name: 'Code Master',
      desc: 'Solved over 500 problems',
      icon: <Trophy size={24} />,
      unlocked: profile.totalSolved >= 500
    }
  ];

  return (
    <div className="achievements-section animate-in">
      <div className="ach-header">
        <Award size={18} color="var(--primary)" />
        <h4 className="ach-title">ACHIEVEMENTS</h4>
      </div>
      
      <div className="badges-grid">
        {badges.map(badge => (
          <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon-wrapper">
              {badge.icon}
              {badge.unlocked && <div className="badge-glow" />}
            </div>
            <div className="badge-info">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-desc">{badge.desc}</span>
            </div>
            {!badge.unlocked && <div className="lock-overlay" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
