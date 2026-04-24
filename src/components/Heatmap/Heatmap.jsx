import React, { useEffect, useState, useRef } from 'react';
import './Heatmap.css';

/* ─── helpers ─── */
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_ABBR   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const getIntensity = (count) => {
  if (count === 0)  return 0;
  if (count < 3)    return 1;
  if (count < 6)    return 2;
  if (count < 10)   return 3;
  return 4;
};

const formatDate = (date) =>
  `${DAY_ABBR[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

/* ─── Tooltip ─── */
const Tooltip = ({ tooltip }) => {
  if (!tooltip.visible) return null;
  return (
    <div
      className="hm-tooltip"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <span className="hm-tooltip-count">
        {tooltip.count} submission{tooltip.count !== 1 ? 's' : ''}
      </span>
      <span className="hm-tooltip-date">{tooltip.date}</span>
    </div>
  );
};

/* ─── Main Component ─── */
const Heatmap = ({ calendarData }) => {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, count: 0, date: '' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* ── Parse calendar data ── */
  const getCalendar = () => {
    if (!calendarData) return {};
    if (calendarData.submissionCalendar) return calendarData.submissionCalendar;
    if (calendarData.data?.matchedUser?.userCalendar?.submissionCalendar)
      return calendarData.data.matchedUser.userCalendar.submissionCalendar;
    if (calendarData.matchedUser?.userCalendar?.submissionCalendar)
      return calendarData.matchedUser.userCalendar.submissionCalendar;
    if (typeof calendarData === 'object' && Object.keys(calendarData).some(k => !isNaN(k)))
      return calendarData;
    return {};
  };

  let calendar = {};
  try {
    const raw = getCalendar();
    calendar = typeof raw === 'string' ? JSON.parse(raw) : raw || {};
  } catch (e) {
    console.error('Heatmap: failed to parse calendar', e);
  }

  /* ── Build 365-day grid ── */
  const today  = new Date();
  const yearAgo = new Date();
  yearAgo.setDate(today.getDate() - 364);

  // Align start to Sunday
  const startDay = new Date(yearAgo);
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const days = [];
  const monthLabels = [];
  let colIndex = 0;
  let lastMonth = -1;

  for (let d = new Date(startDay); d <= today; d.setDate(d.getDate() + 1)) {
    const date   = new Date(d);
    const ts     = Math.floor(new Date(d).setHours(0, 0, 0, 0) / 1000);
    const month  = date.getMonth();
    const col    = Math.floor(days.length / 7);

    if (month !== lastMonth) {
      lastMonth = month;
      monthLabels.push({ name: MONTH_NAMES[month], col });
    }

    days.push({ date, count: calendar[ts] || 0 });
    colIndex = col;
  }

  const totalCols  = Math.ceil(days.length / 7);
  const totalSubs  = Object.values(calendar).reduce((a, b) => a + Number(b), 0);
  const activeDays = Object.values(calendar).filter(v => Number(v) > 0).length;

  /* ── Tooltip handlers ── */
  const handleMouseEnter = (e, day) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();
    const x = cellRect.left - rect.left + cellRect.width / 2;
    const y = cellRect.top  - rect.top  - 52;
    setTooltip({ visible: true, x, y, count: day.count, date: formatDate(day.date) });
  };

  const handleMouseLeave = () => setTooltip(t => ({ ...t, visible: false }));

  return (
    <div className={`heatmap-container glass-card ${visible ? 'hm-visible' : ''}`}>
      {/* header */}
      <div className="hm-header">
        <div>
          <h3 className="hm-title">Submission Activity</h3>
          <p className="hm-subtitle">
            <span className="hm-stat-num">{totalSubs.toLocaleString()}</span> total submissions &bull;&nbsp;
            <span className="hm-stat-num">{activeDays}</span> active days in the last year
          </p>
        </div>
        <div className="hm-streak-badge">
          <span className="hm-streak-icon">🔥</span>
          <span className="hm-streak-text">
            {activeDays > 0 ? `${activeDays} days active` : 'No activity'}
          </span>
        </div>
      </div>

      {/* grid area */}
      <div className="hm-body" ref={containerRef}>
        <Tooltip tooltip={tooltip} />

        {/* month labels row */}
        <div
          className="hm-month-row"
          style={{ gridTemplateColumns: `repeat(${totalCols}, 13px)` }}
        >
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="hm-month-label"
              style={{ gridColumnStart: m.col + 1 }}
            >
              {m.name}
            </span>
          ))}
        </div>

        <div className="hm-grid-row">
          {/* day-of-week labels */}
          <div className="hm-dow-labels">
            {['Mon', 'Wed', 'Fri'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* scrollable heatmap */}
          <div className="hm-scroll">
            <div
              className="hm-grid"
              style={{
                gridTemplateColumns: `repeat(${totalCols}, 13px)`,
                gridTemplateRows:    'repeat(7, 13px)',
              }}
            >
              {days.map((day, i) => {
                const level = getIntensity(day.count);
                const isFuture = day.date > today;
                return (
                  <div
                    key={i}
                    className={`hm-cell level-${isFuture ? 'future' : level}`}
                    onMouseEnter={isFuture ? undefined : (e) => handleMouseEnter(e, day)}
                    onMouseLeave={isFuture ? undefined : handleMouseLeave}
                    style={{ animationDelay: `${Math.min(i * 0.4, 200)}ms` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="hm-legend">
          <span className="hm-legend-label">Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} className={`hm-cell level-${l} hm-legend-cell`} />
          ))}
          <span className="hm-legend-label">More</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
