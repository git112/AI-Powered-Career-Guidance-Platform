import express from 'express';
import { recommendCourses } from "../controllers/courseRecommendationC.js"
import { recommendJobs } from "../controllers/jobRecommendationC.js"

const router = express.Router();

router.post("/courses", recommendCourses);
router.post("/jobs", recommendJobs);

export default router;
