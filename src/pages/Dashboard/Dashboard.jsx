import React from 'react';
import StatsCards from '../../components/StatsCards/StatsCards';
import ProblemDistribution from '../../components/ProblemDistribution/ProblemDistribution';
import ContestChart from '../../components/ContestChart/ContestChart';
import Heatmap from '../../components/Heatmap/Heatmap';
import RecentSubmissions from '../../components/RecentSubmissions/RecentSubmissions';
import { ArrowLeft, User } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ data, onBack }) => {
  if (!data) return null;

  const { profile, contest, calendar, submissions } = data;

  return (
    <div className="dashboard-page animate-in">
      <header className="dashboard-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </button>
        <div className="user-profile">
          <div className="avatar-wrapper">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="avatar" />
            ) : (
              <User size={40} />
            )}
          </div>
          <div className="user-info">
            <h2 className="user-name">{profile.name || profile.username}</h2>
            <p className="user-rank">Global Rank: #{profile.ranking?.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="top-stats">
          <StatsCards stats={profile} />
        </section>

        <section className="charts-grid">
          <ProblemDistribution stats={profile} />
          <ContestChart contestData={contest} />
        </section>

        <section className="activity-section">
          <Heatmap calendarData={calendar} />
        </section>

        <section className="submissions-section">
          <RecentSubmissions submissions={submissions} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
