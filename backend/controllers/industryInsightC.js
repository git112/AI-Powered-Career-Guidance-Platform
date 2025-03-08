import IndustryInsight from "../models/IndustryInsight.js";

export const getIndustryInsight = async (req, res) => {
    try {
        const insight = await IndustryInsight.findOne({ industry: req.params.industry });
        if (!insight) return res.status(404).json({ message: "Industry insight not found" });
        res.json(insight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
        const updatedInsight = await IndustryInsight.findOneAndUpdate({ industry: req.params.industry }, req.body, { new: true });
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

