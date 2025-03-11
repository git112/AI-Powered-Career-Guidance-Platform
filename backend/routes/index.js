import express from 'express';
import userRoutes from './userRoutes.js';
import resumeRoutes from './resumeRoutes.js';
// import coverLetterRoutes from './coverLetterRoutes.js';
import industryInsightsRoutes from './industryInsightsRoutes.js';
// const jobRoutes = require("./jobRoutes");
// const courseRoutes = require("./courseRoutes");
import recommendationRoutes from './recommendationRoutes.js';
import authRoutes from './authRoutes.js';
import { googleAuth } from '../controllers/authController.js';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/resumes", resumeRoutes);
router.use("/industry-insights", industryInsightsRoutes);
// router.use("/jobs", jobRoutes);
// router.use("/courses", courseRoutes);

router.use("/recommendations", recommendationRoutes);
router.use('/auth', authRoutes);

// Add a test route
router.get('/test', (req, res) => {
  res.json({ message: 'API routes working' });
});

// Google auth route
router.post('/auth/google', googleAuth);

export default router;

