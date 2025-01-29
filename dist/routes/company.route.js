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
const Company_1 = __importStar(require("../models/Company"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
const User_1 = __importDefault(require("../models/User"));
const UserIndustry_1 = __importDefault(require("../models/UserIndustry"));
const UserProfessionalskill_1 = __importDefault(require("../models/UserProfessionalskill"));
const UserWorkRole_1 = __importDefault(require("../models/UserWorkRole"));
const Industry_1 = __importDefault(require("../models/Industry"));
const WorkRole_1 = __importDefault(require("../models/WorkRole"));
const Professionalskill_1 = __importDefault(require("../models/Professionalskill"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const companyRouter = express_1.default.Router();
companyRouter.get('/', async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const company = await Company_1.default.findAll();
    res.status(200).json({ total_records: 10, data: company });
});
companyRouter.get('/experience/:id', auth_1.auth, async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    const user = await User_1.default.findOne({ where: { id: req.params.id } });
    const userDetails = JSON.parse(JSON.stringify(user));
    Industry_1.default.hasMany(UserIndustry_1.default, { foreignKey: 'industry_id' });
    UserIndustry_1.default.belongsTo(Industry_1.default, { foreignKey: 'industry_id', targetKey: 'id' });
    WorkRole_1.default.hasMany(UserWorkRole_1.default, { foreignKey: 'workrole_id' });
    UserWorkRole_1.default.belongsTo(WorkRole_1.default, { foreignKey: 'workrole_id', targetKey: 'id' });
    Professionalskill_1.default.hasMany(UserProfessionalskill_1.default, { foreignKey: 'skill_id' });
    UserProfessionalskill_1.default.belongsTo(Professionalskill_1.default, { foreignKey: 'skill_id', targetKey: 'id' });
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    let userexperience = {
        total_experience: userDetails.total_experience,
        skill_id: [],
        skill_name: '',
        industry_id: [],
        industry_name: '',
        workrole_id: [],
        workrole_name: ''
    };
    const userindustryall = await UserIndustry_1.default.findAll({
        include: [{
                model: Industry_1.default,
                required: true,
                attributes: ['industry_name']
            }
        ],
        where: { user_id: req.body.sessionUser.id },
        attributes: ['industry_id']
    });
    if (!userindustryall) {
        userexperience = {
            ...userexperience,
            industry_id: [],
            industry_name: ''
        };
    }
    else {
        const industryval = userindustryall.map(record => record.industry_id);
        const industryNames = userindustryall.map(record => record.dataValues.industry.industry_name).join(', ');
        userexperience = {
            ...userexperience,
            industry_id: industryval,
            industry_name: industryNames
        };
    }
    const userskill = await UserProfessionalskill_1.default.findAll({
        include: [{
                model: Professionalskill_1.default,
                required: true,
                attributes: ['skill_name']
            }
        ],
        where: { user_id: req.params.id },
        attributes: ['skill_id']
    });
    if (!userskill) {
        userexperience = {
            ...userexperience,
            skill_id: [],
            skill_name: ''
        };
    }
    else {
        const skillval = userskill.map(record => record.skill_id);
        const skillvalname = userskill.map(record => record.dataValues.professionalskill.skill_name).join(', ');
        userexperience = {
            ...userexperience,
            skill_id: skillval,
            skill_name: skillvalname
        };
    }
    const userwork = await UserWorkRole_1.default.findAll({
        include: [{
                model: WorkRole_1.default,
                required: true,
                attributes: ['workrole_name']
            }
        ],
        where: { user_id: req.params.id },
        attributes: ['workrole_id']
    });
    if (!userwork) {
        userexperience = {
            ...userexperience,
            workrole_id: [],
            workrole_name: ''
        };
    }
    else {
        const workval = userwork.map(record => record.workrole_id);
        const workvalname = userwork.map(record => record.dataValues.work_role.workrole_name).join(', ');
        userexperience = {
            ...userexperience,
            workrole_id: workval,
            workrole_name: workvalname
        };
    }
    res.json(userexperience);
});
companyRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const company = await Company_1.default.findOne({ where: { id: req.params.id } });
    console.log("company", company);
    const companyDetails = JSON.parse(JSON.stringify(company));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!company) {
        res.status(500).json({ message: "Invalid Company" });
        return;
    }
    res.json({ message: "Company Details", data: companyDetails });
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
companyRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const company = await Company_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!company) {
        res.status(500).json({ message: "Invalid Company" });
        return;
    }
    try {
        await Company_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Company Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Company" });
        return;
    }
});
companyRouter.post('/create', async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, company_name, position, company_start_period, company_end_period, company_location } = req.body;
        console.log("req.body", req.body);
        let company;
        if (id) {
            const company = await Company_1.default.update({
                user_id,
                company_name,
                position,
                company_start_period,
                company_end_period,
                company_location
            }, {
                where: { id: id }
            });
            res.json({ message: "Company Updated", data: company });
        }
        else {
            const company = await Company_1.default.create({
                user_id,
                company_name,
                position,
                company_start_period,
                company_end_period,
                company_location
            });
            res.json({ message: "Company Created", data: company });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
companyRouter.post('/updateexperience', async (req, res) => {
    (0, Company_1.initializeCompanyModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, total_experience, workrole_id, industry_id, skill_id } = req.body;
        console.log("req.body", req.body);
        const user = await User_1.default.update({
            total_experience
        }, {
            where: { id: user_id }
        });
        await UserIndustry_1.default.destroy({
            where: { user_id: user_id }
        });
        const industryNumbers = industry_id.map((mn) => {
            return { user_id: user_id, industry_id: mn };
        });
        const userindustry = await UserIndustry_1.default.bulkCreate(industryNumbers);
        await UserProfessionalskill_1.default.destroy({
            where: { user_id: user_id }
        });
        const skillNumbers = skill_id.map((mn) => {
            return { user_id: user_id, skill_id: mn };
        });
        const userskill = await UserProfessionalskill_1.default.bulkCreate(skillNumbers);
        await UserWorkRole_1.default.destroy({
            where: { user_id: user_id }
        });
        const roleNumbers = workrole_id.map((mn) => {
            return { user_id: user_id, workrole_id: mn };
        });
        const usersworkrole = await UserWorkRole_1.default.bulkCreate(roleNumbers);
        res.json({ message: "Experience Updated Successfully", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = companyRouter;
//# sourceMappingURL=company.route.js.map