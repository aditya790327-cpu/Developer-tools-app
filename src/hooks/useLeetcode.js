import { useState, useCallback } from 'react';
import { 
  fetchUserProfile, 
  fetchUserSolved,
  fetchContestStats, 
  fetchSubmissionCalendar, 
  fetchRecentSubmissions 
} from '../services/leetcodeApi';

export const useLeetcode = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStats = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      // Primary fetch
      const [profile, solved, contest, calendar, submissions] = await Promise.all([
        fetchUserProfile(username).catch(() => ({})),
        fetchUserSolved(username).catch(() => ({})),
        fetchContestStats(username).catch(() => ({})),
        fetchSubmissionCalendar(username).catch(() => ({})),
        fetchRecentSubmissions(username).catch(() => ({}))
      ]);

      // If profile is empty, it means user was likely not found
      if (!profile.username && !profile.name) {
        throw new Error('User not found or API error');
      }

      // Merge profile and solved data
      const mergedProfile = {
        ...profile,
        totalSolved: solved.solvedProblem || profile.totalSolved || 0,
        easySolved: solved.easySolved || profile.easySolved || 0,
        mediumSolved: solved.mediumSolved || profile.mediumSolved || 0,
        hardSolved: solved.hardSolved || profile.hardSolved || 0,
        totalQuestions: 3300, 
        totalEasy: 820,
        totalMedium: 1650,
        totalHard: 830
      };

      setData({
        profile: mergedProfile,
        contest,
        calendar,
        submissions
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getStats };
};
