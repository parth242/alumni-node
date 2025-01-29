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
const Course_1 = __importStar(require("../models/Course"));
const db_1 = require("../config/db");
const UserCourse_1 = __importDefault(require("../models/UserCourse"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const courseRouter = express_1.default.Router();
courseRouter.get('/', async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const course = await Course_1.default.findAll({ where: { institute_id: instituteId } });
    res.status(200).json({ total_records: 10, data: course });
});
courseRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const course = await Course_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("course", course);
    const courseDetails = JSON.parse(JSON.stringify(course));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
    res.json({ message: "Course Details", data: courseDetails });
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
courseRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    const institute_id = req.instituteId;
    console.log("req.params.id", req.params.id);
    const course = await Course_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
    try {
        await Course_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Course Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
});
courseRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const course = await Course_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
    try {
        if (course.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const coursenew = await Course_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Course Updated", data: coursenew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
});
courseRouter.post('/create', async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    try {
        const { id, course_name, course_shortcode, course_level, status } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let course;
        if (id) {
            course = await Course_1.default.findOne({ where: { course_name: course_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", course);
        }
        else {
            course = await Course_1.default.findOne({ where: { course_name: course_name, institute_id: institute_id } });
        }
        if (course) {
            res.status(500).json({ message: "Course already exist." });
            return;
        }
        if (id) {
            const course = await Course_1.default.update({
                course_name,
                course_shortcode,
                course_level,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Course Updated", data: course });
        }
        else {
            const course = await Course_1.default.create({
                course_name,
                course_shortcode,
                course_level,
                status,
                institute_id
            });
            res.json({ message: "Course Created", data: course });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
courseRouter.post('/createusercourse', async (req, res) => {
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, coursedata } = req.body;
        console.log("req.body", req.body);
        const doubledNumbers = coursedata.map((mn) => {
            return { user_id: user_id, course_id: mn.course_id, end_date: mn.end_date };
        });
        const usercourse = await UserCourse_1.default.bulkCreate(doubledNumbers);
        res.json({ message: "Course Added Successfully", data: usercourse });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = courseRouter;
//# sourceMappingURL=course.route.js.map