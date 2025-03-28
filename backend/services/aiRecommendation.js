import { GoogleGenerativeAI } from "@google/generative-ai"

class RecommendationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  }

  async generateJobRecommendations(assessmentData) {
    try {
      const prompt = `
        Generate personalized job recommendations based on the following assessment details:
        - Category: ${assessmentData.category}
        - Sub-Industry: ${assessmentData.subIndustry}
        - Quiz Score: ${assessmentData.quizScore}%
        - Specific Areas of Performance:
        ${assessmentData.questions.map(q => 
          `  - ${q.question}: ${q.isCorrect ? 'Correct' : 'Incorrect'}`
        ).join('\n')}

        Provide recommendations in this JSON format:
        {
          "recommendations": [
            {
              "title": "Job Title",
              "matchPercentage": 0-100,
              "requiredSkills": ["Skill1", "Skill2"],
              "missingSkills": ["Skill3", "Skill4"],
              "potentialCareerPath": "Brief description of career trajectory"
            }
          ],
          "skillDevelopmentAreas": ["Area1", "Area2"]
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
      
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error("Error generating job recommendations:", error)
      
      // Fallback recommendations
      return {
        recommendations: [
          {
            title: assessmentData.category === "technical" 
              ? "Software Engineer" 
              : assessmentData.category === "behavioral"
                ? "Project Manager"
                : "Industry Consultant",
            matchPercentage: assessmentData.quizScore,
            requiredSkills: ["Communication", "Technical Skills", "Problem-Solving"],
            missingSkills: this.identifyMissingSkills(assessmentData),
            potentialCareerPath: "Continuous learning and skill development"
          }
        ],
        skillDevelopmentAreas: this.identifyDevelopmentAreas(assessmentData)
      }
    }
  }

  async generateLearningResources(assessmentData) {
    try {
      const prompt = `
        Generate personalized learning resources based on:
        - Category: ${assessmentData.category}
        - Sub-Industry: ${assessmentData.subIndustry}
        - Quiz Score: ${assessmentData.quizScore}%
        - Weak Areas:
        ${assessmentData.questions.filter(q => !q.isCorrect)
          .map(q => `  - ${q.question}`).join('\n')}

        Provide recommendations in this JSON format:
        {
          "learningResources": [
            {
              "title": "Resource Title",
              "type": "Online Course/Certification/Workshop",
              "difficulty": "Beginner/Intermediate/Advanced",
              "focusAreas": ["Skill1", "Skill2"],
              "estimatedCompletionTime": "X weeks",
              "recommendationReason": "Why this resource is suggested"
            }
          ],
          "learningPathway": "Brief description of recommended learning journey"
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
      
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error("Error generating learning resources:", error)
      
      // Fallback learning resources
      return {
        learningResources: [
          {
            title: `${assessmentData.subIndustry} Skill Mastery Course`,
            type: "Online Course",
            difficulty: assessmentData.quizScore < 50 ? "Beginner" : "Intermediate",
            focusAreas: this.identifyMissingSkills(assessmentData),
            estimatedCompletionTime: "8-12 weeks",
            recommendationReason: "Targeted skill development based on assessment"
          }
        ],
        learningPathway: "Structured approach to fill skill gaps and enhance professional capabilities"
      }
    }
  }

  identifyMissingSkills(assessmentData) {
    // Extract questions that were answered incorrectly
    const incorrectQuestions = assessmentData.questions.filter(q => !q.isCorrect)
    
    // Extract key skills or topics from incorrect questions
    const missingSkills = incorrectQuestions.map(q => {
      // This is a simplistic approach and could be enhanced with more sophisticated NLP
      const keywords = [
        "programming", "communication", "leadership", "technical", 
        "problem-solving", "analysis", "strategy", "implementation"
      ]
      
      const matchedSkills = keywords.filter(keyword => 
        q.question.toLowerCase().includes(keyword)
      )
      
      return matchedSkills.length > 0 ? matchedSkills[0] : "Generic Skill"
    })

    // Remove duplicates and limit to top 3
    return [...new Set(missingSkills)].slice(0, 3)
  }

  identifyDevelopmentAreas(assessmentData) {
    const incorrectQuestions = assessmentData.questions.filter(q => !q.isCorrect)
    
    const developmentAreas = incorrectQuestions.map(q => {
      if (assessmentData.category === "technical") {
        return "Technical Skill Enhancement"
      } else if (assessmentData.category === "behavioral") {
        return "Soft Skill Development"
      } else {
        return "Industry Knowledge Expansion"
      }
    })

    return [...new Set(developmentAreas)]
  }
}

export default new RecommendationService()