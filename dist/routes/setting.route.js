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
const Setting_1 = __importStar(require("../models/Setting"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const settingRouter = express_1.default.Router();
settingRouter.get('/', async (req, res) => {
    (0, Setting_1.initializeSettingModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const setting = await Setting_1.default.findOne({
        where: { institute_id: instituteId },
        order: [['id', 'DESC']],
        offset: 0, // Set the offset
        limit: 1
    });
    res.json({ data: setting });
});
settingRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Setting_1.initializeSettingModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const setting = await Setting_1.default.findOne({ where: { id: req.params.id } });
    console.log("setting", setting);
    const settingDetails = JSON.parse(JSON.stringify(setting));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!setting) {
        res.status(500).json({ message: "Invalid Setting" });
        return;
    }
    res.json({ message: "Setting Details", data: settingDetails });
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
settingRouter.post('/create', async (req, res) => {
    (0, Setting_1.initializeSettingModel)((0, db_1.getSequelize)());
    try {
        const { id, collage_name, collage_logo, contact_name, contact_mobileno } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let settingrecord;
        settingrecord = await Setting_1.default.findOne({
            where: { institute_id: institute_id },
            order: [['id', 'DESC']],
            offset: 0, // Set the offset
            limit: 1
        });
        if (settingrecord) {
            var settingid = settingrecord?.dataValues.id;
            const setting = await Setting_1.default.update({
                collage_name,
                collage_logo,
                contact_name,
                contact_mobileno
            }, {
                where: { id: settingid }
            });
            res.json({ message: "Setting Updated", data: setting });
        }
        else {
            const setting = await Setting_1.default.create({
                institute_id,
                collage_name,
                collage_logo,
                contact_name,
                contact_mobileno
            });
            res.json({ message: "Setting Created", data: setting });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = settingRouter;
//# sourceMappingURL=setting.route.js.map