import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Make sure this is properly set in your .env file
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
    
    console.log("Processed user data:", { industry, experience, skills });
    
    // Create a more structured prompt with explicit instructions
    const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  
    {
      "salaryRanges": [
        { "role": "string", "minSalary": number, "medianSalary": number, "maxSalary": number }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "marketDemand": [
        { "skill": "string", "demandScore": number }
      ],
      "expectedSalaryRange": {
        "min": number,
        "max": number,
        "currency": "USD"
      },
      "skillBasedBoosts": [
        { "skill": "string", "salaryIncrease": number }
      ],
      "topCompanies": [
        { "name": "string", "openPositions": number, "roles": ["string"] }
      ],
      "recommendedCourses": [
        { "name": "string", "platform": "string", "url": "string", "skillsCovered": ["string"] }
      ],
      "careerPathInsights": [
        { "title": "string", "description": "string", "growthPotential": "string" }
      ],
      "emergingTrends": [
        { "name": "string", "description": "string" }
      ],
      "quickInsights": [
        { "title": "string", "type": "string" }
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
  
  // Base data structure
  const baseData = {
    "marketOutlook": "Positive",
    "growthRate": 12,
    "demandLevel": "High",
    "topSkills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
    "salaryRanges": [
      { "role": "Junior Developer", "minSalary": 60000, "medianSalary": 75000, "maxSalary": 90000 },
      { "role": "Mid-level Developer", "minSalary": 80000, "medianSalary": 95000, "maxSalary": 110000 },
      { "role": "Senior Developer", "minSalary": 100000, "medianSalary": 120000, "maxSalary": 150000 }
    ],
    "marketDemand": [
      { "skill": "JavaScript", "demandScore": 85 },
      { "skill": "React", "demandScore": 90 },
      { "skill": "Node.js", "demandScore": 80 },
      { "skill": "Python", "demandScore": 88 },
      { "skill": "AWS", "demandScore": 92 }
    ],
    "topCompanies": [
      { "name": "Google", "openPositions": 150, "roles": ["Software Engineer", "Product Manager"] },
      { "name": "Microsoft", "openPositions": 120, "roles": ["Full Stack Developer", "DevOps Engineer"] },
      { "name": "Amazon", "openPositions": 200, "roles": ["Software Developer", "Solutions Architect"] }
    ],
    "quickInsights": [
      { "title": "Remote work continues to be popular in " + industry, "type": "trend" },
      { "title": "AI skills are increasingly in demand", "type": "trend" },
      { "title": "Cybersecurity concerns are driving new hiring", "type": "alert" }
    ],
    "nextActions": [
      { "title": "Learn cloud technologies", "type": "skill development", "priority": 4 },
      { "title": "Build a portfolio project", "type": "career development", "priority": 5 },
      { "title": "Network with industry professionals", "type": "networking", "priority": 3 }
    ],
    "expectedSalaryRange": {
      "min": 80000,
      "max": 120000,
      "currency": "USD"
    },
    "skillBasedBoosts": [
      { "skill": "AWS", "salaryIncrease": 15000 },
      { "skill": "Machine Learning", "salaryIncrease": 20000 }
    ]
  };
  
  // Customize based on industry
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes('software') || industryLower.includes('web') || industryLower.includes('development')) {
    // Software Development specific data
    return {
      ...baseData,
      "marketOutlook": "Very Positive",
      "growthRate": 15,
      "topSkills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
      "quickInsights": [
        { "title": "Full-stack developers are in high demand", "type": "trend" },
        { "title": "Remote work is standard in software development", "type": "trend" },
        { "title": "AI integration skills becoming essential", "type": "alert" }
      ]
    };
  } 
  else if (industryLower.includes('data') || industryLower.includes('analytics')) {
    // Data Science specific data
    return {
      ...baseData,
      "topSkills": ["Python", "SQL", "Machine Learning", "TensorFlow", "Data Visualization"],
      "salaryRanges": [
        { "role": "Data Analyst", "minSalary": 65000, "medianSalary": 85000, "maxSalary": 105000 },
        { "role": "Data Scientist", "minSalary": 90000, "medianSalary": 115000, "maxSalary": 140000 },
        { "role": "ML Engineer", "minSalary": 110000, "medianSalary": 135000, "maxSalary": 160000 }
      ],
      "topCompanies": [
        { "name": "Google", "openPositions": 120, "roles": ["Data Scientist", "ML Engineer"] },
        { "name": "Amazon", "openPositions": 150, "roles": ["Data Analyst", "Data Engineer"] },
        { "name": "Microsoft", "openPositions": 100, "roles": ["Data Scientist", "AI Researcher"] }
      ]
    };
  }
  else if (industryLower.includes('finance') || industryLower.includes('banking')) {
    // Finance specific data
    return {
      ...baseData,
      "topSkills": ["Financial Analysis", "Excel", "SQL", "Python", "Risk Management"],
      "salaryRanges": [
        { "role": "Financial Analyst", "minSalary": 70000, "medianSalary": 90000, "maxSalary": 110000 },
        { "role": "Investment Banker", "minSalary": 100000, "medianSalary": 150000, "maxSalary": 200000 },
        { "role": "Risk Manager", "minSalary": 85000, "medianSalary": 110000, "maxSalary": 135000 }
      ],
      "topCompanies": [
        { "name": "JPMorgan Chase", "openPositions": 180, "roles": ["Financial Analyst", "Investment Banker"] },
        { "name": "Goldman Sachs", "openPositions": 150, "roles": ["Investment Banker", "Risk Analyst"] },
        { "name": "Bank of America", "openPositions": 200, "roles": ["Financial Advisor", "Credit Analyst"] }
      ]
    };
  }
  
  // Adjust salary based on experience
  const experienceMultiplier = 1 + (Math.min(experience, 15) * 0.05);
  const adjustedData = {...baseData};
  
  // Adjust salary ranges based on experience
  if (adjustedData.salaryRanges) {
    adjustedData.salaryRanges = adjustedData.salaryRanges.map(range => ({
      ...range,
      minSalary: Math.round(range.minSalary * experienceMultiplier),
      medianSalary: Math.round(range.medianSalary * experienceMultiplier),
      maxSalary: Math.round(range.maxSalary * experienceMultiplier)
    }));
  }
  
  
  // Adjust expected salary range
  if (adjustedData.expectedSalaryRange) {
    adjustedData.expectedSalaryRange = {
      ...adjustedData.expectedSalaryRange,
      min: Math.round(adjustedData.expectedSalaryRange.min * experienceMultiplier),
      max: Math.round(adjustedData.expectedSalaryRange.max * experienceMultiplier)
    };
  }
  
  // Add user's skills to market demand if they're not already there
  if (skills && skills.length > 0 && adjustedData.marketDemand) {
    const existingSkills = new Set(adjustedData.marketDemand.map(item => item.skill.toLowerCase()));
    
    skills.forEach(skill => {
      if (!existingSkills.has(skill.toLowerCase())) {
        // Add user's skill with a random demand score between 60-85
        adjustedData.marketDemand.push({
          skill: skill,
          demandScore: Math.floor(Math.random() * 25) + 60
        });
      }
    });
    
    // Sort by demand score
    adjustedData.marketDemand.sort((a, b) => b.demandScore - a.demandScore);
  }
  
  return adjustedData;
}