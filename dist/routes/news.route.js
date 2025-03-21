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
const News_1 = __importStar(require("../models/News"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const sequelize_1 = require("sequelize");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const newsRouter = express_1.default.Router();
newsRouter.get('/', async (req, res) => {
    (0, News_1.initializeNewsModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
    /*News.hasMany(Users, {foreignKey: 'id'});
    Users.belongsTo(News, {foreignKey: 'id', targetKey: 'user_id'});
    const role = await News.findOne({
        include: [{
            model: Users,
            required: true,
            attributes: ['first_name'],
            separate: true,
          }
      ],
         });*/
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
            whereCondition.group_id = sequelize_1.Sequelize.literal(`JSON_CONTAINS(group_id, '[${group_id}]')`);
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
    const news = await News_1.default.findAll({
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await News_1.default.count({
        where: whereCondition
    });
    const totalData = await News_1.default.findAll();
    res.status(200).json({ total_records: totalcount, data: news, total_data: totalData });
});
newsRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, News_1.initializeNewsModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const news = await News_1.default.findOne({
        where: { id: req.params.id }
    });
    if (!news) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }
    const newsDetails = JSON.parse(JSON.stringify(news));
    res.json({ message: "News Details", data: newsDetails });
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
newsRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, News_1.initializeNewsModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const news = await News_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!news) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }
    try {
        await News_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete News Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }
});
newsRouter.post('/create', async (req, res) => {
    (0, News_1.initializeNewsModel)((0, db_1.getSequelize)());
    try {
        const { id, title, posted_date, description, news_url, status, user_id, group_id } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let news;
        if (id) {
            const news = await News_1.default.update({
                institute_id,
                title,
                posted_date,
                description,
                news_url,
                status,
                user_id,
                group_id
            }, {
                where: { id: id }
            });
            res.json({ message: "News Updated", data: news });
        }
        else {
            const news = await News_1.default.create({
                institute_id,
                title,
                posted_date,
                description,
                news_url,
                status,
                user_id,
                group_id
            });
            res.json({ message: "News Created", data: news });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = newsRouter;
//# sourceMappingURL=news.route.js.map