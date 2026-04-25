import React, { useState, useEffect, useCallback } from 'react';
import { Globe, RefreshCw, Target, Award, AlertCircle, CheckCircle, TrendingUp, Star } from 'lucide-react';
import './MultiPlatformStats.css';

const CF_API = 'https://codeforces.com/api';
const CC_API = 'https://codechef-api.vercel.app/handle';

const MultiPlatformStats = ({ leetcodeId, data: leetcodeData }) => {
  const [handles, setHandles] = useState(() => {
    const saved = localStorage.getItem('cp_handles');
    return saved ? JSON.parse(saved) : { codeforces: '', codechef: '' };
  });

  const [stats, setStats] = useState({
    leetcode:   { solved: 0, extra: '', loading: false, error: null },
    codeforces: { solved: 0, extra: '', loading: false, error: null },
    codechef:   { solved: 0, extra: '', loading: false, error: null },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // 'syncing' | 'done' | 'error'

  // Pull LeetCode solved directly from parent data prop
  useEffect(() => {
    const lc = leetcodeData?.profile?.totalSolved || 0;
    const rank = leetcodeData?.profile?.ranking
      ? `#${Number(leetcodeData.profile.ranking).toLocaleString()} globally`
      : '';
    setStats(prev => ({
      ...prev,
      leetcode: { solved: lc, extra: rank, loading: false, error: null }
    }));
  }, [leetcodeData]);

  // Save handles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cp_handles', JSON.stringify(handles));
  }, [handles]);

  // ── Codeforces ───────────────────────────────────────────────────
  // API docs: https://codeforces.com/api/{methodName}
  const fetchCF = useCallback(async (handle) => {
    if (!handle.trim()) return;
    setStats(prev => ({ ...prev, codeforces: { ...prev.codeforces, loading: true, error: null } }));
    try {
      // 1) user.info — get rating / rank
      const infoRes = await fetch(`${CF_API}/user.info?handles=${handle.trim()}`);
      if (!infoRes.ok) throw new Error(`CF API returned HTTP ${infoRes.status}`);
      const infoData = await infoRes.json();
      if (infoData.status !== 'OK') throw new Error(infoData.comment || 'Handle not found');

      const userInfo = infoData.result[0];
      const ratingLabel = userInfo.rating
        ? `${userInfo.rating} rating · ${userInfo.rank}`
        : 'Unrated';

      // 2) Paginate through ALL submissions (500 per page)
      const PAGE_SIZE = 500;
      const accepted = new Set();
      let from = 1;
      let keepFetching = true;

      while (keepFetching) {
        const statusRes = await fetch(
          `${CF_API}/user.status?handle=${handle.trim()}&from=${from}&count=${PAGE_SIZE}`
        );
        if (!statusRes.ok) throw new Error(`CF status API returned HTTP ${statusRes.status}`);
        const statusData = await statusRes.json();
        if (statusData.status !== 'OK') throw new Error(statusData.comment || 'Status fetch failed');

        const submissions = statusData.result;
        submissions
          .filter(s => s.verdict === 'OK')
          .forEach(s => {
            // Use contestId + index as unique problem key
            const key = `${s.problem.contestId ?? s.problem.name}-${s.problem.index}`;
            accepted.add(key);
          });

        // If fewer than PAGE_SIZE returned, we've fetched everything
        if (submissions.length < PAGE_SIZE) {
          keepFetching = false;
        } else {
          from += PAGE_SIZE;
        }
      }

      setStats(prev => ({
        ...prev,
        codeforces: { solved: accepted.size, extra: ratingLabel, loading: false, error: null }
      }));
    } catch (err) {
      setStats(prev => ({
        ...prev,
        codeforces: { solved: 0, extra: '', loading: false, error: err.message }
      }));
    }
  }, []);

  // ── CodeChef ────────────────────────────────────────────────────
  const fetchCC = useCallback(async (handle) => {
    if (!handle.trim()) return;
    setStats(prev => ({ ...prev, codechef: { ...prev.codechef, loading: true, error: null } }));
    try {
      const res = await fetch(`${CC_API}/${handle.trim()}`);
      if (!res.ok) throw new Error(`CC API returned HTTP ${res.status}`);
      const data = await res.json();
      if (data.success === false) throw new Error(data.message || 'Handle not found');
      const solved = data.fullySolved?.count ?? 0;
      const stars  = data.stars ? `${data.stars} · ${data.rating ?? ''}` : '';
      setStats(prev => ({
        ...prev,
        codechef: { solved, extra: stars, loading: false, error: null }
      }));
    } catch (err) {
      setStats(prev => ({
        ...prev,
        codechef: { solved: 0, extra: '', loading: false, error: err.message }
      }));
    }
  }, []);

  // Auto-fetch on mount if handles are already saved
  useEffect(() => {
    if (handles.codeforces) fetchCF(handles.codeforces);
    if (handles.codechef)   fetchCC(handles.codechef);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncAll = async () => {
    setSyncStatus('syncing');
    const tasks = [];
    if (handles.codeforces) tasks.push(fetchCF(handles.codeforces));
    if (handles.codechef)   tasks.push(fetchCC(handles.codechef));
    await Promise.all(tasks);
    setSyncStatus('done');
    setIsEditing(false);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const totalSolved =
    stats.leetcode.solved + stats.codeforces.solved + stats.codechef.solved;

  const PLATFORMS = [
    { key: 'leetcode',   label: 'LeetCode',   sub: 'Questions Solved', cls: 'leetcode'   },
    { key: 'codeforces', label: 'Codeforces', sub: 'Unique AC Solves', cls: 'codeforces' },
    { key: 'codechef',   label: 'CodeChef',   sub: 'Fully Solved',     cls: 'codechef'   },
  ];

  return (
    <div className="multi-stats-container animate-in">
      {/* Header */}
      <div className="multi-stats-header">
        <div className="multi-header-left">
          <Globe className="globe-icon" size={24} />
          <div>
            <h3>UNIFIED CODING PROFILE</h3>
            <p>Aggregated stats across LeetCode, Codeforces &amp; CodeChef.</p>
          </div>
        </div>
        <div className="header-actions">
          {syncStatus === 'done' && (
            <span className="sync-success">
              <CheckCircle size={14} /> Synced!
            </span>
          )}
          <button className="edit-handles-btn" onClick={() => setIsEditing(v => !v)}>
            {isEditing ? 'Hide Panel' : 'Configure IDs'}
          </button>
        </div>
      </div>

      {/* Config Panel */}
      {isEditing && (
        <div className="handles-config-panel glass-card">
          <div className="config-grid">
            <div className="config-input-group">
              <label>Codeforces Handle</label>
              <input
                type="text"
                placeholder="e.g. tourist"
                value={handles.codeforces}
                onChange={e => setHandles(h => ({ ...h, codeforces: e.target.value }))}
              />
              {stats.codeforces.error && (
                <span className="input-error">
                  <AlertCircle size={12} /> {stats.codeforces.error}
                </span>
              )}
            </div>
            <div className="config-input-group">
              <label>CodeChef Handle</label>
              <input
                type="text"
                placeholder="e.g. genos"
                value={handles.codechef}
                onChange={e => setHandles(h => ({ ...h, codechef: e.target.value }))}
              />
              {stats.codechef.error && (
                <span className="input-error">
                  <AlertCircle size={12} /> {stats.codechef.error}
                </span>
              )}
            </div>
          </div>
          <button
            className={`sync-btn ${syncStatus === 'syncing' ? 'syncing' : ''}`}
            onClick={syncAll}
            disabled={syncStatus === 'syncing'}
          >
            <RefreshCw size={14} className={syncStatus === 'syncing' ? 'spin' : ''} />
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync All Platforms'}
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="total-impact-hero glass-card">
        <div className="impact-main">
          <span className="impact-label">TOTAL PROBLEMS SOLVED</span>
          <h2 className="impact-count">{totalSolved.toLocaleString()}</h2>
        </div>
        <div className="impact-badges">
          <div className="impact-badge"><Award size={16} /><span>Multi-Platform Coder</span></div>
          <div className="impact-badge">
            <Star size={16} />
            <span>{totalSolved >= 500 ? 'Legend' : totalSolved >= 200 ? 'Expert' : totalSolved >= 100 ? 'Intermediate' : 'Rising Star'}</span>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="platform-grid-multi">
        {PLATFORMS.map(({ key, label, sub, cls }) => (
          <div key={key} className={`platform-card-multi glass-card ${cls}`}>
            <div className="p-card-header">
              <span className="p-dot"></span>
              <span>{label}</span>
              {stats[key].loading && <span className="p-loading">syncing…</span>}
            </div>
            <div className="p-card-body">
              {stats[key].loading
                ? <h3 className="loading-dots">···</h3>
                : <h3>{stats[key].solved.toLocaleString()}</h3>
              }
              <span>{sub}</span>
              {stats[key].extra && !stats[key].error && (
                <div className="p-card-extra">
                  <TrendingUp size={11} /> {stats[key].extra}
                </div>
              )}
            </div>
            {stats[key].error && (
              <div className="p-card-error">
                <AlertCircle size={12} /> {stats[key].error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiPlatformStats;
