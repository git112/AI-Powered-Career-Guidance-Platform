import { generateIndustryInsights } from "../services/aiDashboard.js";
import IndustryInsight from "../models/IndustryInsight.js";
import User from "../models/Users.js";

// Get insights for user's industry
export const getInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const { zipCode } = req.query;

        // Find insights for the current user
        let insights = await IndustryInsight.findOne({ userId });

        if (!insights) {
          return res.status(404).json({ message: "No insights found. Please generate insights first." });
        }

        // If zipCode is provided in the query, adjust the insights for that location
        if (zipCode) {
          insights = await adjustInsightsForLocation(insights, zipCode);
        }
        // If no zipCode provided in query but user has a profile zipCode, use that
        else {
          const user = await User.findById(userId);
          if (user && user.zipCode) {
            // Only adjust if the insights don't already have location data matching the user's profile
            if (!insights.location || insights.location.zipCode !== user.zipCode) {
              insights = await adjustInsightsForLocation(insights, user.zipCode);
            }
          }
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
        const {
            industry,
            experience,
            skills,
            zipCode,
            location,
            country,
            salaryExpectation,
            preferredRoles,
            isIndianData
        } = req.body;
        const userId = req.user.id;

        if (!industry) {
            return res.status(400).json({ message: 'Industry is required' });
        }

        try {
            // Generate insights using AI service with all available profile data
            const aiInsights = await generateIndustryInsights({
                industry,
                experience,
                skills: Array.isArray(skills) ? skills : [],
                zipCode,
                location,
                country,
                salaryExpectation,
                preferredRoles,
                isIndianData: isIndianData || (country && country.toLowerCase().includes('india'))
            });

            console.log('AI Insights generated:', aiInsights);

            // Find existing insight by userId only (so it updates even when industry changes)
            let insight = await IndustryInsight.findOne({
                userId
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

            // Get user data to check for zipCode
            const user = await User.findById(userId);
            const userZipCode = zipCode || (user ? user.zipCode : null);

            // Prepare location data if zipCode is available
            let locationData = {};
            if (userZipCode) {
                const isIndianZipCode = /^[1-9]\d{5}$/.test(userZipCode);
                locationData = {
                    location: {
                        zipCode: userZipCode,
                        country: isIndianZipCode ? 'India' : 'United States',
                        region: isIndianZipCode ? getIndianRegionFromZipCode(userZipCode) : '',
                        city: ''
                    }
                };

                // Adjust salary amounts for Indian locations but keep currency as USD
                if (isIndianZipCode && transformedInsights.expectedSalaryRange) {
                    // Using a factor to adjust salaries for Indian market (approximately 1/4 of US salaries)
                    const adjustmentFactor = 0.25;

                    transformedInsights.expectedSalaryRange.min = Math.round(transformedInsights.expectedSalaryRange.min * adjustmentFactor);
                    transformedInsights.expectedSalaryRange.max = Math.round(transformedInsights.expectedSalaryRange.max * adjustmentFactor);
                    transformedInsights.expectedSalaryRange.currency = 'USD'; // Always keep as USD

                    // Update salary ranges - adjust amounts but keep currency as USD
                    if (transformedInsights.salaryRanges && transformedInsights.salaryRanges.length > 0) {
                        transformedInsights.salaryRanges = transformedInsights.salaryRanges.map(range => ({
                            ...range,
                            minSalary: Math.round(range.minSalary * adjustmentFactor),
                            medianSalary: Math.round(range.medianSalary * adjustmentFactor),
                            maxSalary: Math.round(range.maxSalary * adjustmentFactor)
                        }));
                    }

                    // Update skill boosts - adjust amounts but keep currency as USD
                    if (transformedInsights.skillBasedBoosts && transformedInsights.skillBasedBoosts.length > 0) {
                        transformedInsights.skillBasedBoosts = transformedInsights.skillBasedBoosts.map(boost => ({
                            ...boost,
                            salaryIncrease: Math.round(boost.salaryIncrease * adjustmentFactor)
                        }));
                    }
                }
            }

            if (insight) {
                // Update existing insight with transformed data
                Object.assign(insight, transformedInsights, locationData);
                insight.lastUpdated = new Date();
                insight.nextUpdate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                await insight.save();
            } else {
                // Create new insight with transformed data
                insight = await IndustryInsight.create({
                    userId,
                    industry,
                    ...transformedInsights,
                    ...locationData,
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

            // Get user data to check for zipCode
            const user = await User.findById(userId);
            const userZipCode = zipCode || (user ? user.zipCode : null);

            // Prepare location data if zipCode is available
            let locationData = {};
            if (userZipCode) {
                const isIndianZipCode = /^[1-9]\d{5}$/.test(userZipCode);
                locationData = {
                    location: {
                        zipCode: userZipCode,
                        country: isIndianZipCode ? 'India' : 'United States',
                        region: isIndianZipCode ? getIndianRegionFromZipCode(userZipCode) : '',
                        city: ''
                    }
                };

                // Adjust salary amounts for Indian locations but keep currency as USD
                if (isIndianZipCode && fallbackInsights.expectedSalaryRange) {
                    // Using a factor to adjust salaries for Indian market (approximately 1/4 of US salaries)
                    const adjustmentFactor = 0.25;

                    fallbackInsights.expectedSalaryRange.min = Math.round(fallbackInsights.expectedSalaryRange.min * adjustmentFactor);
                    fallbackInsights.expectedSalaryRange.max = Math.round(fallbackInsights.expectedSalaryRange.max * adjustmentFactor);
                    fallbackInsights.expectedSalaryRange.currency = 'USD'; // Always keep as USD

                    // Update salary ranges - adjust amounts but keep currency as USD
                    if (fallbackInsights.salaryRanges && fallbackInsights.salaryRanges.length > 0) {
                        fallbackInsights.salaryRanges = fallbackInsights.salaryRanges.map(range => ({
                            ...range,
                            minSalary: Math.round(range.minSalary * adjustmentFactor),
                            medianSalary: Math.round(range.medianSalary * adjustmentFactor),
                            maxSalary: Math.round(range.maxSalary * adjustmentFactor)
                        }));
                    }

                    // Update skill boosts - adjust amounts but keep currency as USD
                    if (fallbackInsights.skillBasedBoosts && fallbackInsights.skillBasedBoosts.length > 0) {
                        fallbackInsights.skillBasedBoosts = fallbackInsights.skillBasedBoosts.map(boost => ({
                            ...boost,
                            salaryIncrease: Math.round(boost.salaryIncrease * adjustmentFactor)
                        }));
                    }
                }
            }

            // Check if user already has insights
            let insight = await IndustryInsight.findOne({ userId });

            if (insight) {
                // Update existing insight with fallback data
                Object.assign(insight, { industry, ...fallbackInsights, ...locationData });
                insight.lastUpdated = new Date();
                insight.nextUpdate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                await insight.save();
            } else {
                // Create new insight with fallback data
                insight = await IndustryInsight.create({
                    userId,
                    industry,
                    ...fallbackInsights,
                    ...locationData,
                    lastUpdated: new Date(),
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            }

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
            { userId: req.user.id },
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
        await IndustryInsight.findOneAndDelete({ userId: req.user.id });
        res.json({ message: "Industry insight deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to adjust insights based on location
const adjustInsightsForLocation = async (insights, zipCode) => {
    try {
        // Create a deep copy of the insights to avoid modifying the original
        const adjustedInsights = JSON.parse(JSON.stringify(insights));

        // Check if the zipCode is for India (starts with specific prefixes)
        const isIndianZipCode = /^[1-9][0-9]{5}$/.test(zipCode);

        if (isIndianZipCode) {
            // For Indian locations, adjust the salary amounts but keep currency as USD
            // Using a factor to adjust salaries for Indian market (approximately 1/4 of US salaries)
            const adjustmentFactor = 0.25;

            // Update expected salary range - adjust amount but keep currency as USD
            if (adjustedInsights.expectedSalaryRange) {
                adjustedInsights.expectedSalaryRange.min = Math.round(adjustedInsights.expectedSalaryRange.min * adjustmentFactor);
                adjustedInsights.expectedSalaryRange.max = Math.round(adjustedInsights.expectedSalaryRange.max * adjustmentFactor);
                adjustedInsights.expectedSalaryRange.currency = 'USD'; // Always keep as USD
            }

            // Update salary ranges for different roles - adjust amounts but keep currency as USD
            if (adjustedInsights.salaryRanges && adjustedInsights.salaryRanges.length > 0) {
                adjustedInsights.salaryRanges = adjustedInsights.salaryRanges.map(range => ({
                    ...range,
                    minSalary: Math.round(range.minSalary * adjustmentFactor),
                    medianSalary: Math.round(range.medianSalary * adjustmentFactor),
                    maxSalary: Math.round(range.maxSalary * adjustmentFactor)
                }));
            }

            // Update skill-based salary boosts - adjust amounts but keep currency as USD
            if (adjustedInsights.skillBasedBoosts && adjustedInsights.skillBasedBoosts.length > 0) {
                adjustedInsights.skillBasedBoosts = adjustedInsights.skillBasedBoosts.map(boost => ({
                    ...boost,
                    salaryIncrease: Math.round(boost.salaryIncrease * adjustmentFactor)
                }));
            }

            // Update location information
            adjustedInsights.location = {
                zipCode,
                country: 'IN',
                region: getIndianRegionFromZipCode(zipCode),
                city: '' // Would need a more comprehensive database to determine city from zip code
            };
        } else {
            // For US or other locations, keep the original amounts and currency
            adjustedInsights.location = {
                zipCode,
                country: 'US', // Default to US for non-Indian zip codes
                region: '', // Would need a zip code database to determine region
                city: '' // Would need a zip code database to determine city
            };
        }

        return adjustedInsights;
    } catch (error) {
        console.error('Error adjusting insights for location:', error);
        return insights; // Return original insights if there's an error
    }
};

// Helper function to determine Indian region from zip code
const getIndianRegionFromZipCode = (zipCode) => {
    // This is a simplified mapping of Indian postal code prefixes to regions
    // A more comprehensive solution would use a proper database
    const firstDigit = zipCode.charAt(0);

    const regionMap = {
        '1': 'Delhi, Haryana, Punjab',
        '2': 'Uttar Pradesh, Uttarakhand',
        '3': 'Rajasthan, Gujarat',
        '4': 'Maharashtra, Goa',
        '5': 'Andhra Pradesh, Telangana, Karnataka',
        '6': 'Tamil Nadu, Kerala',
        '7': 'West Bengal, Orissa',
        '8': 'North Eastern States',
        '9': 'Bihar, Jharkhand'
    };

    return regionMap[firstDigit] || 'Unknown Region';
};

