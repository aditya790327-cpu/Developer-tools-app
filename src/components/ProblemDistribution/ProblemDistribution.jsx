import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ProblemDistribution.css';

const ProblemDistribution = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: 'Easy', value: stats.easySolved, color: 'var(--easy)' },
    { name: 'Medium', value: stats.mediumSolved, color: 'var(--medium)' },
    { name: 'Hard', value: stats.hardSolved, color: 'var(--hard)' }
  ];

  return (
    <div className="chart-container glass-card animate-in">
      <h3 className="chart-title">Difficulty Distribution</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProblemDistribution;
