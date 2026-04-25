import React, { useState } from 'react';
import StatsCards from '../../components/StatsCards/StatsCards';
import ProblemDistribution from '../../components/ProblemDistribution/ProblemDistribution';
import ContestChart from '../../components/ContestChart/ContestChart';
import Heatmap from '../../components/Heatmap/Heatmap';
import RecentSubmissions from '../../components/RecentSubmissions/RecentSubmissions';
import SkillRadar from '../../components/SkillRadar/SkillRadar';
import MilestoneProgress from '../../components/MilestoneProgress/MilestoneProgress';
import CodingIQ from '../../components/CodingIQ/CodingIQ';
import AiCoach from '../../components/AiCoach/AiCoach';
import CompareStats from '../../components/CompareStats/CompareStats';
import EfficiencyMetrics from '../../components/EfficiencyMetrics/EfficiencyMetrics';
import Achievements from '../../components/Achievements/Achievements';
import FocusTimer from '../../components/FocusTimer/FocusTimer';
import ProblemSwipe from '../../components/ProblemSwipe/ProblemSwipe';
import DsaRoadmap from '../../components/DsaRoadmap/DsaRoadmap';
import { fetchAllUserData } from '../../services/leetcodeApi';
import { ArrowLeft, User, LayoutGrid, BarChart2, ListTodo, Home as HomeIcon, Search, Swords, X, Map } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [compareName, setCompareName] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);

  if (!data) return null;

  const { profile, contest, calendar, submissions, skills } = data;

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!compareName.trim()) return;
    
    setIsLoadingCompare(true);
    try {
      const result = await fetchAllUserData(compareName.trim());
      setComparisonData(result);
      setIsComparing(true);
      setActiveTab('compare');
    } catch (error) {
      alert("Could not find user: " + compareName);
    } finally {
      setIsLoadingCompare(false);
    }
  };

  const getStreaks = (cal) => {
    if (!cal) return { current: 0, longest: 0 };
    let calendarObj = {};
    const raw = cal.submissionCalendar || cal.data?.matchedUser?.userCalendar?.submissionCalendar || cal.matchedUser?.userCalendar?.submissionCalendar || cal;
    try {
      calendarObj = typeof raw === 'string' ? JSON.parse(raw) : raw || {};
    } catch (e) { return { current: 0, longest: 0 }; }
    const timestamps = Object.keys(calendarObj).map(Number).sort((a, b) => a - b);
    if (timestamps.length === 0) return { current: 0, longest: 0 };
    const submissionDates = new Set(timestamps.map(ts => new Date(ts * 1000).toDateString()));
    let current = 0;
    let checkDate = new Date();
    if (!submissionDates.has(checkDate.toDateString())) checkDate.setDate(checkDate.getDate() - 1);
    while (submissionDates.has(checkDate.toDateString())) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    let longest = 0, tempLongest = 0;
    const sortedDates = Array.from(submissionDates).map(d => new Date(d)).sort((a, b) => a - b);
    for (let i = 0; i < sortedDates.length; i++) {
      if (i > 0) {
        const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) tempLongest++; else tempLongest = 1;
      } else tempLongest = 1;
      longest = Math.max(longest, tempLongest);
    }
    return { current, longest };
  };

  const streaks = getStreaks(calendar);

  const renderContent = () => {
    if (activeTab === 'compare' && comparisonData) {
      return (
        <div className="tab-content animate-in">
          <div className="compare-section-header">
            <h4 className="section-subtitle">HEAD-TO-HEAD BATTLE</h4>
            <button className="exit-compare-btn" onClick={() => { setIsComparing(false); setActiveTab('stats'); }}>
              <X size={16} /> Exit Comparison
            </button>
          </div>
          <CompareStats user1={data} user2={comparisonData} />
        </div>
      );
    }

    switch (activeTab) {
      case 'stats':
        return (
          <div className="tab-content animate-in">
            <div className="utility-row" style={{ marginBottom: '32px' }}>
              <FocusTimer onToggleFocus={(active) => setIsFocusActive(active)} />
            </div>

            <div className="stats-top-row">
              <section className="overview-section">
                <h4 className="section-subtitle">OVERVIEW</h4>
                <div className="overview-grid">
                  <div className="overview-card glass-card">
                    <span className="card-label">Total solved</span>
                    <div className="card-value-row"><span className="card-main-val">{profile.totalSolved}</span></div>
                    <span className="card-sub-label">out of {profile.totalQuestions || 3347} problems</span>
                    <div className="mini-progress"><div className="fill" style={{ width: `${(profile.totalSolved / (profile.totalQuestions || 3347)) * 100}%`, background: 'var(--easy)' }}></div></div>
                  </div>
                  <div className="overview-card glass-card">
                    <span className="card-label">Global ranking</span>
                    <div className="card-value-row"><span className="card-main-val">#{profile.ranking?.toLocaleString() || 'N/A'}</span></div>
                    <span className="card-sub-label">worldwide</span>
                    <div className="underline-decor" style={{ background: '#6366f1' }}></div>
                  </div>
                  <div className="overview-card glass-card">
                    <span className="card-label">Acceptance rate</span>
                    <div className="card-value-row"><span className="card-main-val">{(profile.acceptanceRate || 64.2).toFixed(1)}%</span></div>
                    <span className="card-sub-label">all submissions</span>
                    <div className="mini-progress"><div className="fill" style={{ width: `${profile.acceptanceRate || 64.2}%`, background: 'var(--medium)' }}></div></div>
                  </div>
                  <div className="overview-card glass-card streak-card">
                    <span className="card-label">Consistency <span className="fire-badge">🔥</span></span>
                    <div className="card-value-row">
                      <span className="card-main-val">{streaks.current} <span className="streak-unit">days</span></span>
                    </div>
                    <span className="card-sub-label">Longest: {streaks.longest}</span>
                    <div className="mini-progress streak-progress">
                      <div className="fill" style={{ width: `${Math.min((streaks.current / 30) * 100, 100)}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4743)' }}></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="iq-section-wrapper">
                <h4 className="section-subtitle">CODING LEVEL</h4>
                <CodingIQ stats={profile} />
                <Achievements data={data} streaks={streaks} />
              </section>
            </div>

            <section className="difficulty-section">
              <h4 className="section-subtitle">BY DIFFICULTY</h4>
              <StatsCards stats={profile} />
            </section>
            <section className="milestone-section-wrapper" style={{ marginBottom: '40px' }}>
               <MilestoneProgress solvedCount={profile.totalSolved} />
            </section>
            <section className="coach-section-wrapper" style={{ marginBottom: '40px' }}>
              <h4 className="section-subtitle">RECOMMENDED ACTION</h4>
              <AiCoach skillsData={skills} />
            </section>

            <section className="swipe-discovery-wrapper">
              <ProblemSwipe />
            </section>
          </div>
        );
      case 'roadmap':
        return (
          <div className="tab-content animate-in">
            <DsaRoadmap skillsData={skills} />
          </div>
        );
      case 'charts':
        return (
          <div className="tab-content animate-in">
            <h4 className="section-subtitle">VISUALIZATIONS — @{profile.username?.toUpperCase()}</h4>
            <div className="charts-tab-grid">
              <ProblemDistribution stats={profile} />
              <ContestChart contestData={contest} />
            </div>
            <div className="skill-section-wrapper" style={{ marginTop: '30px' }}>
              <EfficiencyMetrics stats={profile} />
            </div>
            <div className="skill-section-wrapper" style={{ marginTop: '30px' }}>
              <SkillRadar skillsData={skills} />
            </div>
            <div className="heatmap-section-wrapper" style={{ marginTop: '30px' }}>
              <Heatmap calendarData={calendar} />
            </div>
          </div>
        );
      case 'submissions':
        return (
          <div className="tab-content animate-in">
            <RecentSubmissions submissions={submissions} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`dashboard-wrapper ${isFocusActive ? 'focus-mode-active' : ''}`}>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={onBack}>
            <div className="logo-lc">LC</div>
            <span className="logo-text">LeetCode Stats</span>
          </div>
          
          <div className="nav-links">
            <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={onBack}>Home</button>
            <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
            <button className={`nav-link ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>Roadmap</button>
            <button className={`nav-link ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>Charts</button>
            <button className={`nav-link ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>Submissions</button>
            {isComparing && <button className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>Compare</button>}
          </div>

          <div className="nav-actions">
            <form className="compare-search-nav" onSubmit={handleCompare}>
              <Search size={14} className="search-icon-small" />
              <input 
                type="text" 
                placeholder="Compare with friend..." 
                value={compareName}
                onChange={(e) => setCompareName(e.target.value)}
              />
              <button type="submit" disabled={isLoadingCompare}>
                {isLoadingCompare ? '...' : 'VS'}
              </button>
            </form>
            <div className="nav-user">
              <div className="user-avatar-small">{profile.username?.[0]?.toUpperCase() || 'U'}</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-page">
        {!isComparing && (
          <header className="dashboard-header-new">
            <div className="user-profile-hero">
              <div className="hero-avatar">{profile.username?.[0]?.toUpperCase() || 'U'}</div>
              <div className="hero-info">
                <h2 className="hero-name">@{profile.username}</h2>
                <p className="hero-subtitle">LeetCode profile stats</p>
              </div>
            </div>
          </header>
        )}

        <main className="dashboard-content-new">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
