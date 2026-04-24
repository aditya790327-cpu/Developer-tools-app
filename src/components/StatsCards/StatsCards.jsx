import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Easy',
      solved: stats.easySolved,
      total: stats.totalEasy || 820,
      class: 'easy-variant'
    },
    {
      label: 'Medium',
      solved: stats.mediumSolved,
      total: stats.totalMedium || 1740,
      class: 'medium-variant'
    },
    {
      label: 'Hard',
      solved: stats.hardSolved,
      total: stats.totalHard || 787,
      class: 'hard-variant'
    }
  ];

  return (
    <div className="difficulty-grid">
      {cards.map((card, index) => (
        <div key={index} className={`difficulty-card ${card.class} animate-in`} style={{ animationDelay: `${index * 0.1}s` }}>
          <span className="diff-label">{card.label}</span>
          <div className="diff-value-row">
            <span className="diff-count">{card.solved}</span>
          </div>
          <span className="diff-total">out of {card.total}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
