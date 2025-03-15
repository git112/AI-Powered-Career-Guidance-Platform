import express from "express";
import { generateInsights, getInsights } from "../controllers/industryInsightC.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.put('/api/users/profile', authMiddleware, updateProfile);
router.post('/generate', authMiddleware, generateInsights);

// Get user's insights
router.get('/user', authMiddleware, getInsights);

export default router;
