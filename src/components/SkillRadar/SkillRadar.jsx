import React, { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { Award, Target, Flame, Box, Hash } from 'lucide-react';
import './SkillRadar.css';

const CATEGORY_COLOR = {
  advanced:     '#ef4743',
  intermediate: '#ffc01e',
  fundamental:  '#00b8a3',
};

const CATEGORY_LABEL = {
  advanced:     'Advanced',
  intermediate: 'Intermediate',
  fundamental:  'Fundamental',
};

const TOPIC_ICON = {
  'Array': <Box size={14} />,
  'String': <Hash size={14} />,
  'Hash Table': <Hash size={14} />,
  'Dynamic Programming': <Award size={14} />,
  'Math': <Target size={14} />,
  'Sorting': <Flame size={14} />,
};

const parseSkills = (skillsData) => {
  if (!skillsData) return [];
  const counts = skillsData.tagProblemCounts || skillsData.data?.matchedUser?.tagProblemCounts || skillsData.matchedUser?.tagProblemCounts || null;
  if (!counts) return [];

  const all = [];
  ['fundamental', 'intermediate', 'advanced'].forEach(cat => {
    (counts[cat] || []).forEach(item => {
      all.push({
        tag: item.tagName,
        solved: item.problemsSolved,
        category: cat,
      });
    });
  });
  return all.sort((a, b) => b.solved - a.solved);
};

const SkillRadar = ({ skillsData }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const allTags = parseSkills(skillsData);

  if (allTags.length === 0) {
    return (
      <div className="sr-container glass-card animate-in">
        <h3 className="sr-title">Topic Mastery</h3>
        <div className="sr-empty">
          <Award size={48} color="var(--text-muted)" />
          <p>No topic data found. Solve more problems to see your skill breakdown!</p>
        </div>
      </div>
    );
  }

  const top5 = allTags.slice(0, 5);
  const radarData = allTags.slice(0, 8).map(t => ({
    tag: t.tag,
    solved: t.solved,
    fullMark: Math.max(...allTags.map(x => x.solved))
  }));

  const filteredTags = activeCategory === 'all' 
    ? allTags 
    : allTags.filter(t => t.category === activeCategory);

  return (
    <div className="sr-container glass-card animate-in">
      <div className="sr-header">
        <div>
          <h3 className="sr-title">Topic Proficiency</h3>
          <p className="sr-subtitle">Mastery across {allTags.length} unique problem categories</p>
        </div>
      </div>

      <div className="sr-main-grid">
        {/* Left: Radar & Top 5 */}
        <div className="sr-analysis-col">
          <div className="sr-top-5">
            <h4 className="sr-sub-title">Top 5 Topics</h4>
            <div className="top-5-list">
              {top5.map((t, i) => (
                <div key={i} className="top-5-item">
                  <div className="top-5-rank">{i + 1}</div>
                  <div className="top-5-info">
                    <span className="top-5-name">{t.tag}</span>
                    <span className="top-5-count">{t.solved} solved</span>
                  </div>
                  <div className="top-5-bar-bg">
                    <div className="top-5-bar-fill" style={{ width: `${(t.solved / top5[0].solved) * 100}%`, background: CATEGORY_COLOR[t.category] }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sr-radar-wrapper">
             <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="tag" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar
                  name="Solved"
                  dataKey="solved"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Tag Cloud */}
        <div className="sr-cloud-col">
          <div className="sr-tabs">
            {['all', 'fundamental', 'intermediate', 'advanced'].map(cat => (
              <button 
                key={cat} 
                className={`sr-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABEL[cat]}
              </button>
            ))}
          </div>
          
          <div className="tag-cloud">
            {filteredTags.map((t, i) => {
              const size = Math.max(0.7, Math.min(1.2, (t.solved / top5[0].solved) * 1.5));
              return (
                <div 
                  key={i} 
                  className="cloud-tag"
                  style={{ 
                    fontSize: `${size}rem`,
                    color: CATEGORY_COLOR[t.category],
                    background: `${CATEGORY_COLOR[t.category]}15`,
                    borderColor: `${CATEGORY_COLOR[t.category]}30`
                  }}
                >
                  {t.tag} <span className="tag-count">{t.solved}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRadar;
