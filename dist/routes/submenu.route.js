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
const Submenu_1 = __importStar(require("../models/Submenu"));
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const submenuRouter = express_1.default.Router();
submenuRouter.get('/', auth_1.auth, async (req, res) => {
    (0, Submenu_1.initializeSubmenuModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const submenu = await Submenu_1.default.findAll({ where: { menu: 1, action: "View" }, order: [['ordering', 'ASC']] });
    res.status(200).json({ total_records: 10, data: submenu });
});
submenuRouter.get('/action=:actionpage&module_alias=:modulealias', auth_1.auth, async (req, res) => {
    (0, Submenu_1.initializeSubmenuModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    console.log("req.params.modulealias", req.params.modulealias);
    const submenu = await Submenu_1.default.findOne({ where: { module_alias: req.params.modulealias, action: req.params.actionpage }, attributes: ['id'] });
    console.log('submenudepart', submenu);
    const submenuDetails = JSON.parse(JSON.stringify(submenu));
    res.status(200).json({ data: submenuDetails });
});
submenuRouter.get('/module_alias=:modulealias', auth_1.auth, async (req, res) => {
    (0, Submenu_1.initializeSubmenuModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    console.log("req.params.modulealias", req.params.modulealias);
    const submenu = await Submenu_1.default.findAll({ where: { module_alias: req.params.modulealias } });
    res.status(200).json({ data: submenu });
});
submenuRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Submenu_1.initializeSubmenuModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const submenu = await Submenu_1.default.findOne({ where: { id: req.params.id } });
    console.log("submenu", submenu);
    const submenuDetails = JSON.parse(JSON.stringify(submenu));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!submenu) {
        res.status(500).json({ message: "Invalid Submenu" });
        return;
    }
    res.json({ message: "Submenu Details", data: submenuDetails });
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
exports.default = submenuRouter;
//# sourceMappingURL=submenu.route.js.map