import express from 'express';
import userRoutes from './userRoutes.js';
import resumeRoutes from './resumeRoutes.js';
// import coverLetterRoutes from './coverLetterRoutes.js';
import industryInsightsRoutes from './industryInsightsRoutes.js';
// const jobRoutes = require("./jobRoutes");
// const courseRoutes = require("./courseRoutes");
import recommendationRoutes from './recommendationRoutes.js';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/resumes", resumeRoutes);
router.use("/industry-insights", industryInsightsRoutes);
// router.use("/jobs", jobRoutes);
// router.use("/courses", courseRoutes);

router.use("/recommendations", recommendationRoutes);

export default router;

