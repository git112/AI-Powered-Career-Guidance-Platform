import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.2,
    topP: 0.8,
    topK: 40
  }
});

export const generateIndustryInsights = async (userData) => {
  try {
    console.log("Generating insights for:", userData);

    // Extract user data with defaults
    const industry = userData.industry || "Software Development";
    const experience = userData.experience || 1;
    const skills = userData.skills || [];
    const country = userData.country || "US";
    const salaryExpectation = userData.salaryExpectation || "";
    const preferredRoles = userData.preferredRoles || [];
    const isIndianData = userData.isIndianData || (country && country.toLowerCase().includes('india'));

    console.log("Processed user data:", {
      industry,
      experience,
      skills,
      country,
      salaryExpectation,
      preferredRoles,
      isIndianData
    });

    // Create a more structured prompt with explicit instructions
    const currency = "USD"; // Always use USD for currency
    const locationInfo = isIndianData ? " in India" : "";

    const prompt = `Analyze the current state of the ${industry} industry${locationInfo} and provide insights in ONLY the following JSON format without any additional notes or explanations:

    {
      "salaryRanges": [
        { "role": "string", "minSalary": number, "medianSalary": number, "maxSalary": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "marketDemand": [
        { "skill": "string", "demandScore": number, "location": "string" }
      ],
      "expectedSalaryRange": {
        "min": number,
        "max": number,
        "currency": "${currency}",
        "location": "${isIndianData ? 'India' : (location || 'Global')}"
      },
      "skillBasedBoosts": [
        { "skill": "string", "salaryIncrease": number, "location": "string" }
      ],
      "topCompanies": [
        { "name": "string", "openPositions": number, "roles": ["string"], "location": "string" }
      ],
      "recommendedCourses": [
        { "name": "string", "platform": "string", "url": "string", "skillsCovered": ["string"], "location": "string" }
      ],
      "careerPathInsights": [
        { "title": "string", "description": "string", "growthPotential": "string", "location": "string" }
      ],
      "emergingTrends": [
        { "name": "string", "description": "string", "location": "string" }
      ],
      "quickInsights": [
        { "title": "string", "type": "string", "location": "string" }
      ],
      "nextActions": [
        { "title": "string", "description": "string" }
      ]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills in topSkills and marketDemand.
    Include at least 3 companies in topCompanies.
    Include at least 3 courses in recommendedCourses.
    Include at least 3 career paths in careerPathInsights.
    Include at least 3 trends in emergingTrends.
    Include at least 3 quick insights in quickInsights.
    Include at least 3 next actions in nextActions.
    ${isIndianData ? 'All salary amounts should be in Indian Rupees (INR).' : ''}
    ${isIndianData ? 'Include top companies in India.' : ''}
    ${isIndianData ? 'Focus on job market trends in major Indian tech hubs like Bangalore, Hyderabad, and Pune.' : ''}
    ${preferredRoles && preferredRoles.length > 0 ? `Focus on these preferred roles: ${preferredRoles.join(', ')}.` : ''}
    ${salaryExpectation ? `Consider the user's salary expectation of ${salaryExpectation} ${currency} when providing insights.` : ''}
  `;

    console.log("Sending prompt to Gemini:", prompt);

    // Call Gemini API
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Gemini response received");

      // Try to extract JSON from the response
      // Replace the existing JSON parsing block with this:
try {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    const jsonStr = text.substring(jsonStart, jsonEnd);
    let data = JSON.parse(jsonStr);
    console.log("Successfully parsed JSON from Gemini");

    // Handle quickInsights if it's a string
    if (data.quickInsights && typeof data.quickInsights === 'string') {
      try {
        data.quickInsights = JSON.parse(data.quickInsights.replace(/'/g, '"'));
      } catch (error) {
        console.warn("Could not parse quickInsights string, setting to empty array", error);
        data.quickInsights = [];
      }
    }

    return data;
  } else {
    console.error("Could not find JSON in Gemini response");
    throw new Error("Invalid response format");
  }
} catch (parseError) {
  console.error("Error parsing JSON from Gemini:", parseError);
  throw new Error("Failed to parse response");
}
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      throw new Error("Gemini API error");
    }
  } catch (error) {
    console.error("Error in generateIndustryInsights:", error);

    // Return fallback data based on the user's industry
    return generateFallbackData(userData);
  }
};

// Function to generate fallback data based on user's industry
function generateFallbackData(userData) {
  const industry = userData.industry || "Software Development";
  const experience = userData.experience || 1;
  const skills = userData.skills || [];
  const country = userData.country || "US";
  const isIndianData = userData.isIndianData || (country && country.toLowerCase().includes('india'));
  const currency = "USD"; // Always use USD for currency
  const adjustmentFactor = 0.25; // For Indian locations, adjust salary to 1/4 of US salaries

  // Determine location string
  let locationStr = isIndianData ? "India" : "Global";

  // Base data structure
  const baseData = {
    "marketOutlook": "Positive",
    "growthRate": 12,
    "demandLevel": "High",
    "topSkills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
    "salaryRanges": [
      { "role": "Junior Developer", "minSalary": 60000, "medianSalary": 75000, "maxSalary": 90000, "location": locationStr },
      { "role": "Mid-level Developer", "minSalary": 80000, "medianSalary": 95000, "maxSalary": 110000, "location": locationStr },
      { "role": "Senior Developer", "minSalary": 100000, "medianSalary": 120000, "maxSalary": 150000, "location": locationStr }
    ],
    "marketDemand": [
      { "skill": "JavaScript", "demandScore": 85, "location": locationStr },
      { "skill": "React", "demandScore": 90, "location": locationStr },
      { "skill": "Node.js", "demandScore": 80, "location": locationStr },
      { "skill": "Python", "demandScore": 88, "location": locationStr },
      { "skill": "AWS", "demandScore": 92, "location": locationStr }
    ],
    "topCompanies": isIndianData ? [
      { "name": "TCS", "openPositions": 200, "roles": ["Software Engineer", "Project Manager"], "location": "India" },
      { "name": "Infosys", "openPositions": 180, "roles": ["Full Stack Developer", "DevOps Engineer"], "location": "India" },
      { "name": "Wipro", "openPositions": 150, "roles": ["Software Developer", "Solutions Architect"], "location": "India" }
    ] : [
      { "name": "Google", "openPositions": 150, "roles": ["Software Engineer", "Product Manager"], "location": locationStr },
      { "name": "Microsoft", "openPositions": 120, "roles": ["Full Stack Developer", "DevOps Engineer"], "location": locationStr },
      { "name": "Amazon", "openPositions": 200, "roles": ["Software Developer", "Solutions Architect"], "location": locationStr }
    ],
    "quickInsights": [
      { "title": "Remote work continues to be popular in " + industry, "type": "trend", "location": locationStr },
      { "title": "AI skills are increasingly in demand", "type": "trend", "location": locationStr },
      { "title": "Cybersecurity concerns are driving new hiring", "type": "alert", "location": locationStr }
    ],
    "nextActions": [
      { "title": "Learn cloud technologies", "type": "skill development", "priority": 4 },
      { "title": "Build a portfolio project", "type": "career development", "priority": 5 },
      { "title": "Network with industry professionals", "type": "networking", "priority": 3 }
    ],
    "expectedSalaryRange": {
      "min": isIndianData ? 80000 * adjustmentFactor : 80000,
      "max": isIndianData ? 120000 * adjustmentFactor : 120000,
      "currency": currency,
      "location": locationStr
    },
    "skillBasedBoosts": [
      { "skill": "AWS", "salaryIncrease": isIndianData ? 15000 * adjustmentFactor : 15000, "location": locationStr },
      { "skill": "Machine Learning", "salaryIncrease": isIndianData ? 20000 * adjustmentFactor : 20000, "location": locationStr }
    ],
    "isIndianData": isIndianData
  };

  // Customize based on industry
  const industryLower = industry.toLowerCase();

  // Prepare industry-specific data
  let industryData = {};

  if (industryLower.includes('software') || industryLower.includes('web') || industryLower.includes('development')) {
    // Software Development specific data
    industryData = {
      "marketOutlook": "Very Positive",
      "growthRate": 15,
      "topSkills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
      "quickInsights": [
        { "title": "Full-stack developers are in high demand", "type": "trend", "location": locationStr },
        { "title": "Remote work is standard in software development", "type": "trend", "location": locationStr },
        { "title": "AI integration skills becoming essential", "type": "alert", "location": locationStr }
      ]
    };

    // Add India-specific companies if needed
    if (isIndianData) {
      industryData.topCompanies = [
        { "name": "TCS", "openPositions": 250, "roles": ["Software Engineer", "Full Stack Developer"], "location": "India" },
        { "name": "Infosys", "openPositions": 200, "roles": ["React Developer", "Node.js Developer"], "location": "India" },
        { "name": "Wipro", "openPositions": 180, "roles": ["JavaScript Developer", "DevOps Engineer"], "location": "India" }
      ];
    }
  }
  else if (industryLower.includes('data') || industryLower.includes('analytics')) {
    // Data Science specific data
    const salaryMultiplier = isIndianData ? adjustmentFactor : 1;

    industryData = {
      "topSkills": ["Python", "SQL", "Machine Learning", "TensorFlow", "Data Visualization"],
      "salaryRanges": [
        {
          "role": "Data Analyst",
          "minSalary": 65000 * salaryMultiplier,
          "medianSalary": 85000 * salaryMultiplier,
          "maxSalary": 105000 * salaryMultiplier,
          "location": locationStr
        },
        {
          "role": "Data Scientist",
          "minSalary": 90000 * salaryMultiplier,
          "medianSalary": 115000 * salaryMultiplier,
          "maxSalary": 140000 * salaryMultiplier,
          "location": locationStr
        },
        {
          "role": "ML Engineer",
          "minSalary": 110000 * salaryMultiplier,
          "medianSalary": 135000 * salaryMultiplier,
          "maxSalary": 160000 * salaryMultiplier,
          "location": locationStr
        }
      ],
      "topCompanies": isIndianData ? [
        { "name": "Mu Sigma", "openPositions": 120, "roles": ["Data Scientist", "ML Engineer"], "location": "India" },
        { "name": "Tiger Analytics", "openPositions": 100, "roles": ["Data Analyst", "Data Engineer"], "location": "India" },
        { "name": "Fractal Analytics", "openPositions": 80, "roles": ["Data Scientist", "AI Researcher"], "location": "India" }
      ] : [
        { "name": "Google", "openPositions": 120, "roles": ["Data Scientist", "ML Engineer"], "location": locationStr },
        { "name": "Amazon", "openPositions": 150, "roles": ["Data Analyst", "Data Engineer"], "location": locationStr },
        { "name": "Microsoft", "openPositions": 100, "roles": ["Data Scientist", "AI Researcher"], "location": locationStr }
      ]
    };
  }
  else if (industryLower.includes('finance') || industryLower.includes('banking')) {
    // Finance specific data
    const salaryMultiplier = isIndianData ? adjustmentFactor : 1;

    industryData = {
      "topSkills": ["Financial Analysis", "Excel", "SQL", "Python", "Risk Management"],
      "salaryRanges": [
        {
          "role": "Financial Analyst",
          "minSalary": 70000 * salaryMultiplier,
          "medianSalary": 90000 * salaryMultiplier,
          "maxSalary": 110000 * salaryMultiplier,
          "location": locationStr
        },
        {
          "role": "Investment Banker",
          "minSalary": 100000 * salaryMultiplier,
          "medianSalary": 150000 * salaryMultiplier,
          "maxSalary": 200000 * salaryMultiplier,
          "location": locationStr
        },
        {
          "role": "Risk Manager",
          "minSalary": 85000 * salaryMultiplier,
          "medianSalary": 110000 * salaryMultiplier,
          "maxSalary": 135000 * salaryMultiplier,
          "location": locationStr
        }
      ],
      "topCompanies": isIndianData ? [
        { "name": "HDFC Bank", "openPositions": 150, "roles": ["Financial Analyst", "Investment Banker"], "location": "India" },
        { "name": "ICICI Bank", "openPositions": 120, "roles": ["Investment Banker", "Risk Analyst"], "location": "India" },
        { "name": "SBI", "openPositions": 180, "roles": ["Financial Advisor", "Credit Analyst"], "location": "India" }
      ] : [
        { "name": "JPMorgan Chase", "openPositions": 180, "roles": ["Financial Analyst", "Investment Banker"], "location": locationStr },
        { "name": "Goldman Sachs", "openPositions": 150, "roles": ["Investment Banker", "Risk Analyst"], "location": locationStr },
        { "name": "Bank of America", "openPositions": 200, "roles": ["Financial Advisor", "Credit Analyst"], "location": locationStr }
      ]
    };
  }

  // Apply experience multiplier to salaries
  const experienceMultiplier = 1 + (Math.min(experience, 15) * 0.05);

  // Create a merged data object
  const mergedData = { ...baseData, ...industryData };

  // Adjust salary ranges based on experience
  if (mergedData.salaryRanges) {
    mergedData.salaryRanges = mergedData.salaryRanges.map(range => ({
      ...range,
      minSalary: Math.round(range.minSalary * experienceMultiplier),
      medianSalary: Math.round(range.medianSalary * experienceMultiplier),
      maxSalary: Math.round(range.maxSalary * experienceMultiplier)
    }));
  }

  // Adjust expected salary range
  if (mergedData.expectedSalaryRange) {
    mergedData.expectedSalaryRange = {
      ...mergedData.expectedSalaryRange,
      min: Math.round(mergedData.expectedSalaryRange.min * experienceMultiplier),
      max: Math.round(mergedData.expectedSalaryRange.max * experienceMultiplier)
    };
  }

  // Add user's skills to market demand if they're not already there
  if (skills && skills.length > 0 && mergedData.marketDemand) {
    const existingSkills = new Set(mergedData.marketDemand.map(item => item.skill.toLowerCase()));

    skills.forEach(skill => {
      if (!existingSkills.has(skill.toLowerCase())) {
        // Add user's skill with a random demand score between 60-85
        mergedData.marketDemand.push({
          skill: skill,
          demandScore: Math.floor(Math.random() * 25) + 60,
          location: locationStr
        });
      }
    });

    // Sort by demand score
    mergedData.marketDemand.sort((a, b) => b.demandScore - a.demandScore);
  }

  return mergedData;
}