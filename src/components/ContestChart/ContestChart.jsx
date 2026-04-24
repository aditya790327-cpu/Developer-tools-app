import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ContestChart.css';

const ContestChart = ({ contestData }) => {
  if (!contestData || !contestData.contestParticipation || contestData.contestParticipation.length === 0) {
    return (
      <div className="chart-container glass-card animate-in">
        <h3 className="chart-title">Contest Rating</h3>
        <div className="no-data">No contest participation data found.</div>
      </div>
    );
  }

  // Format data for Recharts
  const data = contestData.contestParticipation.map(item => ({
    name: item.contest.title,
    rating: Math.round(item.rating),
    date: new Date(item.contest.startTime * 1000).toLocaleDateString()
  }));

  return (
    <div className="chart-container glass-card animate-in">
      <h3 className="chart-title">Contest Rating Progress</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="rating" 
              stroke="var(--primary)" 
              fillOpacity={1} 
              fill="url(#colorRating)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContestChart;
