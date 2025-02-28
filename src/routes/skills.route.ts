import express from "express";
import JobSkill, { initializeJobSkillModel } from "../models/JobSkill"; // Adjust the path as necessary
import { getSequelize } from "../config/db";

const jobSkillsRouter = express.Router();
// Endpoint to get all jobSkills
jobSkillsRouter.get("/", async (req, res) => {
	initializeJobSkillModel(getSequelize());
	console.log("req", req.body);
	try {
		const jobSkill = await JobSkill.findAll();
		console.log("jobSkill", jobSkill);
		res.status(200).json({
			total_records: jobSkill.length,
			data: jobSkill,
		});
	} catch (error) {
		res.status(500).json({ error: "Error retrieving services" });
	}
});

export default jobSkillsRouter;
