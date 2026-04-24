const BASE_URL = 'https://alfa-leetcode-api.onrender.com';

export const fetchUserProfile = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
};

export const fetchUserSolved = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}/solved`);
  if (!response.ok) throw new Error('Solved stats not found');
  return response.json();
};

export const fetchContestStats = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}/contest`);
  if (!response.ok) throw new Error('Contest stats not found');
  return response.json();
};

export const fetchSubmissionCalendar = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}/calendar`);
  if (!response.ok) throw new Error('Submission calendar not found');
  return response.json();
};

export const fetchRecentSubmissions = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}/submission`);
  if (!response.ok) throw new Error('Recent submissions not found');
  return response.json();
};

export const fetchSkillStats = async (username) => {
  const response = await fetch(`${BASE_URL}/${username}/skillStats`);
  if (!response.ok) throw new Error('Skill stats not found');
  return response.json();
};

export const fetchAllUserData = async (username) => {
  const [profile, contest, calendar, submissions, skills] = await Promise.all([
    fetchUserProfile(username).catch(() => ({})),
    fetchContestStats(username).catch(() => ({})),
    fetchSubmissionCalendar(username).catch(() => ({})),
    fetchRecentSubmissions(username).catch(() => ({})),
    fetchSkillStats(username).catch(() => ({}))
  ]);
  
  return { profile, contest, calendar, submissions, skills };
};
