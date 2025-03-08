import Job from "../models/JobRecommendation.js";

export const recommendJobs = async (req, res) => {
    try {
        const { skills, experienceLevel, preferredLocation } = req.body;

        const recommendedJobs = await Job.find({
            $or: [
                { requiredSkills: { $in: skills } },
                { experienceLevel: experienceLevel },
                { location: preferredLocation }
            ]
        });

        res.status(200).json({ success: true, jobs: recommendedJobs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching job recommendations", error });
    }
};
