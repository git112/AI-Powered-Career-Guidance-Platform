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

// export const submitQuiz = async (quizData) => {
//   try {
//     console.log('Submitting Quiz Data:', JSON.stringify(quizData, null, 2));
    
//     const response = await fetch(`${API_URL}/submit`, {
//       method: 'POST',
//       credentials: "include",
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(quizData)
//     });

//     // Log full response details
//     console.log('Response Status:', response.status);
//     console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

//     // Try to parse response body even for error responses
//     let responseBody;
//     try {
//       responseBody = await response.text();
//       console.log('Response Body:', responseBody);
//     } catch (parseError) {
//       console.error('Error parsing response body:', parseError);
//     }

//     if (!response.ok) {
//       // Construct a detailed error message
//       const errorDetails = {
//         status: response.status,
//         body: responseBody,
//         quizData: quizData
//       };
      
//       console.error('Quiz Submission Error Details:', errorDetails);
      
//       throw new Error(JSON.stringify(errorDetails));
//     }

//     // Parse response if it's not empty
//     return responseBody ? JSON.parse(responseBody) : {};
//   } catch (error) {
//     console.error('Comprehensive Error Submitting Quiz:', error);
    
//     // Rethrow the error for the caller to handle
//     throw error;
//   }
// };

export const submitQuiz = async (quizData) => {
  try {
    console.log('Submitting Quiz Data:', JSON.stringify(quizData, null, 2));
    
    const response = await fetch(`${API_URL}/submit`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData)
    });

    // More detailed error handling
    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(errorText);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Comprehensive Error Submitting Quiz:', error);
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