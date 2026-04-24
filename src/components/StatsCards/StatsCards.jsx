import React from 'react';
import { CheckCircle2, Award, Zap, BarChart3 } from 'lucide-react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Solved',
      value: stats.totalSolved,
      total: stats.totalQuestions,
      icon: <CheckCircle2 className="icon-solved" />,
      color: 'var(--primary)'
    },
    {
      title: 'Easy',
      value: stats.easySolved,
      total: stats.totalEasy,
      icon: <Zap className="icon-easy" />,
      color: 'var(--easy)'
    },
    {
      title: 'Medium',
      value: stats.mediumSolved,
      total: stats.totalMedium,
      icon: <Award className="icon-medium" />,
      color: 'var(--medium)'
    },
    {
      title: 'Hard',
      value: stats.hardSolved,
      total: stats.totalHard,
      icon: <BarChart3 className="icon-hard" />,
      color: 'var(--hard)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stats-card glass-card animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="card-header">
            {card.icon}
            <span className="card-title">{card.title}</span>
          </div>
          <div className="card-body">
            <div className="card-value-container">
              <span className="card-value">{card.value}</span>
              <span className="card-total">/ {card.total}</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${(card.value / card.total) * 100}%`,
                  backgroundColor: card.color 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
