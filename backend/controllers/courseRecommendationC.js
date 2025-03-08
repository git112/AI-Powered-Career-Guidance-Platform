import Course from "../models/CourseRecommendation.js";

export const recommendCourses = async (req, res) => {
    try {
        const { interests, skills, careerGoal } = req.body;

        const recommendedCourses = await Course.find({
            $or: [
                { category: { $in: interests } },
                { skillsCovered: { $in: skills } },
                { targetRoles: { $in: [careerGoal] } }
            ]
        });

        res.status(200).json({ success: true, courses: recommendedCourses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recommendations", error });
    }
};

