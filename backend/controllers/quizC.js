// quizC.js (Backend controller)
const API_URL = 'http://localhost:8000/api/competency-quiz';

export const fetchQuiz = async (category, subIndustry) => {
  try {
    const response = await fetch(`${API_URL}/generate?category=${category}&subIndustry=${subIndustry}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

export const submitQuiz = async (quizData) => {
  try {
    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};

export const getAssessmentHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/assessments`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch assessment history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching assessment history:", error);
    throw error;
  }
};