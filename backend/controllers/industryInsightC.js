import { generateIndustryInsights } from "../services/aiDashboard.js";
import IndustryInsight from "../models/IndustryInsight.js";
import User from "../models/Users.js";

// Get insights for user's industry
export const getInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find insights for the current user
        let insights = await IndustryInsight.findOne({ userId });
        
        if (!insights) {
          return res.status(404).json({ message: "No insights found. Please generate insights first." });
        }
        
        res.status(200).json(insights);
      } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({ message: "Failed to fetch insights" });
      }

};

// Generate new insights
// Inside industryInsightC.js

export const generateInsights = async (req, res) => {
    try {
        console.log('Generating insights with data:', req.body);
        const { industry, experience, skills } = req.body;
        const userId = req.user.id;

        if (!industry) {
            return res.status(400).json({ message: 'Industry is required' });
        }

        try {
            // Generate insights using AI service
            const aiInsights = await generateIndustryInsights({
                industry,
                experience,
                skills: Array.isArray(skills) ? skills : []
            });

            console.log('AI Insights generated:', aiInsights);

            // Find existing insight or create new one
            let insight = await IndustryInsight.findOne({
                userId,
                industry
            });

            // Make sure quickInsights is properly formatted
            let formattedQuickInsights = [];
            if (aiInsights.quickInsights && typeof aiInsights.quickInsights === 'string') {
                try {
                  // It appears to be a string representation of an array
                  const cleanedString = aiInsights.quickInsights
                    .replace(/'/g, '"')       // Replace single quotes with double quotes
                    .replace(/(\w+):/g, '"$1":'); // Add quotes around keys
                    
                  aiInsights.quickInsights = JSON.parse(cleanedString);
                } catch (error) {
                  console.error("Failed to parse quickInsights string:", error);
                  aiInsights.quickInsights = []; // Fallback to empty array
                }
              }
           

            // Transform AI insights to match frontend expectations
            const transformedInsights = {
                industryOverview: aiInsights.marketOutlook || "Industry overview information not available",
                marketDemand: aiInsights.marketDemand || [],
                salaryRanges: aiInsights.salaryRanges || [],
                expectedSalaryRange: aiInsights.expectedSalaryRange || { min: 80000, max: 120000, currency: 'USD' },
                skillBasedBoosts: aiInsights.skillBasedBoosts || [],
                topCompanies: aiInsights.topCompanies || [],
                recommendedCourses: aiInsights.recommendedCourses || [],
                careerPathInsights: aiInsights.nextActions?.map(action => ({
                    title: action.title,
                    description: `Priority: ${action.priority}/5`,
                    growthPotential: action.priority > 3 ? "High" : "Medium"
                })) || [],
                emergingTrends: formattedQuickInsights.filter(insight => insight.type === 'trend')
                    .map(trend => ({
                        name: trend.title,
                        description: "This trend is changing the industry landscape."
                    })) || [],
                quickInsights: formattedQuickInsights
            };

            if (insight) {
                // Update existing insight with transformed data
                Object.assign(insight, transformedInsights);
                insight.lastUpdated = new Date();
                insight.nextUpdate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                await insight.save();
            } else {
                // Create new insight with transformed data
                insight = await IndustryInsight.create({
                    userId,
                    industry,
                    ...transformedInsights,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            }

            // Update user with reference to insights
            await User.findByIdAndUpdate(userId, {
                industryInsight: insight._id
            });

            console.log('Insights saved successfully:', insight._id);
            res.json(insight);
        } catch (error) {
            console.error('Error in AI insights generation or saving:', error);
            
            // Provide fallback insights if AI generation fails
            const fallbackInsights = createSampleInsights(industry, experience, skills);

            const insight = await IndustryInsight.create({
                userId,
                industry,
                ...fallbackInsights,
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            await User.findByIdAndUpdate(userId, {
                industryInsight: insight._id
            });

            console.log('Fallback insights created:', insight._id);
            res.json(insight);
        }
    } catch (error) {
        console.error('Error generating insights:', error);
        res.status(500).json({
            message: 'Failed to generate insights',
            error: error.message
        });
    }
};
// Test endpoint with sample data
export const testInsights = async (req, res) => {
    try {
        const industry = req.query.industry || 'Software Development';
        const experience = parseInt(req.query.experience) || 3;
        const skills = req.query.skills ? req.query.skills.split(',') : ['JavaScript', 'React', 'Node.js'];

        // Create sample insights data
        const sampleInsights = createSampleInsights(industry, experience, skills);

        res.json(sampleInsights);
    } catch (error) {
        console.error('Error in test insights:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to create sample insights data that matches frontend expectations
const createSampleInsights = (industry, experience, skills) => {
    const expLevel = experience < 3 ? 'Junior' : experience < 7 ? 'Mid-level' : 'Senior';

    return {
        industryOverview: `The ${industry} industry is currently experiencing strong growth with increasing demand for skilled professionals. Companies are investing in digital transformation initiatives, creating opportunities for those with relevant skills and experience.`,

        marketDemand: [
            ...(Array.isArray(skills) ? skills.map(skill => ({
                skill,
                demandScore: Math.floor(Math.random() * 30) + 70
            })) : []),
            { skill: 'JavaScript', demandScore: 85 },
            { skill: 'React', demandScore: 90 },
            { skill: 'Node.js', demandScore: 80 },
            { skill: 'Python', demandScore: 75 },
            { skill: 'AWS', demandScore: 85 },
            { skill: 'Docker', demandScore: 70 },
            { skill: 'TypeScript', demandScore: 80 },
            { skill: 'GraphQL', demandScore: 65 }
        ].slice(0, 8), // Limit to 8 skills

        salaryRanges: [
            {
                role: 'Junior Developer',
                minSalary: 60000,
                medianSalary: 75000,
                maxSalary: 90000
            },
            {
                role: 'Mid-level Developer',
                minSalary: 85000,
                medianSalary: 105000,
                maxSalary: 125000
            },
            {
                role: 'Senior Developer',
                minSalary: 120000,
                medianSalary: 145000,
                maxSalary: 180000
            }
        ],

        expectedSalaryRange: {
            min: 85000 + (experience * 5000),
            max: 120000 + (experience * 10000),
            currency: 'USD'
        },

        skillBasedBoosts: [
            { skill: 'AWS', salaryIncrease: 15000 },
            { skill: 'TypeScript', salaryIncrease: 10000 },
            { skill: 'React', salaryIncrease: 12000 },
            { skill: 'GraphQL', salaryIncrease: 8000 }
        ],

        topCompanies: [
            {
                name: 'Google',
                openPositions: 150,
                roles: ['Software Engineer', 'Frontend Developer', 'Backend Developer']
            },
            {
                name: 'Microsoft',
                openPositions: 120,
                roles: ['Full Stack Developer', 'Cloud Engineer', 'DevOps Engineer']
            },
            {
                name: 'Amazon',
                openPositions: 200,
                roles: ['Software Developer', 'AWS Specialist', 'Systems Engineer']
            },
            {
                name: 'Meta',
                openPositions: 100,
                roles: ['React Developer', 'Frontend Engineer', 'Product Engineer']
            }
        ],

        recommendedCourses: [
            {
                name: 'Modern JavaScript for React Developers',
                platform: 'Udemy',
                url: 'https://www.udemy.com',
                skillsCovered: ['JavaScript', 'ES6', 'React']
            },
            {
                name: 'Complete Node.js Developer',
                platform: 'Coursera',
                url: 'https://www.coursera.org',
                skillsCovered: ['Node.js', 'Express', 'MongoDB']
            },
            {
                name: 'AWS Certified Developer',
                platform: 'AWS Training',
                url: 'https://aws.amazon.com/training',
                skillsCovered: ['AWS', 'Cloud', 'DevOps']
            }
        ],

        careerPathInsights: [
            {
                title: `From ${expLevel} to Technical Lead`,
                description: `Transition from ${expLevel} Developer to Technical Lead by developing leadership skills and deepening technical expertise.`,
                growthPotential: 'High'
            },
            {
                title: `${industry} Architect Path`,
                description: `Develop architecture skills to move into a solutions architect role within ${industry}.`,
                growthPotential: 'Medium'
            }
        ],

        emergingTrends: [
            {
                name: 'Remote work opportunities increasing by 30% in this sector',
                description: 'Companies are embracing remote work policies, creating more opportunities for developers to work from anywhere.'
            },
            {
                name: 'Demand for TypeScript skills growing rapidly',
                description: 'TypeScript adoption continues to rise as teams prioritize type safety and improved developer experience.'
            }
        ],

        quickInsights: [
            {
                title: 'Remote work opportunities increasing by 30% in this sector',
                type: 'trend'
            },
            {
                title: 'Demand for TypeScript skills growing rapidly',
                type: 'trend'
            },
            {
                title: 'New AI tools changing development workflows',
                type: 'alert'
            }
        ],

        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    };
};

export const createIndustryInsight = async (req, res) => {
    try {
        const insight = new IndustryInsight(req.body);
        await insight.save();
        res.status(201).json(insight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateIndustryInsight = async (req, res) => {
    try {
        const updatedInsight = await IndustryInsight.findOneAndUpdate(
            { industry: req.params.industry, userId: req.user.id },
            req.body,
            { new: true }
        );
        res.json(updatedInsight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteIndustryInsight = async (req, res) => {
    try {
        await IndustryInsight.findOneAndDelete({ industry: req.params.industry });
        res.json({ message: "Industry insight deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


