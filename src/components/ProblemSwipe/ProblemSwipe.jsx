import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ExternalLink, RefreshCw, Star, Tag } from 'lucide-react';
import './ProblemSwipe.css';

const RECOMMENDED_PROBLEMS = [
  { id: 1, title: 'Longest Palindromic Substring', difficulty: 'Medium', acRate: '32.4%', tags: ['String', 'Dynamic Programming'] },
  { id: 2, title: 'Trapping Rain Water', difficulty: 'Hard', acRate: '58.9%', tags: ['Array', 'Two Pointers', 'Stack'] },
  { id: 3, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acRate: '35.1%', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
  { id: 4, title: 'Subsets', difficulty: 'Medium', acRate: '71.2%', tags: ['Array', 'Backtracking', 'Bit Manipulation'] },
  { id: 5, title: 'Course Schedule', difficulty: 'Medium', acRate: '45.8%', tags: ['Graph', 'Topological Sort'] }
];

const ProblemSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = (dir) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + 1) % RECOMMENDED_PROBLEMS.length);
  };

  const problem = RECOMMENDED_PROBLEMS[currentIndex];

  return (
    <div className="problem-swipe-section animate-in">
      <div className="swipe-header">
        <Star size={18} color="#f59e0b" fill="#f59e0b" />
        <h4 className="swipe-title">DAILY PICKS FOR YOU</h4>
      </div>

      <div className="swipe-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={`problem-card-swipe glass-card ${problem.difficulty.toLowerCase()}`}
            initial={{ x: direction * 300, opacity: 0, rotate: direction * 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: direction * -300, opacity: 0, rotate: direction * -10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x > 100) handleNext(-1);
              else if (offset.x < -100) handleNext(1);
            }}
          >
            <div className="card-top">
              <span className="diff-tag">{problem.difficulty}</span>
              <span className="ac-rate">{problem.acRate} AC Rate</span>
            </div>
            
            <h3 className="problem-name">{problem.title}</h3>
            
            <div className="problem-tags-row">
              {problem.tags.map((tag, i) => (
                <span key={i} className="mini-tag">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <div className="card-actions">
              <button className="swipe-btn save" onClick={() => handleNext(-1)}>
                <Bookmark size={18} />
                <span>Save</span>
              </button>
              <a 
                href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="swipe-btn solve"
              >
                <ExternalLink size={18} />
                <span>Solve</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="swipe-footer">
        <button className="refresh-btn" onClick={() => handleNext(1)}>
          <RefreshCw size={14} /> Next Suggestion
        </button>
        <span className="swipe-hint">Swipe left/right to browse</span>
      </div>
    </div>
  );
};

export default ProblemSwipe;
