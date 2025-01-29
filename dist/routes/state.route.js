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
const State_1 = __importStar(require("../models/State"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const stateRouter = express_1.default.Router();
stateRouter.get('/', async (req, res) => {
    (0, State_1.initializeStateModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const state = await State_1.default.findAll();
    res.status(200).json({ total_records: 10, data: state });
});
stateRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, State_1.initializeStateModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const state = await State_1.default.findOne({ where: { id: req.params.id } });
    console.log("state", state);
    const stateDetails = JSON.parse(JSON.stringify(state));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!state) {
        res.status(500).json({ message: "Invalid State" });
        return;
    }
    res.json({ message: "State Details", data: stateDetails });
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
stateRouter.post('/create', async (req, res) => {
    (0, State_1.initializeStateModel)((0, db_1.getSequelize)());
    try {
        const { id, state_name } = req.body;
        console.log("req.body", req.body);
        let state;
        if (id) {
            state = await State_1.default.findOne({ where: { state_name: state_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", state);
        }
        else {
            state = await State_1.default.findOne({ where: { state_name: state_name } });
        }
        if (state) {
            res.status(500).json({ message: "State already exist." });
            return;
        }
        if (id) {
            const state = await State_1.default.update({
                state_name
            }, {
                where: { id: id }
            });
            res.json({ message: "State Updated", data: state });
        }
        else {
            const state = await State_1.default.create({
                state_name
            });
            res.json({ message: "State Created", data: state });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = stateRouter;
//# sourceMappingURL=state.route.js.map