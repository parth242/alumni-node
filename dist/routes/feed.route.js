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
const Feed_1 = __importStar(require("../models/Feed"));
const db_1 = require("../config/db");
const User_1 = __importStar(require("../models/User"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const Category_1 = __importStar(require("../models/Category"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const feedRouter = express_1.default.Router();
feedRouter.get('/', auth_1.auth, async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    User_1.default.hasMany(Feed_1.default, { foreignKey: 'user_id' });
    Feed_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    Category_1.default.hasMany(Feed_1.default, { foreignKey: 'category_id' });
    Feed_1.default.belongsTo(Category_1.default, { foreignKey: 'category_id', targetKey: 'id' });
    const institute_id = req.instituteId;
    /*const role = await Feeds.findOne({
        include: [{
            model: Users,
            required: true,
            attributes: ['first_name'],
            separate: true,
          }
      ],
         });*/
    /*interface FilterWhere {
        feed_category: string[];
        feed_date: string;
    }*/
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    if (req.query.hasOwnProperty('group_id')) {
        const group_id = Number(req.query.group_id);
        if (group_id > 0) {
            whereCondition.group_id = group_id;
        }
    }
    if (req.query.hasOwnProperty('page_number')) {
        pageNumber = req.query.page_number; // Page number
    }
    else {
        pageNumber = 1;
    }
    if (req.query.hasOwnProperty('page_size')) {
        pageSize = req.query.page_size; // Page size
    }
    else {
        pageSize = 10; // Page size
    }
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const feed = await Feed_1.default.findAll({
        include: [
            {
                model: User_1.default,
                required: true,
                attributes: ['first_name', 'last_name', 'image'] // Fetch the skill_name                
            },
            {
                model: Category_1.default,
                required: false,
                attributes: ['category_name'] // Fetch the skill_name                
            }
        ],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset,
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await Feed_1.default.count({
        include: [
            {
                model: User_1.default,
                required: true // Ensures only Jobs with JobSkills are returned                          
            },
            {
                model: Category_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned                            
            }
        ],
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount, data: feed });
});
feedRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const feed = await Feed_1.default.findOne({
        where: { id: req.params.id }
    });
    if (!feed) {
        res.status(500).json({ message: "Invalid Feeds" });
        return;
    }
    const feedDetails = JSON.parse(JSON.stringify(feed));
    res.json({ message: "Feeds Details", data: feedDetails });
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
feedRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const feed = await Feed_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!feed) {
        res.status(500).json({ message: "Invalid Feeds" });
        return;
    }
    try {
        await Feed_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Feeds Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Feeds" });
        return;
    }
});
feedRouter.post('/create', async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    try {
        const { id, description, status, user_id, group_id, category_id } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let feed;
        if (id) {
            const feed = await Feed_1.default.update({
                institute_id,
                description,
                status,
                user_id,
                group_id,
                category_id
            }, {
                where: { id: id }
            });
            res.json({ message: "Feeds Updated", data: feed });
        }
        else {
            const feed = await Feed_1.default.create({
                institute_id,
                description,
                status,
                user_id,
                group_id,
                category_id
            });
            res.json({ message: "Feed Created", data: feed });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = feedRouter;
//# sourceMappingURL=feed.route.js.map