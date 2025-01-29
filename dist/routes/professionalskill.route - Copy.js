"use strict";
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
const Professionalskill_1 = __importDefault(require("../models/Professionalskill"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const professionalskillRouter = express_1.default.Router();
professionalskillRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req", req.body);
    const professionalskill = yield Professionalskill_1.default.findAll();
    res.status(200).json({ total_records: 10, data: professionalskill });
}));
professionalskillRouter.get('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.params.id", req.params.id);
    const professionalskill = yield Professionalskill_1.default.findOne({ where: { id: req.params.id } });
    console.log("professionalskill", professionalskill);
    const professionalskillDetails = JSON.parse(JSON.stringify(professionalskill));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
    res.json({ message: "Professionalskill Details", data: professionalskillDetails });
}));
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
professionalskillRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, professionalskill_name } = req.body;
        console.log("req.body", req.body);
        let professionalskill;
        if (id) {
            professionalskill = yield Professionalskill_1.default.findOne({ where: { professionalskill_name: professionalskill_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", professionalskill);
        }
        else {
            professionalskill = yield Professionalskill_1.default.findOne({ where: { professionalskill_name: professionalskill_name } });
        }
        if (professionalskill) {
            res.status(500).json({ message: "Professionalskill already exist." });
            return;
        }
        if (id) {
            const professionalskill = yield Professionalskill_1.default.update({
                professionalskill_name
            }, {
                where: { id: id }
            });
            res.json({ message: "Professionalskill Updated", data: professionalskill });
        }
        else {
            const professionalskill = yield Professionalskill_1.default.create({
                professionalskill_name
            });
            res.json({ message: "Professionalskill Created", data: professionalskill });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
}));
exports.default = professionalskillRouter;
//# sourceMappingURL=professionalskill.route%20-%20Copy.js.map