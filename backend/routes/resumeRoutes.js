import express from 'express';
import { createResume, getResume, getResumeById, updateResume, deleteResume } from '../controllers/resumeC.js';

const router = express.Router();

router.get("/", getResume);
router.get("/:id", getResumeById);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;
