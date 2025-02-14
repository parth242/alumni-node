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
const UserEducation_1 = __importStar(require("../models/UserEducation"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const Department_1 = __importStar(require("../models/Department"));
const Course_1 = __importStar(require("../models/Course"));
const Group_1 = __importStar(require("../models/Group"));
const UserGroup_1 = __importStar(require("../models/UserGroup"));
const Institute_1 = __importStar(require("../models/Institute"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const educationRouter = express_1.default.Router();
educationRouter.get('/', auth_1.auth, async (req, res) => {
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: 'department_id' });
    UserEducation_1.default.belongsTo(Department_1.default, { foreignKey: 'department_id', targetKey: 'id' });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: 'course_id' });
    UserEducation_1.default.belongsTo(Course_1.default, { foreignKey: 'course_id', targetKey: 'id' });
    let filterwhere;
    if (req.query.hasOwnProperty('filter_user')) {
        filterwhere = {
            user_id: req.query.filter_user
        };
    }
    const usereducation = await UserEducation_1.default.findAll({
        include: [{
                model: Department_1.default,
                required: false
            },
            {
                model: Course_1.default,
                required: false
            }
        ],
        where: filterwhere,
        order: [['id', 'ASC']],
    });
    res.status(200).json({ total_records: 10, data: usereducation });
});
educationRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const education = await UserEducation_1.default.findOne({ where: { id: req.params.id } });
    const educationDetails = JSON.parse(JSON.stringify(education));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!education) {
        res.status(500).json({ message: "Invalid Education" });
        return;
    }
    res.json({ message: "Education Details", data: educationDetails });
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
educationRouter.post('/add', auth_1.auth, async (req, res) => {
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Group_1.initializeGroupModel)((0, db_1.getSequelize)());
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, degree, course_id, department_id, specialization, is_additional, start_year, end_year, location } = req.body;
        let university = req.body.university;
        const institute_id = req.instituteId;
        const yeargroupname = "Batch of " + end_year;
        const institutedata = await Institute_1.default.findOne({ where: { id: institute_id } });
        if (is_additional == 0) {
            university = institutedata?.institute_name;
        }
        if (id) {
            const education = await UserEducation_1.default.update({
                university,
                degree,
                course_id,
                department_id,
                specialization,
                is_additional,
                start_year,
                end_year,
                location
            }, {
                where: { id: id }
            });
            res.json({ message: "Education Updated", data: education });
        }
        else {
            const alumnimessage = await UserEducation_1.default.create({
                user_id,
                university,
                degree,
                course_id,
                department_id,
                specialization,
                is_additional,
                start_year,
                end_year,
                location
            });
            if (is_additional == 0) {
                const group = await Group_1.default.findOne({ where: { group_name: yeargroupname, institute_id: institute_id } });
                const coursename = await Course_1.default.findOne({ where: { id: course_id } });
                const departname = await Department_1.default.findOne({ where: { id: department_id } });
                let coursegroupname;
                if (departname) {
                    coursegroupname = coursename?.course_shortcode + " " + end_year + ", " + departname?.department_shortcode;
                }
                else {
                    coursegroupname = coursename?.course_shortcode + " " + end_year;
                }
                const coursegroup = await Group_1.default.findOne({ where: { group_name: coursegroupname, institute_id: institute_id } });
                if (group) {
                    var group_id = group.id;
                    const usergroupdata = await UserGroup_1.default.findOne({ where: { user_id: user_id, group_id: group_id } });
                    if (!usergroupdata) {
                        const usergroup = await UserGroup_1.default.create({
                            user_id,
                            group_id,
                        });
                    }
                }
                else {
                    const group_name = yeargroupname;
                    const groupdata = await Group_1.default.create({
                        institute_id,
                        group_name
                    });
                    var group_id = groupdata.id;
                    const usergroup = await UserGroup_1.default.create({
                        user_id,
                        group_id,
                    });
                }
                if (coursegroup) {
                    var group_id = coursegroup.id;
                    const usergroupdata = await UserGroup_1.default.findOne({ where: { user_id: user_id, group_id: group_id } });
                    if (!usergroupdata) {
                        const usergroup = await UserGroup_1.default.create({
                            user_id,
                            group_id,
                        });
                    }
                }
                else {
                    const group_name = coursegroupname;
                    const groupdata = await Group_1.default.create({
                        institute_id,
                        group_name
                    });
                    var group_id = groupdata.id;
                    const usergroup = await UserGroup_1.default.create({
                        user_id,
                        group_id,
                    });
                }
            }
            res.json({ message: "Education Added", data: alumnimessage });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
educationRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const education = await UserEducation_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!education) {
        res.status(500).json({ message: "Invalid Education" });
        return;
    }
    try {
        await UserEducation_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Education Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Education" });
        return;
    }
});
exports.default = educationRouter;
//# sourceMappingURL=education.route.js.map