import React from 'react';
import './RecentSubmissions.css';

const RecentSubmissions = ({ submissions }) => {
  // Handle different API key formats
  const list = submissions?.submission || submissions?.recentSubmissionList || [];

  if (list.length === 0) {
    return (
      <div className="submissions-container glass-card animate-in">
        <h3 className="chart-title">Recent Submissions</h3>
        <div className="no-data">No recent submission activity found.</div>
      </div>
    );
  }

  return (
    <div className="submissions-container glass-card animate-in">
      <h3 className="chart-title">Recent Submissions</h3>
      <div className="submissions-list">
        {list.map((sub, index) => (
          <div key={index} className="submission-item">
            <div className="sub-info">
              <span className="sub-title">{sub.title}</span>
              <span className="sub-time">{sub.relativeTime || new Date(sub.timestamp * 1000).toLocaleDateString()}</span>
            </div>
            <div className={`sub-status ${sub.statusDisplay === 'Accepted' ? 'status-accepted' : 'status-failed'}`}>
              {sub.statusDisplay}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSubmissions;
