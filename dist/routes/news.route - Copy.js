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
const News_1 = __importDefault(require("../models/News"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const newsRouter = express_1.default.Router();
newsRouter.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req", req.body);
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
    /*interface FilterWhere {
        news_category: string[];
        news_date: string;
    }*/
    let filterwhere;
    let pageNumber;
    let pageSize;
    let offset;
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
    const news = yield News_1.default.findAll({
        where: filterwhere,
        order: [['id', 'DESC']],
        offset: offset,
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = yield News_1.default.count({
        where: filterwhere
    });
    const totalData = yield News_1.default.findAll();
    res.status(200).json({ total_records: totalcount, data: news, total_data: totalData });
}));
newsRouter.get('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.params.id", req.params.id);
    const news = yield News_1.default.findOne({
        where: { id: req.params.id }
    });
    if (!news) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }
    const newsDetails = JSON.parse(JSON.stringify(news));
    res.json({ message: "News Details", data: newsDetails });
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
newsRouter.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.params.id", req.params.id);
    const news = yield News_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!news) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }
    try {
        yield News_1.default.destroy({
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
}));
newsRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, posted_date, description, news_url, status, user_id } = req.body;
        console.log("req.body", req.body);
        let news;
        if (id) {
            const news = yield News_1.default.update({
                title,
                posted_date,
                description,
                news_url,
                status,
                user_id
            }, {
                where: { id: id }
            });
            res.json({ message: "News Updated", data: news });
        }
        else {
            const news = yield News_1.default.create({
                title,
                posted_date,
                description,
                news_url,
                status,
                user_id
            });
            res.json({ message: "News Created", data: news });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
}));
exports.default = newsRouter;
//# sourceMappingURL=news.route%20-%20Copy.js.map