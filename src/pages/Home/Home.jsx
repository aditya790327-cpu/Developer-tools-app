import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const Home = ({ onSearch, loading }) => {
  return (
    <div className="home-page animate-in">
      <div className="hero-section">
        <h1 className="hero-title gradient-text">LeetCode Insights</h1>
        <p className="hero-subtitle">
          Visualize your LeetCode journey. Track solved problems, contest ratings, and daily activity in one premium dashboard.
        </p>
        <SearchBar onSearch={onSearch} loading={loading} />
      </div>
      <div className="features-preview">
        <div className="feature-dot"><span>●</span> Stats Tracking</div>
        <div className="feature-dot"><span>●</span> Contest History</div>
        <div className="feature-dot"><span>●</span> Submission Heatmap</div>
      </div>
    </div>
  );
};

export default Home;
