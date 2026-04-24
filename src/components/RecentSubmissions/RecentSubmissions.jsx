import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import './RecentSubmissions.css';

const RecentSubmissions = ({ submissions }) => {
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const list = useMemo(() => submissions?.submission || submissions?.recentSubmissionList || [], [submissions]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(list.map(s => s.statusDisplay));
    return ['All statuses', ...Array.from(statuses)];
  }, [list]);

  const filteredList = useMemo(() => {
    return list.filter(sub => {
      return statusFilter === 'All statuses' || sub.statusDisplay === statusFilter;
    });
  }, [list, statusFilter]);

  if (list.length === 0) {
    return (
      <div className="submissions-container-new glass-card animate-in">
        <h3 className="chart-title">Submissions</h3>
        <div className="no-data">No recent submission activity found.</div>
      </div>
    );
  }

  return (
    <div className="submissions-tab-view animate-in">
      <div className="submissions-filter-header">
        <div className="filter-group">
          <label className="filter-label">Filter by status:</label>
          <select 
            className="status-select-new"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="submission-count">
          {filteredList.length} submissions
        </div>
      </div>

      <div className="submissions-table-container glass-card">
        <table className="leet-table">
          <thead>
            <tr>
              <th className="th-id">#</th>
              <th>Problem</th>
              <th>Status</th>
              <th>Language</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((sub, index) => (
              <tr key={index}>
                <td className="td-id">{index + 1}</td>
                <td className="td-problem">{sub.title}</td>
                <td>
                  <span className={`status-pill ${sub.statusDisplay === 'Accepted' ? 'accepted' : sub.statusDisplay === 'Wrong Answer' ? 'wrong' : 'other'}`}>
                    {sub.statusDisplay}
                  </span>
                </td>
                <td>
                  <span className="lang-box">{sub.lang || 'N/A'}</span>
                </td>
                <td className="td-date">
                  {sub.relativeTime || new Date(sub.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSubmissions;
