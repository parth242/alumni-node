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
const Feed_1 = __importStar(require("../models/Feed"));
const db_1 = require("../config/db");
const User_1 = __importStar(require("../models/User"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const Category_1 = __importStar(require("../models/Category"));
const FeedComment_1 = __importStar(require("../models/FeedComment"));
const EmailTemplate_1 = __importStar(require("../models/EmailTemplate"));
const Institute_1 = __importStar(require("../models/Institute"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const feedRouter = express_1.default.Router();
feedRouter.get('/feedcomments', auth_1.auth, async (req, res) => {
    (0, FeedComment_1.initializeFeedCommentModel)((0, db_1.getSequelize)());
    User_1.default.hasMany(FeedComment_1.default, { foreignKey: 'user_id' });
    FeedComment_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    const institute_id = req.instituteId;
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (req.query.hasOwnProperty('feed_id')) {
        const feed_id = Number(req.query.feed_id);
        if (feed_id > 0) {
            whereCondition.feed_id = feed_id;
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
    const feedcomment = await FeedComment_1.default.findAll({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name', 'last_name', 'image'] // Fetch the skill_name                
            }
        ],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await FeedComment_1.default.count({
        include: [
            {
                model: User_1.default,
                required: true // Ensures only Jobs with JobSkills are returned                          
            }
        ],
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount, data: feedcomment });
});
feedRouter.get('/', auth_1.auth, async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    (0, FeedComment_1.initializeFeedCommentModel)((0, db_1.getSequelize)());
    FeedComment_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    console.log("req", req.body);
    User_1.default.hasMany(Feed_1.default, { foreignKey: 'user_id' });
    Feed_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    Category_1.default.hasMany(Feed_1.default, { foreignKey: 'category_id' });
    Feed_1.default.belongsTo(Category_1.default, { foreignKey: 'category_id', targetKey: 'id' });
    Feed_1.default.hasMany(FeedComment_1.default, { foreignKey: 'feed_id' });
    FeedComment_1.default.belongsTo(Feed_1.default, { foreignKey: 'feed_id', targetKey: 'id' });
    const institute_id = req.instituteId;
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
    if (req.query.hasOwnProperty('user_id')) {
        const user_id = Number(req.query.user_id);
        if (user_id > 0) {
            whereCondition.user_id = user_id;
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
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name', 'last_name', 'image'] // Fetch the skill_name                
            },
            {
                model: Category_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['category_name'] // Fetch the skill_name                
            },
            {
                model: FeedComment_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['id'] // Fetch the skill_name                
            }
        ],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await Feed_1.default.count({
        distinct: true, // Ensures distinct job IDs are counted
        col: 'id',
        include: [
            {
                model: User_1.default,
                required: true // Ensures only Jobs with JobSkills are returned                          
            },
            {
                model: Category_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned                            
            },
            {
                model: FeedComment_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned                          
            }
        ],
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount, data: feed });
});
feedRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Feed_1.initializeFeedModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Category_1.initializeCategoryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    User_1.default.hasMany(Feed_1.default, { foreignKey: 'user_id' });
    Feed_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    Category_1.default.hasMany(Feed_1.default, { foreignKey: 'category_id' });
    Feed_1.default.belongsTo(Category_1.default, { foreignKey: 'category_id', targetKey: 'id' });
    const feed = await Feed_1.default.findOne({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name', 'last_name', 'image'] // Fetch the skill_name                
            },
            {
                model: Category_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['category_name'] // Fetch the skill_name                
            }
        ],
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
        const { id, description, feed_image, status, user_id, group_id, category_id } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let feed;
        if (id) {
            const feed = await Feed_1.default.update({
                institute_id,
                description,
                feed_image,
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
                feed_image,
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
feedRouter.post('/createcomment', async (req, res) => {
    (0, FeedComment_1.initializeFeedCommentModel)((0, db_1.getSequelize)());
    try {
        const { id, comment_desc, status, user_id, feed_id } = req.body;
        let feedcomment;
        const feed = await FeedComment_1.default.create({
            comment_desc,
            status,
            user_id,
            feed_id
        });
        res.json({ message: "Feed Comment Created", data: feed });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
feedRouter.post("/status", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, EmailTemplate_1.initializeEmailTemplateModel)((0, db_1.getSequelize)());
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const emailtemplate = await EmailTemplate_1.default.findOne({
        order: [["id", "DESC"]],
        offset: 0, // Set the offset
        limit: 1, // Set the limit to the page size
    });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    try {
        const { id, status } = req.body;
        const instituteId = req.instituteId;
        const feed = await Feed_1.default.findOne({ where: { id: id } });
        const institutedata = await Institute_1.default.findOne({ where: { id: instituteId } });
        console.log("institutedata", institutedata);
        if (!feed) {
            res.status(500).json({ message: "Invalid Post" });
            return;
        }
        const usernew = await Feed_1.default.update({
            status,
        }, {
            where: { id: id },
        });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const notFoundEmails = [];
        // Use Promise.all() to send emails in parallel
        let subject;
        if (status == 'active') {
            subject = "Your Post has been activated";
        }
        else if (status == 'rejected') {
            subject = "Your Post has been rejected";
        }
        else {
            subject = "Your Post has been deactivated";
        }
        if (feed) {
            const user = await User_1.default.findOne({ where: { id: feed.user_id } });
            if (user) {
                try {
                    const dynamicValues = {
                        "[User Name]": user.first_name + " " + user.last_name,
                        "[Post Date]": feed.created_on,
                        "[status]": status,
                        "[Your Company Name]": institutedata?.institute_name,
                        "[Year]": new Date().getFullYear(),
                    };
                    const emailTemplate = emailtemplate?.update_post_status;
                    const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                        .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
                        .replace(/\[status\]/g, dynamicValues["[status]"])
                        .replace(/\[Post Date\]/g, dynamicValues["[Post Date]"])
                        .replace(/\[Year\]/g, dynamicValues["[Year]"]);
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: subject,
                        html: finalHtml,
                        headers: {
                            'Content-Type': 'text/html; charset=UTF-8',
                        },
                    });
                }
                catch (err) {
                    console.error(`Failed to send email to ${user.email}:`, err);
                }
            }
        }
        res.json({ message: "Status Updated Successfully", data: feed });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = feedRouter;
//# sourceMappingURL=feed.route.js.map