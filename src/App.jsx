import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import { useLeetcode } from './hooks/useLeetcode';
import './styles/globals.css';
import './styles/App.css';

function App() {
  const [view, setView] = useState('home');
  const { data, loading, error, getStats } = useLeetcode();

  const handleSearch = async (username) => {
    await getStats(username);
    setView('dashboard');
  };

  const handleBack = () => {
    setView('home');
  };

  return (
    <div className="app-container">
      {view === 'home' ? (
        <Home onSearch={handleSearch} loading={loading} />
      ) : (
        <Dashboard data={data} onBack={handleBack} />
      )}
      
      {error && (
        <div className="error-toast glass-card animate-in">
          <p>{error}</p>
          <button onClick={() => setView('home')}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
