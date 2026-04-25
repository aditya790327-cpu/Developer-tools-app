import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Zap, Timer, Cpu, TrendingUp } from 'lucide-react';
import './EfficiencyMetrics.css';

const EfficiencyMetrics = ({ stats }) => {
  // Generate pseudo-normal distribution data for the Bell Curve
  const generateBellCurve = (mean, stdDev) => {
    const data = [];
    for (let i = 0; i <= 100; i += 2) {
      const exponent = -Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2));
      const value = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      data.push({ x: i, y: value });
    }
    return data;
  };

  const bellData = generateBellCurve(50, 15);
  const userPerformance = 78; // Sample "Beats" percentage

  const gaugeData = [
    { name: 'Performance', value: userPerformance },
    { name: 'Remaining', value: 100 - userPerformance }
  ];

  const GAUGE_COLORS = ['#00b8a3', '#1e212b'];

  return (
    <div className="efficiency-container animate-in">
      <div className="eff-header">
        <Zap size={20} className="eff-icon" />
        <h4 className="eff-title">EFFICIENCY INSIGHTS</h4>
      </div>

      <div className="eff-grid">
        {/* Speedometer Gauge */}
        <div className="eff-card gauge-card glass-card">
          <span className="card-label">Runtime Performance</span>
          <div className="gauge-wrapper">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="gauge-center">
              <span className="gauge-val">{userPerformance}%</span>
              <span className="gauge-label">Beats</span>
            </div>
          </div>
          <p className="eff-desc">Faster than average LeetCode submissions.</p>
        </div>

        {/* Bell Curve Distribution */}
        <div className="eff-card distribution-card glass-card">
          <span className="card-label">Community Distribution</span>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={bellData}>
                <defs>
                  <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" hide />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip-eff">
                          {payload[0].payload.x}%ile
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorCurve)" 
                  strokeWidth={2}
                />
                {/* Marker for User */}
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="none"
                  fill="#00b8a3"
                  fillOpacity={0.8}
                  data={bellData.filter(d => d.x >= userPerformance - 1 && d.x <= userPerformance + 1)}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="dist-marker" style={{ left: `${userPerformance}%` }}>
              <div className="marker-dot" />
              <span className="marker-label">You</span>
            </div>
          </div>
          <div className="eff-metrics-row">
            <div className="eff-metric">
              <Timer size={14} />
              <span>Avg: 42ms</span>
            </div>
            <div className="eff-metric">
              <Cpu size={14} />
              <span>Mem: 44.2MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="complexity-insight-footer glass-card">
        <TrendingUp size={16} color="#00b8a3" />
        <span>Your complexity optimization is in the <strong>Top 15%</strong> this month.</span>
      </div>
    </div>
  );
};

export default EfficiencyMetrics;
