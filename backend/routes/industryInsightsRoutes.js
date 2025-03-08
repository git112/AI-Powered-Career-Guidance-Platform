import express from "express";
import { getIndustryInsight, createIndustryInsight, updateIndustryInsight, deleteIndustryInsight } from "../controllers/industryInsightC.js";

const router = express.Router();

router.get("/", getIndustryInsight);
// router.get("/:id", getIndustryInsightById);
router.post("/", createIndustryInsight);
router.put("/:id", updateIndustryInsight);
router.delete("/:id", deleteIndustryInsight);

export default router;
