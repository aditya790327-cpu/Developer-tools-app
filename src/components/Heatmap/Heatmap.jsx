import React, { useEffect } from 'react';
import './Heatmap.css';

const Heatmap = ({ calendarData }) => {
  // Debug log to see what data is arriving
  useEffect(() => {
    console.log('[Heatmap Data Received]:', calendarData);
  }, [calendarData]);

  const getCalendar = () => {
    if (!calendarData) return {};
    
    if (calendarData.submissionCalendar) return calendarData.submissionCalendar;
    if (calendarData.data?.matchedUser?.userCalendar?.submissionCalendar) return calendarData.data.matchedUser.userCalendar.submissionCalendar;
    if (calendarData.matchedUser?.userCalendar?.submissionCalendar) return calendarData.matchedUser.userCalendar.submissionCalendar;
    
    // If it's already the object
    if (typeof calendarData === 'object' && Object.keys(calendarData).some(k => !isNaN(k))) return calendarData;
    
    return {};
  };

  const calendarSource = getCalendar();
  let calendar = {};
  
  try {
    calendar = typeof calendarSource === 'string' ? JSON.parse(calendarSource) : calendarSource || {};
  } catch (e) {
    console.error("Failed to parse calendar data", e);
  }

  // Get the last 365 days
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setDate(today.getDate() - 365);

  const days = [];
  const monthLabels = [];
  let currentMonth = -1;

  for (let d = new Date(yearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dayTimestamp = Math.floor(new Date(d).setHours(0, 0, 0, 0) / 1000);
    
    if (date.getMonth() !== currentMonth) {
      currentMonth = date.getMonth();
      monthLabels.push({
        name: date.toLocaleString('default', { month: 'short' }),
        index: days.length
      });
    }

    days.push({
      date: new Date(d),
      count: calendar[dayTimestamp] || 0
    });
  }

  const getIntensity = (count) => {
    if (count === 0) return 'level-0';
    if (count < 3) return 'level-1';
    if (count < 6) return 'level-2';
    if (count < 10) return 'level-3';
    return 'level-4';
  };

  return (
    <div className="heatmap-container glass-card animate-in">
      <h3 className="chart-title">Submission Activity</h3>
      <div className="heatmap-layout">
        <div className="day-labels">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div className="heatmap-main">
          <div className="month-labels">
            {monthLabels.map((m, i) => (
              <span key={i} style={{ gridColumnStart: Math.floor(m.index / 7) + 1 }}>
                {m.name}
              </span>
            ))}
          </div>
          <div className="heatmap-scroll">
            <div className="heatmap-grid">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className={`heatmap-day ${getIntensity(day.count)}`}
                  title={`${day.date.toDateString()}: ${day.count} submissions`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-day level-0"></div>
        <div className="heatmap-day level-1"></div>
        <div className="heatmap-day level-2"></div>
        <div className="heatmap-day level-3"></div>
        <div className="heatmap-day level-4"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
