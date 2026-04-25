import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Code2, Database, GitBranch, Layers, Share2, Terminal, Network, ExternalLink, ChevronRight } from 'lucide-react';
import './DsaRoadmap.css';

const DSA_TOPICS = [
  { 
    id: 'arrays', 
    name: 'Arrays', 
    tag: 'Array', 
    threshold: 10, 
    icon: <Database size={20} />,
    problems: [
      { name: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
      { name: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water' }
    ]
  },
  { 
    id: 'strings', 
    name: 'Strings', 
    tag: 'String', 
    threshold: 10, 
    icon: <Terminal size={20} />,
    problems: [
      { name: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
      { name: 'String to Integer (atoi)', difficulty: 'Medium', link: 'https://leetcode.com/problems/string-to-integer-atoi' }
    ]
  },
  { 
    id: 'linkedlists', 
    name: 'Linked Lists', 
    tag: 'Linked List', 
    threshold: 5, 
    icon: <GitBranch size={20} />,
    problems: [
      { name: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list' },
      { name: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists' },
      { name: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle' }
    ]
  },
  { 
    id: 'stacks', 
    name: 'Stacks & Queues', 
    tag: 'Stack', 
    threshold: 5, 
    icon: <Layers size={20} />,
    problems: [
      { name: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses' },
      { name: 'Min Stack', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack' },
      { name: 'Daily Temperatures', difficulty: 'Medium', link: 'https://leetcode.com/problems/daily-temperatures' }
    ]
  },
  { 
    id: 'trees', 
    name: 'Trees', 
    tag: 'Tree', 
    threshold: 10, 
    icon: <Network size={20} />,
    problems: [
      { name: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree' },
      { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree' },
      { name: 'Validate Binary Search Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree' }
    ]
  },
  { 
    id: 'graphs', 
    name: 'Graphs', 
    tag: 'Graph', 
    threshold: 5, 
    icon: <Share2 size={20} />,
    problems: [
      { name: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands' },
      { name: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph' },
      { name: 'Course Schedule', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule' }
    ]
  },
  { 
    id: 'dp', 
    name: 'Dynamic Programming', 
    tag: 'Dynamic Programming', 
    threshold: 5, 
    icon: <Code2 size={20} />,
    problems: [
      { name: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs' },
      { name: 'Coin Change', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change' },
      { name: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence' }
    ]
  }
];

const DsaRoadmap = ({ skillsData }) => {
  const [activeTopic, setActiveTopic] = useState(null);
  const tags = skillsData?.tagProblemCounts || [];
  
  const getSolvedCount = (tagName) => {
    let count = 0;
    Object.values(tags).forEach(category => {
      const found = category.find(t => t.tagName === tagName);
      if (found) count += found.problemsSolved;
    });
    return count;
  };

  return (
    <div className="roadmap-container animate-in">
      <div className="roadmap-header">
        <h4 className="roadmap-title">DSA MASTERY PATHWAY</h4>
        <p className="roadmap-subtitle">Complete recommended problems to advance through the path.</p>
      </div>

      <div className="roadmap-layout">
        <div className="path-canvas">
          {DSA_TOPICS.map((topic, index) => {
            const solved = getSolvedCount(topic.tag);
            const isUnlocked = solved >= topic.threshold;
            const isLast = index === DSA_TOPICS.length - 1;
            const isActive = activeTopic?.id === topic.id;

            return (
              <div key={topic.id} className={`path-step ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="step-content">
                  <motion.div 
                    className={`node ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setActiveTopic(topic)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="node-icon">
                      {isUnlocked ? topic.icon : <Lock size={18} />}
                    </div>
                    {isUnlocked && <div className="node-glow" />}
                  </motion.div>
                  
                  <div className="node-info" onClick={() => setActiveTopic(topic)}>
                    <span className="node-name">{topic.name}</span>
                    <div className="progress-mini">
                      <span className="progress-text">{solved}/{topic.threshold} solved</span>
                      <div className="bar-bg">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${Math.min((solved / topic.threshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className={`connector ${index % 2 === 0 ? 'to-right' : 'to-left'}`}>
                    <svg width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="none">
                      <path 
                        d={index % 2 === 0 ? "M 20 0 Q 20 40, 80 40 T 80 80" : "M 80 0 Q 80 40, 20 40 T 20 80"}
                        stroke={isUnlocked ? "#00b8a3" : "rgba(255,255,255,0.05)"}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="8 4"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="topic-details-panel">
          <AnimatePresence mode="wait">
            {activeTopic ? (
              <motion.div 
                key={activeTopic.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="details-card glass-card"
              >
                <div className="details-header">
                  <div className="details-icon-box">{activeTopic.icon}</div>
                  <div>
                    <h3>{activeTopic.name}</h3>
                    <p>Must-solve problems to master this topic</p>
                  </div>
                </div>

                <div className="problems-list">
                  {activeTopic.problems.map((prob, i) => (
                    <a 
                      key={i} 
                      href={prob.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="problem-item"
                    >
                      <div className="prob-info">
                        <span className={`prob-diff ${prob.difficulty.toLowerCase()}`}></span>
                        <span className="prob-name">{prob.name}</span>
                      </div>
                      <ExternalLink size={14} className="ext-icon" />
                    </a>
                  ))}
                </div>

                <div className="mastery-tip">
                  <p><strong>Mastery Tip:</strong> Practice variation and edge cases to ensure deep understanding of {activeTopic.name.toLowerCase()}.</p>
                </div>
              </motion.div>
            ) : (
              <div className="details-placeholder glass-card">
                <ChevronRight size={32} className="placeholder-icon" />
                <p>Select a topic node to see recommended problems</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DsaRoadmap;
