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
const Category_1 = __importStar(require("../models/Category"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const categoryRouter = express_1.default.Router();
categoryRouter.get('/', async (req, res) => {
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const category = await Category_1.default.findAll({ where: { institute_id: instituteId } });
    res.status(200).json({ total_records: 10, data: category });
});
categoryRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const category = await Category_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("category", category);
    const categoryDetails = JSON.parse(JSON.stringify(category));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
    res.json({ message: "Category Details", data: categoryDetails });
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
categoryRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const category = await Category_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
    try {
        await Category_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Category Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
});
categoryRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const category = await Category_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
    try {
        if (category.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const categorynew = await Category_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Category Updated", data: categorynew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
});
categoryRouter.post('/create', async (req, res) => {
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    try {
        const { id, category_name, status } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let category;
        if (id) {
            category = await Category_1.default.findOne({ where: { category_name: category_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", category);
        }
        else {
            category = await Category_1.default.findOne({ where: { category_name: category_name, institute_id: institute_id } });
        }
        if (category) {
            res.status(500).json({ message: "Category already exist." });
            return;
        }
        if (id) {
            const category = await Category_1.default.update({
                category_name,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Category Updated", data: category });
        }
        else {
            const category = await Category_1.default.create({
                category_name,
                status,
                institute_id
            });
            res.json({ message: "Category Created", data: category });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = categoryRouter;
//# sourceMappingURL=category.route.js.map