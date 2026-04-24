import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './ProblemDistribution.css';

const ProblemDistribution = ({ stats }) => {
  if (!stats) return null;

  const pieData = [
    { name: 'Easy', value: stats.easySolved, color: '#00b8a3' },
    { name: 'Medium', value: stats.mediumSolved, color: '#ffc01e' },
    { name: 'Hard', value: stats.hardSolved, color: '#ef4743' }
  ];

  const difficultyStats = [
    { label: 'Easy', solved: stats.easySolved, total: stats.totalEasy || 820, color: '#00b8a3' },
    { label: 'Medium', solved: stats.mediumSolved, total: stats.totalMedium || 1740, color: '#ffc01e' },
    { label: 'Hard', solved: stats.hardSolved, total: stats.totalHard || 787, color: '#ef4743' }
  ];

  return (
    <div className="visualizations-container">
      <div className="viz-card glass-card">
        <h3 className="viz-title">Problems solved by difficulty</h3>
        <div className="viz-content">
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <span className="total-val">{stats.totalSolved}</span>
              <span className="total-label">solved</span>
            </div>
          </div>
          <div className="donut-legend">
            {pieData.map((item, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: item.color }}></span>
                <span className="label">{item.name} — {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="viz-card glass-card">
        <h3 className="viz-title">Solved vs total by difficulty</h3>
        <div className="bar-viz-content">
          {difficultyStats.map((item, i) => (
            <div key={i} className="bar-row">
              <span className="bar-label">{item.label}</span>
              <div className="bar-wrapper-full">
                <div className="bar-bg">
                   <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(item.solved / item.total) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  >
                    <span className="count-inside">{item.solved}</span>
                  </div>
                </div>
                <span className="bar-total-val">{item.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemDistribution;
