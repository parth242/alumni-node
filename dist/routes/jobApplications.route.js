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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../config/db");
const JobApplication_1 = __importStar(require("../models/JobApplication"));
const Professionalskill_1 = __importStar(require("../models/Professionalskill"));
const Job_1 = __importStar(require("../models/Job"));
const EmailTemplate_1 = __importStar(require("../models/EmailTemplate"));
const Institute_1 = __importStar(require("../models/Institute"));
const User_1 = __importStar(require("../models/User"));
const auth_1 = require("../middleware/auth");
const functions_1 = require("../common/functions");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const jobApplicationsRouter = express_1.default.Router();
jobApplicationsRouter.get('/', auth_1.auth, async (req, res) => {
    (0, JobApplication_1.initializeJobApplicationModel)((0, db_1.getSequelize)());
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    Job_1.default.hasMany(JobApplication_1.default, { foreignKey: 'job_id' });
    JobApplication_1.default.belongsTo(Job_1.default, { foreignKey: 'job_id', targetKey: 'id' });
    const institute_id = req.instituteId;
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);
        if (filteruserid > 0) {
            const filteruserid = req.query.user_id;
            whereCondition.user_id = filteruserid;
        }
    }
    if (req.query.hasOwnProperty('job_id')) {
        whereCondition.job_id = req.query.job_id;
    }
    if (req.query.hasOwnProperty('page_number')) {
        pageNumber = req.query.page_number; // Page number
    }
    else {
        pageNumber = 1;
    }
    if (req.query.hasOwnProperty('page_size')) {
        pageSize = req.query.page_size; // Page size
    }
    else {
        pageSize = 10; // Page size
    }
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const jobapplications = await JobApplication_1.default.findAll({
        include: [
            {
                model: Job_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'], // Fetch the job_title     
                where: { user_id: req.body.sessionUser.id }
            }
        ],
        where: whereCondition, // Your conditions for filtering Jobs
        order: [['id', 'DESC']],
        offset: offset, // Pagination offset
        limit: Number(pageSize) // Pagination limit
    });
    const totalcount = await JobApplication_1.default.count({
        distinct: true, // Ensures distinct job IDs are counted
        col: 'id',
        include: [
            {
                model: Job_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'] // Fetch the job_title                
            }
        ],
        where: whereCondition, // Your conditions for filtering Jobs
    });
    const jobapplicationall = await JobApplication_1.default.findAll({
        include: [
            {
                model: Job_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'] // Fetch the job_title                
            }
        ],
        order: [['id', 'DESC']]
    });
    res.status(200).json({ total_records: totalcount, data: jobapplications, total_data: jobapplicationall });
});
// POST route for creating a new job application
jobApplicationsRouter.post("/create", async (req, res) => {
    (0, JobApplication_1.initializeJobApplicationModel)((0, db_1.getSequelize)()); // Initialize the model with the Sequelize instance
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    try {
        // Destructure fields from the request body
        const { full_name, email_address, mobile_number, current_company, designation, total_years_of_experience, relevant_skills, resume, note, apply_type, job_id, user_id, } = req.body;
        const institute_id = req.instituteId;
        // Validate the necessary fields are provided
        if (!full_name ||
            !email_address ||
            !mobile_number ||
            !current_company ||
            !designation ||
            !total_years_of_experience ||
            !relevant_skills ||
            !resume ||
            !job_id ||
            !user_id) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const skillNames = [];
        for (const skill of relevant_skills) {
            let skillRecord = await Professionalskill_1.default.findOne({
                where: { skill_name: skill },
            });
            if (!skillRecord) {
                // If the skill is custom, create a new skill entry
                skillRecord = await Professionalskill_1.default.create({
                    skill_name: skill,
                    institute_id: institute_id,
                    status: 'active',
                });
            }
            // Add the skill name to the list of relevant skills
            skillNames.push(skillRecord.skill_name); // Save the skill name
        }
        console.log('skillNames', skillNames);
        // Create the job application in the database
        const jobApplication = await JobApplication_1.default.create({
            institute_id,
            full_name,
            email_address,
            mobile_number,
            current_company,
            designation,
            total_years_of_experience,
            relevant_skills: skillNames.join(","),
            resume,
            job_id,
            user_id,
            note,
            apply_type,
        });
        // Return success message with the created data
        res.json({
            message: "Job Application Created",
            data: jobApplication,
        });
    }
    catch (error) {
        // Handle errors and send a response with the error message
        console.error("Error creating job application:", error);
        res.status(500).json({
            message: "Failed to create job application",
            error: error,
        });
    }
});
jobApplicationsRouter.post("/updatestatus", auth_1.auth, async (req, res) => {
    (0, JobApplication_1.initializeJobApplicationModel)((0, db_1.getSequelize)());
    (0, EmailTemplate_1.initializeEmailTemplateModel)((0, db_1.getSequelize)());
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    try {
        const emailtemplate = await EmailTemplate_1.default.findOne({
            order: [["id", "DESC"]],
            offset: 0, // Set the offset
            limit: 1, // Set the limit to the page size
        });
        const { id, recruiter_name, recruiter_comment, status } = req.body;
        const instituteId = req.instituteId;
        const jobapplication = await JobApplication_1.default.findOne({ where: { id: id } });
        const institutedata = await Institute_1.default.findOne({ where: { id: instituteId } });
        const jobapplicationupdate = await JobApplication_1.default.update({
            recruiter_name, recruiter_comment, status
        }, {
            where: { id: id },
        });
        const job = await Job_1.default.findOne({ where: { id: jobapplication?.job_id } });
        const user = await User_1.default.findOne({ where: { id: jobapplication?.user_id } });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const notFoundEmails = [];
        // Use Promise.all() to send emails in parallel
        let subject;
        subject = job?.job_title + " from " + institutedata?.institute_name;
        try {
            const dynamicValues = {
                "[User Name]": user?.first_name + " " + user?.last_name,
                "[Recruiter Name]": recruiter_name,
                "[Status]": status,
                "[Comment]": recruiter_comment,
                "[Job Title]": job?.job_title,
                "[Your Company Name]": institutedata?.institute_name,
                "[Year]": new Date().getFullYear(),
            };
            const emailTemplate = emailtemplate?.update_job_status;
            const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
                .replace(/\[Recruiter Name\]/g, dynamicValues["[Recruiter Name]"])
                .replace(/\[Status\]/g, dynamicValues["[Status]"])
                .replace(/\[Comment\]/g, dynamicValues["[Comment]"])
                .replace(/\[Job Title\]/g, dynamicValues["[Job Title]"])
                .replace(/\[Year\]/g, dynamicValues["[Year]"]);
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user?.email,
                subject: subject,
                html: finalHtml,
                headers: {
                    'Content-Type': 'text/html; charset=UTF-8',
                },
            });
        }
        catch (err) {
            console.error(`Failed to send email to ${user?.email}:`, err);
        }
        res.json({ message: "Status Updated Successfully", data: jobapplication });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = jobApplicationsRouter;
//# sourceMappingURL=jobApplications.route.js.map