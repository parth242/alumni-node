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
const Department_1 = __importStar(require("../models/Department"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const departmentRouter = express_1.default.Router();
departmentRouter.get('/', async (req, res) => {
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const department = await Department_1.default.findAll({ where: { institute_id: instituteId } });
    res.status(200).json({ total_records: 10, data: department });
});
departmentRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const department = await Department_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("department", department);
    const departmentDetails = JSON.parse(JSON.stringify(department));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
    res.json({ message: "Department Details", data: departmentDetails });
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
departmentRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const department = await Department_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
    try {
        await Department_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Department Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
});
departmentRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const department = await Department_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
    try {
        if (department.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const departmentnew = await Department_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Department Updated", data: departmentnew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
});
departmentRouter.post('/create', async (req, res) => {
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    try {
        const { id, department_name, status } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let department;
        if (id) {
            department = await Department_1.default.findOne({ where: { department_name: department_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", department);
        }
        else {
            department = await Department_1.default.findOne({ where: { department_name: department_name, institute_id: institute_id } });
        }
        if (department) {
            res.status(500).json({ message: "Department already exist." });
            return;
        }
        if (id) {
            const department = await Department_1.default.update({
                department_name,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Department Updated", data: department });
        }
        else {
            const department = await Department_1.default.create({
                department_name,
                status,
                institute_id
            });
            res.json({ message: "Department Created", data: department });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = departmentRouter;
//# sourceMappingURL=department.route.js.map