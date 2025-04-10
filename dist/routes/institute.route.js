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
const Institute_1 = __importStar(require("../models/Institute"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const instituteRouter = express_1.default.Router();
instituteRouter.get('/', async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute = await Institute_1.default.findAll();
    res.status(200).json({ total_records: 10, data: institute });
});
instituteRouter.get('/current', async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
    const institute = await Institute_1.default.findOne({ where: { id: institute_id } });
    const instituteDetails = JSON.parse(JSON.stringify(institute));
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    res.json({ message: "Institute Details", data: instituteDetails });
});
instituteRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute = await Institute_1.default.findOne({ where: { id: req.params.id } });
    console.log("institute", institute);
    const instituteDetails = JSON.parse(JSON.stringify(institute));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    res.json({ message: "Institute Details", data: instituteDetails });
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
instituteRouter.post('/create', async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    try {
        const { id, institute_id, institute_name, institute_siteurl, university_id, status } = req.body;
        console.log("req.body", req.body);
        let institute;
        if (id) {
            institute = await Institute_1.default.findOne({ where: { institute_name: institute_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", institute);
        }
        else {
            institute = await Institute_1.default.findOne({ where: { institute_name: institute_name } });
        }
        if (institute) {
            res.status(500).json({ message: "Institute already exist." });
            return;
        }
        if (id) {
            const institute = await Institute_1.default.update({
                institute_name,
                institute_siteurl,
                university_id,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Institute Updated", data: institute });
        }
        else {
            const institute = await Institute_1.default.create({
                institute_id,
                institute_name,
                institute_siteurl,
                university_id,
                status
            });
            res.json({ message: "Institute Created", data: institute });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
instituteRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute = await Institute_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    try {
        await Institute_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Institute Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
});
instituteRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute = await Institute_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    try {
        if (institute.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const institutenew = await Institute_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Institute Updated", data: institutenew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
});
instituteRouter.get('/updateInstituteId/:id', auth_1.auth, async (req, res) => {
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute = await Institute_1.default.findOne({ where: { institute_id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    try {
        res.cookie('institute_id', req.params.id, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent cross-site request forgery (CSRF)
            maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
        });
        res.json({ message: "Institute Updated", data: institute });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
});
exports.default = instituteRouter;
//# sourceMappingURL=institute.route.js.map