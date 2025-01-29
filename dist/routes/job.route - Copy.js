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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Job_1 = __importStar(require("../models/Job"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const sequelize_1 = require("sequelize");
const JobSkill_1 = __importStar(require("../models/JobSkill"));
const JobArea_1 = __importStar(require("../models/JobArea"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const jobRouter = express_1.default.Router();
jobRouter.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    (0, JobSkill_1.initializeJobSkillModel)((0, db_1.getSequelize)());
    (0, JobArea_1.initializeJobAreaModel)((0, db_1.getSequelize)());
    Job_1.default.hasMany(JobSkill_1.default, { foreignKey: 'job_id' });
    JobSkill_1.default.belongsTo(Job_1.default, { foreignKey: 'job_id', targetKey: 'id' });
    Job_1.default.hasMany(JobArea_1.default, { foreignKey: 'job_id' });
    JobArea_1.default.belongsTo(Job_1.default, { foreignKey: 'job_id', targetKey: 'id' });
    let filterwhere;
    let pageNumber;
    let pageSize;
    let offset;
    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);
        if (filteruserid > 0) {
            const filteruserid = req.query.user_id;
            filterwhere = {
                user_id: {
                    [sequelize_1.Op.eq]: filteruserid, // For Sequelize or similar ORMs
                }
            };
        }
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
    const jobs = yield Job_1.default.findAll({
        include: [
            {
                model: JobSkill_1.default,
                required: true,
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea_1.default,
                required: true,
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        where: filterwhere,
        order: [['id', 'DESC']],
        offset: offset,
        limit: Number(pageSize) // Pagination limit
    });
    // Map through the results to format them as desired
    const formattedJobs = jobs.map(job => {
        // Define the type for the skill object
        const jobSkills = job.dataValues.job_skills.map((skill) => skill.dataValues.skill_name); // Extract skill names
        const jobAreas = job.dataValues.job_areas.map((area) => area.dataValues.area_name); // Extract skill names
        return {
            id: job.id,
            job_title: job.job_title,
            company: job.company,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkills,
            area_name: jobAreas // Include the skills as an array
        };
    });
    const totalcount = yield Job_1.default.count({
        distinct: true,
        col: 'id',
        include: [
            {
                model: JobSkill_1.default,
                required: true,
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea_1.default,
                required: true,
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        where: filterwhere
    });
    const jobsall = yield Job_1.default.findAll({
        include: [
            {
                model: JobSkill_1.default,
                required: true,
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea_1.default,
                required: true,
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        order: [['id', 'DESC']]
    });
    // Map through the results to format them as desired
    const formattedJobsall = jobsall.map(job => {
        // Define the type for the skill object
        const jobSkillsall = job.dataValues.job_skills.map((skill) => skill.dataValues.skill_name); // Extract skill names
        const jobAreasall = job.dataValues.job_areas.map((area) => area.dataValues.area_name); // Extract skill names
        return {
            id: job.id,
            job_title: job.job_title,
            company: job.company,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkillsall,
            area_name: jobAreasall // Include the skills as an array
        };
    });
    res.status(200).json({ total_records: totalcount, data: formattedJobs, total_data: formattedJobsall });
}));
jobRouter.get('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    (0, JobSkill_1.initializeJobSkillModel)((0, db_1.getSequelize)());
    (0, JobArea_1.initializeJobAreaModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    Job_1.default.hasMany(JobSkill_1.default, { foreignKey: 'job_id' });
    JobSkill_1.default.belongsTo(Job_1.default, { foreignKey: 'job_id', targetKey: 'id' });
    Job_1.default.hasMany(JobArea_1.default, { foreignKey: 'job_id' });
    JobArea_1.default.belongsTo(Job_1.default, { foreignKey: 'job_id', targetKey: 'id' });
    const job = yield Job_1.default.findOne({
        include: [
            {
                model: JobSkill_1.default,
                required: true,
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea_1.default,
                required: true,
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        where: { id: req.params.id }
    });
    if (!job) {
        res.status(500).json({ message: "Invalid Job" });
        return;
    }
    else {
        // Define the type for the skill object
        const jobSkillsall = job === null || job === void 0 ? void 0 : job.dataValues.job_skills.map((skill) => skill.dataValues.skill_name); // Extract skill names
        const jobAreasall = job === null || job === void 0 ? void 0 : job.dataValues.job_areas.map((area) => area.dataValues.area_name); // Extract skill names
        const formattedJobDetail = {
            id: job.id,
            job_title: job.job_title,
            company: job.company,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            contact_email: job.contact_email,
            company_website: job.company_website,
            experience_from: job.experience_from,
            experience_to: job.experience_to,
            salary_package: job.salary_package,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkillsall,
            area_name: jobAreasall // Include the skills as an array
        };
        const jobDetails = JSON.parse(JSON.stringify(formattedJobDetail));
        res.json({ message: "Job Details", data: jobDetails });
    }
}));
/**
 *
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
jobRouter.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const event = yield Job_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid Job" });
        return;
    }
    try {
        yield Job_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Job Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Job" });
        return;
    }
}));
jobRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Job_1.initializeJobModel)((0, db_1.getSequelize)());
    (0, JobSkill_1.initializeJobSkillModel)((0, db_1.getSequelize)());
    (0, JobArea_1.initializeJobAreaModel)((0, db_1.getSequelize)());
    try {
        const { id, job_title, company, location, contact_email, job_type, deadline_date, posted_date, company_website, experience_from, experience_to, salary_package, job_description, area_name, skill_name, user_id, status } = req.body;
        console.log("req.body", req.body);
        let job;
        if (id) {
            const job = yield Job_1.default.update({
                job_title,
                company,
                location,
                contact_email,
                job_type,
                deadline_date,
                posted_date,
                company_website,
                experience_from,
                experience_to,
                salary_package,
                job_description,
                user_id,
                status
            }, {
                where: { id: id }
            });
            yield JobArea_1.default.destroy({
                where: {
                    job_id: id
                }
            });
            const areaName = area_name.map((mn) => {
                return { job_id: id, area_name: mn };
            });
            const jobareaname = yield JobArea_1.default.bulkCreate(areaName);
            yield JobSkill_1.default.destroy({
                where: {
                    job_id: id
                }
            });
            const skillNames = skill_name.map((mn) => {
                return { job_id: id, skill_name: mn };
            });
            const jobskillname = yield JobSkill_1.default.bulkCreate(skillNames);
            res.json({ message: "Job Updated", data: job });
        }
        else {
            const job = yield Job_1.default.create({
                job_title,
                company,
                location,
                contact_email,
                job_type,
                deadline_date,
                posted_date,
                company_website,
                experience_from,
                experience_to,
                salary_package,
                job_description,
                user_id,
                status
            });
            const areaName = area_name.map((mn) => {
                return { job_id: job.id, area_name: mn };
            });
            const jobareaname = yield JobArea_1.default.bulkCreate(areaName);
            const skillNames = skill_name.map((mn) => {
                return { job_id: job.id, skill_name: mn };
            });
            const jobskillname = yield JobSkill_1.default.bulkCreate(skillNames);
            res.json({ message: "Job Created", data: job });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
}));
exports.default = jobRouter;
//# sourceMappingURL=job.route%20-%20Copy.js.map