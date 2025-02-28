import express from "express";
import { catchError } from "../common/functions";
import { auth } from "../middleware/auth";
import Users from "../models/User";
import ResumeAttachments, {
	initializeResumeModel,
} from "../models/ResumeAttachment";
import { getSequelize } from "../config/db";

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })

const resumeattachmentRouter = express.Router();

resumeattachmentRouter.get("/", async (req, res) => {
	initializeResumeModel(getSequelize());
	console.log("req", req.body);
	let filterwhere;

	if (req.query.hasOwnProperty("filter_user")) {
		const filteruserid = Number(req.query.filter_user);

		if (filteruserid > 0) {
			filterwhere = {
				user_id: filteruserid,
			};
		}
	}
	const resumeattachment = await ResumeAttachments.findAll({
		where: filterwhere,
	});
	res.status(200).json({ total_records: 10, data: resumeattachment });
});

resumeattachmentRouter.get("/:id", auth, async (req, res) => {
	initializeResumeModel(getSequelize());
	console.log("req.params.id", req.params.id);
	const resumeattachment = await ResumeAttachments.findOne({
		where: { id: req.params.id },
	});
	console.log("resumeattachment", resumeattachment);
	const resumeattachmentDetails = JSON.parse(
		JSON.stringify(resumeattachment),
	);
	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!resumeattachment) {
		res.status(500).json({ message: "Invalid Resume" });
		return;
	}
	res.json({ message: "Resume Details", data: resumeattachmentDetails });
});

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: User information
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

resumeattachmentRouter.delete("/:id", auth, async (req, res) => {
	initializeResumeModel(getSequelize());
	console.log("req.params.id", req.params.id);
	const resumeattachment = await ResumeAttachments.findOne({
		where: { id: req.params.id },
	});

	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!resumeattachment) {
		res.status(500).json({ message: "Invalid Resume" });
		return;
	}

	try {
		await ResumeAttachments.destroy({
			where: { id: req.params.id },
		});
		res.status(200).json({
			status: "success",
			message: "Delete Resume Successfully",
		});
	} catch (err) {
		res.status(500).json({ message: "Invalid Resume" });
		return;
	}
});

resumeattachmentRouter.post("/create", async (req, res) => {
	initializeResumeModel(getSequelize());
	try {
		const {
			id,
			user_id,
			resume_title,
			attachment_type,
			attachment_file,
			show_on_profile,
		} = req.body;
		console.log("req.body", req.body);

		let resumeattachment: ResumeAttachments | null;

		if (id) {
			const resumeattachment = await ResumeAttachments.update(
				{
					user_id,
					resume_title,
					show_on_profile,
				},
				{
					where: { id: id },
				},
			);
			res.json({ message: "Resume Updated", data: resumeattachment });
		} else {
			const resumeattachment = await ResumeAttachments.create({
				user_id,
				resume_title,
				attachment_type,
				attachment_file,
				show_on_profile,
			});
			res.json({ message: "Resume Created", data: resumeattachment });
		}
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

export default resumeattachmentRouter;
