// This is our central file for all quiz-related API calls.
const API_URL = import.meta.env.VITE_API_URL;

// Handles fetching the assessment history
export const getAssessmentHistory = async () => {
  // Note: The URL endpoint '/api/quiz/history' is an example. 
  // You may need to adjust it to match your actual backend route.
  const response = await fetch(`${API_URL}/api/quiz/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch assessment history');
  }
  return response.json();
};