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
const User_1 = __importDefault(require("../models/User"));
const Industry_1 = __importStar(require("../models/Industry"));
const db_1 = require("../config/db");
const UserIndustry_1 = __importDefault(require("../models/UserIndustry"));
const UserProfessionalskill_1 = __importDefault(require("../models/UserProfessionalskill"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const industryRouter = express_1.default.Router();
industryRouter.get('/', async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const industry = await Industry_1.default.findAll({
        where: { institute_id: instituteId }
    });
    res.status(200).json({ total_records: 10, data: industry });
});
industryRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const industry = await Industry_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("industry", industry);
    const industryDetails = JSON.parse(JSON.stringify(industry));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
    res.json({ message: "Industry Details", data: industryDetails });
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
industryRouter.post('/create', async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    try {
        const { id, industry_name, status } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let industry;
        if (id) {
            industry = await Industry_1.default.findOne({ where: { industry_name: industry_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", industry);
        }
        else {
            industry = await Industry_1.default.findOne({ where: { industry_name: industry_name, institute_id: institute_id } });
        }
        if (industry) {
            res.status(500).json({ message: "Industry already exist." });
            return;
        }
        if (id) {
            const industry = await Industry_1.default.update({
                industry_name,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Industry Updated", data: industry });
        }
        else {
            const industry = await Industry_1.default.create({
                institute_id,
                industry_name,
                status
            });
            res.json({ message: "Industry Created", data: industry });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
industryRouter.post('/createusercompany', async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, company_name, position, company_start_period, company_end_period, total_experience, industry_id, skill_id } = req.body;
        console.log("req.body", req.body);
        const user = await User_1.default.update({
            company_name,
            position,
            company_start_period,
            company_end_period,
            total_experience
        }, {
            where: { id: user_id }
        });
        const industryNumbers = industry_id.map((mn) => {
            return { user_id: user_id, industry_id: mn };
        });
        const userindustry = await UserIndustry_1.default.bulkCreate(industryNumbers);
        const skillNumbers = skill_id.map((mn) => {
            return { user_id: user_id, skill_id: mn };
        });
        const userskill = await UserProfessionalskill_1.default.bulkCreate(skillNumbers);
        res.json({ message: "Company Added Successfully", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
industryRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const industry = await Industry_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
    try {
        await Industry_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Industry Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
});
industryRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const industry = await Industry_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
    try {
        if (industry.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const industrynew = await Industry_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Industry Updated", data: industrynew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
});
exports.default = industryRouter;
//# sourceMappingURL=industry.route.js.map