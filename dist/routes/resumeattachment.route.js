"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const ResumeAttachment_1 = __importStar(require("../models/ResumeAttachment"));
const db_1 = require("../config/db");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const resumeattachmentRouter = express_1.default.Router();
resumeattachmentRouter.get('/', async (req, res) => {
    (0, ResumeAttachment_1.initializeResumeModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    let filterwhere;
    if (req.query.hasOwnProperty('filter_user')) {
        const filteruserid = Number(req.query.filter_user);
        if (filteruserid > 0) {
            filterwhere = {
                user_id: filteruserid
            };
        }
    }
    const resumeattachment = await ResumeAttachment_1.default.findAll({
        where: filterwhere
    });
    res.status(200).json({ total_records: 10, data: resumeattachment });
});
resumeattachmentRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, ResumeAttachment_1.initializeResumeModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const resumeattachment = await ResumeAttachment_1.default.findOne({ where: { id: req.params.id } });
    console.log("resumeattachment", resumeattachment);
    const resumeattachmentDetails = JSON.parse(JSON.stringify(resumeattachment));
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
resumeattachmentRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, ResumeAttachment_1.initializeResumeModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const resumeattachment = await ResumeAttachment_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!resumeattachment) {
        res.status(500).json({ message: "Invalid Resume" });
        return;
    }
    try {
        await ResumeAttachment_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Resume Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Resume" });
        return;
    }
});
resumeattachmentRouter.post('/create', async (req, res) => {
    (0, ResumeAttachment_1.initializeResumeModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, resume_title, attachment_type, attachment_file, show_on_profile } = req.body;
        console.log("req.body", req.body);
        let resumeattachment;
        if (id) {
            const resumeattachment = await ResumeAttachment_1.default.update({
                user_id,
                resume_title,
                show_on_profile
            }, {
                where: { id: id }
            });
            res.json({ message: "Resume Updated", data: resumeattachment });
        }
        else {
            const resumeattachment = await ResumeAttachment_1.default.create({
                user_id,
                resume_title,
                attachment_type,
                attachment_file,
                show_on_profile
            });
            res.json({ message: "Resume Created", data: resumeattachment });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = resumeattachmentRouter;
//# sourceMappingURL=resumeattachment.route.js.map