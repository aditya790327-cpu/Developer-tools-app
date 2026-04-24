import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Target } from 'lucide-react';
import './AiCoach.css';

const AiCoach = ({ skillsData }) => {
  const getSuggestion = () => {
    if (!skillsData) return { topic: 'Arrays', difficulty: 'Medium' };
    
    const counts = skillsData.tagProblemCounts || skillsData.data?.matchedUser?.tagProblemCounts || skillsData.matchedUser?.tagProblemCounts || null;
    if (!counts) return { topic: 'Strings', difficulty: 'Medium' };

    // Combine all tags
    const allTags = [
      ...(counts.fundamental || []),
      ...(counts.intermediate || []),
      ...(counts.advanced || [])
    ];

    if (allTags.length === 0) return { topic: 'Dynamic Programming', difficulty: 'Medium' };

    // Find a "Gap" - a topic with low solves but high importance (intermediate/advanced)
    const sortedTags = [...allTags].sort((a, b) => a.problemsSolved - b.problemsSolved);
    
    // Pick one of the bottom 3
    const gapTag = sortedTags[Math.floor(Math.random() * Math.min(3, sortedTags.length))];
    
    return {
      topic: gapTag.tagName,
      difficulty: Math.random() > 0.7 ? 'Hard' : 'Medium'
    };
  };

  const suggestion = getSuggestion();

  return (
    <div className="coach-card glass-card animate-in">
      <div className="coach-glow" />
      <div className="coach-header">
        <div className="coach-icon">
          <Sparkles size={20} color="#fff" />
        </div>
        <span className="coach-title">AI SKILL COACH</span>
      </div>

      <div className="coach-content">
        <div className="coach-brain">
          <BrainCircuit size={40} className="brain-pulse" />
        </div>
        <div className="coach-text-col">
          <h4 className="suggestion-text">
            Ready to close the gap?
          </h4>
          <p className="suggestion-desc">
            Based on your mastery profile, you're slightly behind on <strong>{suggestion.topic}</strong>.
          </p>
          <div className="suggestion-pill">
            <Target size={14} />
            <span>Try a <strong>{suggestion.difficulty}</strong> problem today</span>
          </div>
        </div>
      </div>

      <a 
        href={`https://leetcode.com/problemset/all/?topicSlugs=${suggestion.topic.toLowerCase().replace(/\s+/g, '-')}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="coach-action-btn"
      >
        Start Practice <ArrowRight size={16} />
      </a>
    </div>
  );
};

export default AiCoach;
