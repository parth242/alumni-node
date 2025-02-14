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
const Professionalskill_1 = __importStar(require("../models/Professionalskill"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const professionalskillRouter = express_1.default.Router();
professionalskillRouter.get('/', async (req, res) => {
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const professionalskill = await Professionalskill_1.default.findAll();
    res.status(200).json({ total_records: 10, data: professionalskill });
});
professionalskillRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskill_1.default.findOne({ where: { id: req.params.id } });
    console.log("professionalskill", professionalskill);
    const professionalskillDetails = JSON.parse(JSON.stringify(professionalskill));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
    res.json({ message: "Professionalskill Details", data: professionalskillDetails });
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
professionalskillRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskill_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
    try {
        await Professionalskill_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Professionalskill Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
});
professionalskillRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskill_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
    try {
        if (professionalskill.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const professionalskillnew = await Professionalskill_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Professionalskill Updated", data: professionalskillnew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
});
professionalskillRouter.post('/create', async (req, res) => {
    (0, Professionalskill_1.initializeSkillModel)((0, db_1.getSequelize)());
    try {
        const { id, skill_name, status } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        console.log("institute_id", institute_id);
        let professionalskill;
        if (id) {
            professionalskill = await Professionalskill_1.default.findOne({ where: { skill_name: skill_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", professionalskill);
        }
        else {
            professionalskill = await Professionalskill_1.default.findOne({ where: { skill_name: skill_name, institute_id: institute_id } });
        }
        if (professionalskill) {
            res.status(500).json({ message: "Professionalskill already exist." });
            return;
        }
        if (id) {
            const professionalskill = await Professionalskill_1.default.update({
                skill_name,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Professionalskill Updated", data: professionalskill });
        }
        else {
            const professionalskill = await Professionalskill_1.default.create({
                institute_id,
                skill_name,
                status
            });
            res.json({ message: "Professionalskill Created", data: professionalskill });
        }
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = professionalskillRouter;
//# sourceMappingURL=professionalskill.route.js.map