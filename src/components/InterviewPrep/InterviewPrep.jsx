import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, ChevronRight, ExternalLink, Filter, Search } from 'lucide-react';
import './InterviewPrep.css';

const INTERVIEW_TOPICS = [
  {
    id: 'array-string',
    name: 'Array / String',
    problems: [
      { name: 'Merge Sorted Array', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-sorted-array' },
      { name: 'Remove Element', difficulty: 'Easy', link: 'https://leetcode.com/problems/remove-element' },
      { name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array' },
      { name: 'Majority Element', difficulty: 'Easy', link: 'https://leetcode.com/problems/majority-element' },
      { name: 'Rotate Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-array' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
      { name: 'Best Time to Buy and Sell Stock II', difficulty: 'Medium', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii' },
      { name: 'Jump Game', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game' }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    problems: [
      { name: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome' },
      { name: 'Is Subsequence', difficulty: 'Easy', link: 'https://leetcode.com/problems/is-subsequence' },
      { name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted' },
      { name: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water' },
      { name: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum' }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    problems: [
      { name: 'Minimum Size Subarray Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/minimum-size-subarray-sum' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' }
    ]
  },
  {
    id: 'matrix',
    name: 'Matrix',
    problems: [
      { name: 'Valid Sudoku', difficulty: 'Medium', link: 'https://leetcode.com/problems/valid-sudoku' },
      { name: 'Spiral Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/spiral-matrix' },
      { name: 'Rotate Image', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-image' },
      { name: 'Set Matrix Zeroes', difficulty: 'Medium', link: 'https://leetcode.com/problems/set-matrix-zeroes' }
    ]
  },
  {
    id: 'hashmap',
    name: 'Hashmap',
    problems: [
      { name: 'Ransom Note', difficulty: 'Easy', link: 'https://leetcode.com/problems/ransom-note' },
      { name: 'Isomorphic Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/isomorphic-strings' },
      { name: 'Word Pattern', difficulty: 'Easy', link: 'https://leetcode.com/problems/word-pattern' },
      { name: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram' },
      { name: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams' },
      { name: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum' },
      { name: 'Happy Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/happy-number' }
    ]
  },
  {
    id: 'stack',
    name: 'Stack',
    problems: [
      { name: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses' },
      { name: 'Simplify Path', difficulty: 'Medium', link: 'https://leetcode.com/problems/simplify-path' },
      { name: 'Min Stack', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack' },
      { name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation' }
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    problems: [
      { name: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle' },
      { name: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers' },
      { name: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists' },
      { name: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer' },
      { name: 'Reverse Linked List II', difficulty: 'Medium', link: 'https://leetcode.com/problems/reverse-linked-list-ii' }
    ]
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    problems: [
      { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree' },
      { name: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree' },
      { name: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree' },
      { name: 'Symmetric Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/symmetric-tree' },
      { name: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal' }
    ]
  },
  {
    id: 'graph',
    name: 'Graph',
    problems: [
      { name: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands' },
      { name: 'Surrounded Regions', difficulty: 'Medium', link: 'https://leetcode.com/problems/surrounded-regions' },
      { name: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph' },
      { name: 'Course Schedule', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule' }
    ]
  },
  {
    id: 'dp',
    name: '1D DP',
    problems: [
      { name: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs' },
      { name: 'House Robber', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber' },
      { name: 'Word Break', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break' },
      { name: 'Coin Change', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change' },
      { name: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence' }
    ]
  }
];

const InterviewPrep = () => {
  const [selectedTopic, setSelectedTopic] = useState(INTERVIEW_TOPICS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = INTERVIEW_TOPICS.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.problems.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="interview-container animate-in">
      <div className="interview-header">
        <div className="header-text">
          <Briefcase className="header-icon" size={24} />
          <div>
            <h1>TOP INTERVIEW 150</h1>
            <p>Master the most frequent interview questions curated by LeetCode experts.</p>
          </div>
        </div>
        <div className="header-search">
          <div className="search-box-prep">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search topics or problems..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="interview-layout">
        {/* Left Sidebar: Topics */}
        <div className="topics-sidebar glass-card">
          <div className="sidebar-header">
            <Filter size={14} />
            <span>CATEGORIES</span>
          </div>
          <div className="topics-list-prep">
            {filteredTopics.map(topic => (
              <button 
                key={topic.id}
                className={`topic-btn-prep ${selectedTopic.id === topic.id ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                <span className="topic-dot"></span>
                <span className="topic-name-prep">{topic.name}</span>
                <span className="topic-count-prep">{topic.problems.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content: Problems */}
        <div className="problems-view-prep">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedTopic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="topic-detail-card-prep"
            >
              <div className="detail-title-prep">
                <h2>{selectedTopic.name}</h2>
                <div className="completion-stats">
                  <span>Progress: 0/{selectedTopic.problems.length}</span>
                  <div className="progress-bar-prep">
                    <div className="progress-fill-prep" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>

              <div className="problem-grid-prep">
                {selectedTopic.problems.map((prob, i) => (
                  <a 
                    key={i} 
                    href={prob.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="interview-prob-card glass-card"
                  >
                    <div className="prob-status-indicator">
                      <div className={`status-dot ${prob.difficulty.toLowerCase()}`}></div>
                    </div>
                    <div className="prob-main-prep">
                      <span className="prob-title-prep">{prob.name}</span>
                      <div className="prob-meta-prep">
                        <span className={`diff-badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                        <div className="solve-link">
                          <span>Solve</span>
                          <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                    <div className="prob-check-box">
                      <CheckCircle2 size={20} className="check-icon-prep" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
