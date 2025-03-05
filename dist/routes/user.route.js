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
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const db_1 = require("../config/db");
const Department_1 = __importStar(require("../models/Department"));
const AlumniMessage_1 = __importDefault(require("../models/AlumniMessage"));
const Role_1 = __importStar(require("../models/Role"));
const functions_1 = require("../common/functions");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookie_1 = require("cookie");
const auth_1 = require("../middleware/auth");
const UserGroup_1 = __importStar(require("../models/UserGroup"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const AccountDeleteRequest_1 = __importDefault(require("../models/AccountDeleteRequest"));
const Country_1 = __importStar(require("../models/Country"));
const State_1 = __importStar(require("../models/State"));
const UserEducation_1 = __importStar(require("../models/UserEducation"));
const Course_1 = __importStar(require("../models/Course"));
const Event_1 = __importStar(require("../models/Event"));
const EmailTemplate_1 = __importStar(require("../models/EmailTemplate"));
const Institute_1 = __importStar(require("../models/Institute"));
const Group_1 = __importStar(require("../models/Group"));
const sequelize_1 = require("sequelize");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const directory = req.body.type || "";
        const dir = "dist/uploads/" + directory;
        if (fs_1.default.existsSync(dir)) {
            cb(null, dir);
        }
        else {
            fs_1.default.mkdirSync(dir);
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split(".").pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        const file_name = Date.now() +
            "_" +
            file.originalname
                .replace("." + file_ext, "")
                .replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, "_");
        cb(null, file_name + "." + file_ext); //Appending extension
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
});
const userRouter = express_1.default.Router();
userRouter.get("/isalumni=:isalumninew/", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req.query.filter_status", req.query.filter_status);
    const instituteId = req.instituteId;
    Role_1.default.hasMany(User_1.default, { foreignKey: "role_id" });
    User_1.default.belongsTo(Role_1.default, { foreignKey: "role_id", targetKey: "id" });
    User_1.default.hasMany(UserEducation_1.default, { foreignKey: "user_id" });
    UserEducation_1.default.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "id" });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: "course_id" });
    UserEducation_1.default.belongsTo(Course_1.default, {
        foreignKey: "course_id",
        targetKey: "id",
    });
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: "department_id" });
    UserEducation_1.default.belongsTo(Department_1.default, {
        foreignKey: "department_id",
        targetKey: "id",
    });
    let filterwhere = {
        is_alumni: req.params.isalumninew,
        institute_id: instituteId,
    };
    let coursewhere = { is_additional: 0 };
    let pageNumber;
    let pageSize;
    let offset;
    let courseRequired = false;
    let departmentRequired = false;
    if (req.query.hasOwnProperty("filter_status")) {
        filterwhere = {
            ...filterwhere,
            status: req.query.filter_status,
        };
    }
    if (req.query.hasOwnProperty("filter_name")) {
        filterwhere = {
            ...filterwhere,
            [sequelize_1.Op.or]: [
                { first_name: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } }, // Name condition
                { email: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } }, // Email condition
            ],
        };
    }
    if (req.query.hasOwnProperty("filter_course")) {
        const filtercourseid = Number(req.query.filter_course);
        if (filtercourseid > 0) {
            coursewhere = {
                ...coursewhere,
                course_id: filtercourseid,
            };
            courseRequired = true;
        }
    }
    if (req.query.hasOwnProperty("filter_department")) {
        const filterdepartmentid = Number(req.query.filter_department);
        if (filterdepartmentid > 0) {
            coursewhere = {
                ...coursewhere,
                department_id: filterdepartmentid,
            };
            departmentRequired = true;
        }
    }
    if (req.query.hasOwnProperty("filter_endyear")) {
        const filterendyear = Number(req.query.filter_endyear);
        if (filterendyear > 0) {
            coursewhere = {
                ...coursewhere,
                end_year: filterendyear,
            };
            courseRequired = true;
        }
    }
    if (req.query.hasOwnProperty("page_number")) {
        pageNumber = req.query.page_number; // Page number
    }
    else {
        pageNumber = 1;
    }
    if (req.query.hasOwnProperty("page_size")) {
        pageSize = req.query.page_size; // Page size
    }
    else {
        pageSize = 10; // Page size
    }
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const users = await User_1.default.findAll({
        include: [
            {
                model: Role_1.default,
                required: false,
                attributes: ["name"],
            },
            {
                model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                required: courseRequired,
                where: coursewhere,
            },
        ],
        attributes: [
            "id",
            "first_name",
            "last_name",
            "nickname",
            "image",
            "professional_headline",
            "status",
            "gender",
            "email",
            "mobileno",
            "createdAt",
            "middle_name",
            "created_on",
            "batch_start",
            "batch_end",
        ],
        where: filterwhere,
        order: [["id", "DESC"]],
        offset: offset, // Set the offset
        limit: Number(pageSize), // Set the limit to the page size
    });
    console.log("users", users);
    const formattedUsers = await Promise.all(users.map(async (user) => {
        const educations = await UserEducation_1.default.findAll({
            include: [
                {
                    model: Course_1.default,
                    required: false,
                    attributes: ["course_shortcode"],
                },
                {
                    model: Department_1.default, // Join UserEducation (linked by user_id)
                    required: false,
                    attributes: ["department_shortcode"],
                },
            ],
            attributes: ["end_year"],
            where: { user_id: user.id, is_additional: 0 },
            order: [["id", "DESC"]],
        });
        console.log("educations", educations);
        // Define the type for the skill object
        const educationField = await Promise.all(educations.map(async (education) => {
            // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
            let coursename = "";
            if (education.dataValues && education.dataValues.course) {
                coursename =
                    education.dataValues.course.dataValues
                        .course_shortcode;
            }
            let departmentname = "";
            if (education.dataValues &&
                education.dataValues.department) {
                departmentname =
                    "," +
                        education.dataValues.department.dataValues
                            .department_shortcode;
            }
            return (coursename +
                " " +
                education.dataValues.end_year +
                departmentname);
        }));
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.middle_name,
            nickname: user.nickname,
            image: user.image,
            gender: user.gender,
            email: user.email,
            mobileno: user.mobileno,
            createdAt: user.dataValues.createdAt,
            status: user.status,
            batch_start: user.batch_start,
            batch_end: user.batch_end,
            role: user.dataValues.role,
            professional_headline: user.professional_headline,
            educationField: educationField, // Include the skills as an array
        };
    }));
    const totalcount = await User_1.default.count({
        distinct: true, // Ensures distinct job IDs are counted
        col: "id",
        include: [
            {
                model: Role_1.default,
                required: false,
            },
            {
                model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                required: courseRequired,
                where: coursewhere,
            },
        ],
        where: filterwhere,
    });
    res.status(200).json({ total_records: totalcount, data: formattedUsers });
});
userRouter.get("/group_id=:group_id/", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    console.log("req.query.filter_status", req.query.filter_status);
    const instituteId = req.instituteId;
    User_1.default.hasMany(UserGroup_1.default, { foreignKey: "user_id" });
    UserGroup_1.default.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "id" });
    User_1.default.hasMany(UserEducation_1.default, { foreignKey: "user_id" });
    UserEducation_1.default.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "id" });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: "course_id" });
    UserEducation_1.default.belongsTo(Course_1.default, {
        foreignKey: "course_id",
        targetKey: "id",
    });
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: "department_id" });
    UserEducation_1.default.belongsTo(Department_1.default, {
        foreignKey: "department_id",
        targetKey: "id",
    });
    let filterwhere = {
        is_alumni: "1",
        institute_id: instituteId,
        status: "active",
    };
    let coursewhere = { is_additional: 0 };
    let groupwhere = { group_id: Number(req.params.group_id) };
    let pageNumber;
    let pageSize;
    let offset;
    let courseRequired = false;
    let departmentRequired = false;
    if (req.query.hasOwnProperty("filter_status")) {
        filterwhere = {
            ...filterwhere,
            status: req.query.filter_status,
        };
    }
    if (req.query.hasOwnProperty("filter_name")) {
        filterwhere = {
            ...filterwhere,
            [sequelize_1.Op.or]: [
                { first_name: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } }, // Name condition
                { email: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } }, // Email condition
            ],
        };
    }
    if (req.query.hasOwnProperty("page_number")) {
        pageNumber = req.query.page_number; // Page number
    }
    else {
        pageNumber = 1;
    }
    if (req.query.hasOwnProperty("page_size")) {
        pageSize = req.query.page_size; // Page size
    }
    else {
        pageSize = 10; // Page size
    }
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const users = await User_1.default.findAll({
        include: [
            {
                model: UserGroup_1.default,
                required: true,
                where: groupwhere,
            },
            {
                model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                required: courseRequired,
                where: coursewhere,
            },
        ],
        attributes: [
            "id",
            "first_name",
            "last_name",
            "nickname",
            "image",
            "professional_headline",
            "status",
            "gender",
            "email",
            "mobileno",
            "createdAt",
            "middle_name",
            "created_on",
            "batch_start",
            "batch_end",
        ],
        where: filterwhere,
        order: [["id", "DESC"]],
        offset: offset, // Set the offset
        limit: Number(pageSize), // Set the limit to the page size
    });
    console.log("users", users);
    const formattedUsers = await Promise.all(users.map(async (user) => {
        const educations = await UserEducation_1.default.findAll({
            include: [
                {
                    model: Course_1.default,
                    required: false,
                    attributes: ["course_shortcode"],
                },
                {
                    model: Department_1.default, // Join UserEducation (linked by user_id)
                    required: false,
                    attributes: ["department_shortcode"],
                },
            ],
            attributes: ["end_year"],
            where: { user_id: user.id, is_additional: 0 },
            order: [["id", "DESC"]],
        });
        console.log("educations", educations);
        // Define the type for the skill object
        const educationField = await Promise.all(educations.map(async (education) => {
            // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
            let coursename = "";
            if (education.dataValues && education.dataValues.course) {
                coursename =
                    education.dataValues.course.dataValues
                        .course_shortcode;
            }
            let departmentname = "";
            if (education.dataValues &&
                education.dataValues.department) {
                departmentname =
                    "," +
                        education.dataValues.department.dataValues
                            .department_shortcode;
            }
            return (coursename +
                " " +
                education.dataValues.end_year +
                departmentname);
        }));
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.middle_name,
            nickname: user.nickname,
            image: user.image,
            gender: user.gender,
            email: user.email,
            mobileno: user.mobileno,
            createdAt: user.dataValues.createdAt,
            status: user.status,
            batch_start: user.batch_start,
            batch_end: user.batch_end,
            role: user.dataValues.role,
            professional_headline: user.professional_headline,
            educationField: educationField, // Include the skills as an array
        };
    }));
    const totalcount = await User_1.default.count({
        distinct: true, // Ensures distinct job IDs are counted
        col: "id",
        include: [
            {
                model: UserGroup_1.default,
                required: true,
                where: groupwhere,
            },
            {
                model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                required: courseRequired,
                where: coursewhere,
            },
        ],
        where: filterwhere,
    });
    res.status(200).json({ total_records: totalcount, data: formattedUsers });
});
userRouter.get("/event_id=:event_id/", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    console.log("req.query.filter_status", req.query.filter_status);
    const instituteId = req.instituteId;
    const event = await Event_1.default.findOne({
        where: { id: req.params.event_id }
    });
    User_1.default.hasMany(UserEducation_1.default, { foreignKey: "user_id" });
    UserEducation_1.default.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "id" });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: "course_id" });
    UserEducation_1.default.belongsTo(Course_1.default, {
        foreignKey: "course_id",
        targetKey: "id",
    });
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: "department_id" });
    UserEducation_1.default.belongsTo(Department_1.default, {
        foreignKey: "department_id",
        targetKey: "id",
    });
    const goinguserId = event?.join_members;
    const maybeuserId = event?.maybe_members;
    let goinguserIds = [];
    let maybeuserIds = [];
    if (typeof goinguserId === "string") {
        try {
            if (goinguserId != '') {
                goinguserIds = JSON.parse(goinguserId); // Parse if it's a JSON string
            }
        }
        catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
    else if (Array.isArray(goinguserId)) {
        goinguserIds = goinguserId; // Assign directly if it's already an array
    }
    if (typeof maybeuserId === "string") {
        try {
            if (maybeuserId != '') {
                maybeuserIds = JSON.parse(maybeuserId); // Parse if it's a JSON string
            }
        }
        catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
    else if (Array.isArray(maybeuserId)) {
        maybeuserIds = maybeuserId; // Assign directly if it's already an array
    }
    let coursewhere = { is_additional: 0 };
    let pageNumber;
    let pageSize;
    let offset;
    let courseRequired = false;
    let departmentRequired = false;
    let formattedUsers;
    if (goinguserIds.length > 0) {
        const users = await User_1.default.findAll({
            include: [
                {
                    model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                    required: courseRequired,
                    where: coursewhere,
                },
            ],
            attributes: [
                "id",
                "first_name",
                "last_name",
                "nickname",
                "image",
                "professional_headline",
                "status",
                "gender",
                "email",
                "mobileno",
                "createdAt",
                "middle_name",
                "created_on",
                "batch_start",
                "batch_end",
            ],
            where: sequelize_1.Sequelize.literal(`users.id IN (${goinguserIds.join(",")})`),
            order: [["id", "DESC"]],
        });
        console.log("users", users);
        formattedUsers = await Promise.all(users.map(async (user) => {
            const educations = await UserEducation_1.default.findAll({
                include: [
                    {
                        model: Course_1.default,
                        required: false,
                        attributes: ["course_shortcode"],
                    },
                    {
                        model: Department_1.default, // Join UserEducation (linked by user_id)
                        required: false,
                        attributes: ["department_shortcode"],
                    },
                ],
                attributes: ["end_year"],
                where: { user_id: user.id, is_additional: 0 },
                order: [["id", "DESC"]],
            });
            console.log("educations", educations);
            // Define the type for the skill object
            const educationField = await Promise.all(educations.map(async (education) => {
                // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
                let coursename = "";
                if (education.dataValues && education.dataValues.course) {
                    coursename =
                        education.dataValues.course.dataValues
                            .course_shortcode;
                }
                let departmentname = "";
                if (education.dataValues &&
                    education.dataValues.department) {
                    departmentname =
                        "," +
                            education.dataValues.department.dataValues
                                .department_shortcode;
                }
                return (coursename +
                    " " +
                    education.dataValues.end_year +
                    departmentname);
            }));
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                middle_name: user.middle_name,
                nickname: user.nickname,
                image: user.image,
                gender: user.gender,
                email: user.email,
                mobileno: user.mobileno,
                createdAt: user.dataValues.createdAt,
                status: user.status,
                batch_start: user.batch_start,
                batch_end: user.batch_end,
                role: user.dataValues.role,
                professional_headline: user.professional_headline,
                educationField: educationField, // Include the skills as an array
            };
        }));
    }
    else {
        formattedUsers = {};
    }
    let maybeformattedUsers;
    if (maybeuserIds.length > 0) {
        const maybeusers = await User_1.default.findAll({
            include: [
                {
                    model: UserEducation_1.default, // Join UserEducation (linked by user_id)
                    required: courseRequired,
                    where: coursewhere,
                },
            ],
            attributes: [
                "id",
                "first_name",
                "last_name",
                "nickname",
                "image",
                "professional_headline",
                "status",
                "gender",
                "email",
                "mobileno",
                "createdAt",
                "middle_name",
                "created_on",
                "batch_start",
                "batch_end",
            ],
            where: sequelize_1.Sequelize.literal(`users.id IN (${maybeuserIds.join(",")})`),
            order: [["id", "DESC"]],
        });
        maybeformattedUsers = await Promise.all(maybeusers.map(async (user) => {
            const maybeeducations = await UserEducation_1.default.findAll({
                include: [
                    {
                        model: Course_1.default,
                        required: false,
                        attributes: ["course_shortcode"],
                    },
                    {
                        model: Department_1.default, // Join UserEducation (linked by user_id)
                        required: false,
                        attributes: ["department_shortcode"],
                    },
                ],
                attributes: ["end_year"],
                where: { user_id: user.id, is_additional: 0 },
                order: [["id", "DESC"]],
            });
            console.log("educations", maybeeducations);
            // Define the type for the skill object
            const maybeeducationField = await Promise.all(maybeeducations.map(async (education) => {
                // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
                let coursename = "";
                if (education.dataValues && education.dataValues.course) {
                    coursename =
                        education.dataValues.course.dataValues
                            .course_shortcode;
                }
                let departmentname = "";
                if (education.dataValues &&
                    education.dataValues.department) {
                    departmentname =
                        "," +
                            education.dataValues.department.dataValues
                                .department_shortcode;
                }
                return (coursename +
                    " " +
                    education.dataValues.end_year +
                    departmentname);
            }));
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                middle_name: user.middle_name,
                nickname: user.nickname,
                image: user.image,
                gender: user.gender,
                email: user.email,
                mobileno: user.mobileno,
                createdAt: user.dataValues.createdAt,
                status: user.status,
                batch_start: user.batch_start,
                batch_end: user.batch_end,
                role: user.dataValues.role,
                professional_headline: user.professional_headline,
                educationField: maybeeducationField, // Include the skills as an array
            };
        }));
    }
    else {
        maybeformattedUsers = {};
    }
    res.status(200).json({ maybeMembers: maybeformattedUsers, joinMembers: formattedUsers });
});
userRouter.get("/me", auth_1.auth, async (req, res) => {
    console.log("i am in me fucntion", req.body.sessionUser);
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    const instituteId = req.instituteId;
    const user = await User_1.default.findOne({
        where: { id: req.body.sessionUser.id },
    });
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    let userinstitute;
    if (user.is_admin == 2) {
        userinstitute = user;
    }
    else {
        userinstitute = await User_1.default.findOne({
            where: { id: req.body.sessionUser.id, institute_id: instituteId },
        });
    }
    if (!userinstitute) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    console.log("user", userinstitute);
    const userDetails = JSON.parse(JSON.stringify(userinstitute));
    delete userDetails.password;
    res.json(userDetails);
});
userRouter.get("/:id", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    (0, State_1.initializeStateModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    Country_1.default.hasMany(User_1.default, { foreignKey: "country_id" });
    User_1.default.belongsTo(Country_1.default, { foreignKey: "country_id", targetKey: "id" });
    State_1.default.hasMany(User_1.default, { foreignKey: "state_id" });
    User_1.default.belongsTo(State_1.default, { foreignKey: "state_id", targetKey: "id" });
    // Add another association with alias for country2
    if (!User_1.default.associations.Country2) {
        User_1.default.belongsTo(Country_1.default, {
            foreignKey: "country2_id",
            targetKey: "id",
            as: "Country2",
        });
    }
    if (!User_1.default.associations.State2) {
        User_1.default.belongsTo(State_1.default, {
            foreignKey: "state2_id",
            targetKey: "id",
            as: "State2",
        });
    }
    const user = await User_1.default.findOne({
        include: [
            {
                model: Country_1.default,
                required: false,
                attributes: ["country_name"],
            },
            {
                model: State_1.default, // Join UserEducation (linked by user_id)
                required: false,
                attributes: ["state_name"],
            },
            {
                model: Country_1.default,
                as: "Country2", // Alias for second join
                required: false,
                attributes: ["country_name"],
            },
            {
                model: State_1.default,
                as: "State2", // Alias for second join
                required: false,
                attributes: ["state_name"],
            },
        ],
        where: { id: req.params.id, institute_id: instituteId },
    });
    console.log("user", user);
    const userDetails = JSON.parse(JSON.stringify(user));
    delete userDetails.password;
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    const educations = await UserEducation_1.default.findAll({
        include: [
            {
                model: Course_1.default,
                required: false,
                attributes: ["course_shortcode"],
            },
            {
                model: Department_1.default, // Join UserEducation (linked by user_id)
                required: false,
                attributes: ["department_shortcode"],
            },
        ],
        attributes: ["end_year"],
        where: { user_id: user?.id, is_additional: 0 },
        order: [["id", "DESC"]],
    });
    const educationField = await Promise.all(educations.map(async (education) => {
        // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
        let coursename = "";
        if (education.dataValues && education.dataValues.course) {
            coursename =
                education.dataValues.course.dataValues.course_shortcode;
        }
        let departmentname = "";
        if (education.dataValues && education.dataValues.department) {
            departmentname =
                "," +
                    education.dataValues.department.dataValues
                        .department_shortcode;
        }
        return (coursename +
            " " +
            education.dataValues.end_year +
            departmentname);
    }));
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    res.json({
        message: "User Details",
        data: userDetails,
        education: educationField,
    });
});
userRouter.post("/login", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ where: { email: email } });
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid email and password" });
        return;
    }
    let userinstitute;
    if (user) {
        if (user.is_admin == 2) {
            userinstitute = user;
        }
        else {
            const instituteId = req.instituteId;
            userinstitute = await User_1.default.findOne({
                where: { id: user.id, institute_id: instituteId },
            });
            if (!userinstitute) {
                res.status(500).json({ message: "Invalid email and password" });
                return;
            }
            if (userinstitute.status == 'inactive' || userinstitute.status == 'rejected') {
                res.status(500).json({ message: "Account is not activated" });
                return;
            }
        }
    }
    // Decrypt password which send from FE
    /* const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_ENCRYPT_KEY || "");
    const decPassword = bytes.toString(CryptoJS.enc.Utf8);
    const comparision = await bcrypt.compare(decPassword, user.password); */
    console.log("password, user.password", password, userinstitute.password);
    const comparision = await bcrypt_1.default.compare(password, userinstitute.password);
    if (comparision) {
        const userId = { id: userinstitute.id, email: userinstitute.email };
        const token = jsonwebtoken_1.default.sign(userId, process.env.JWT_KEY || "", {
            expiresIn: "24h",
        });
        const serialized = (0, cookie_1.serialize)("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 60 * 60,
            path: "/",
        });
        res.setHeader("Set-Cookie", serialized);
        res.json({ message: "LOGIN SUCCESS", user: userinstitute });
    }
    else {
        // res.send({ success: false, message: "Email and password does not match" })
        return res.status(401).json({
            message: "you_ve_entered_an_incorrect_email_password",
        });
    }
    // res.send('Hello, World!');
});
userRouter.post("/change-password", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const { user_id, current_password, password, confirm_password } = req.body;
    const user = await User_1.default.findOne({ where: { id: user_id } });
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    if (user) {
        if (user.status == 'inactive' || user.status == 'rejected') {
            res.status(500).json({ message: "Account is not activated" });
            return;
        }
    }
    if (!current_password || !password || !confirm_password) {
        res.status(500).json({ message: "All fields are required." });
        return;
    }
    if (password !== confirm_password) {
        return res
            .status(500)
            .json({ message: "New password and confirm password do not match." });
    }
    const passwordMatch = await bcrypt_1.default.compare(current_password, user.password);
    if (!passwordMatch) {
        return res
            .status(500)
            .json({ message: "Current password is incorrect." });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // Step 5: Update password
    const usernew = await user.update({ password: hashedPassword });
    // Decrypt password which send from FE
    /* const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_ENCRYPT_KEY || "");
    const decPassword = bytes.toString(CryptoJS.enc.Utf8);
    const comparision = await bcrypt.compare(decPassword, user.password); */
    if (passwordMatch) {
        const userId = { id: user.id, email: user.email };
        const token = jsonwebtoken_1.default.sign(userId, process.env.JWT_KEY || "", {
            expiresIn: "24h",
        });
        const serialized = (0, cookie_1.serialize)("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });
        res.setHeader("Set-Cookie", serialized);
        res.json({ message: "Password updated successfully.", user: user });
    }
    else {
        // res.send({ success: false, message: "Email and password does not match" })
        return res.status(401).json({
            message: "something_went_wrong",
        });
    }
    // res.send('Hello, World!');
});
userRouter.post("/forgot_password", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, EmailTemplate_1.initializeEmailTemplateModel)((0, db_1.getSequelize)());
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const { email } = req.body;
    const origin = req.get('origin');
    const instituteId = req.instituteId;
    const user = await User_1.default.findOne({ where: { email: email, institute_id: instituteId } });
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    const emailtemplate = await EmailTemplate_1.default.findOne({
        order: [["id", "DESC"]],
        offset: 0, // Set the offset
        limit: 1, // Set the limit to the page size
    });
    const institutedata = await Institute_1.default.findOne({ where: { id: instituteId } });
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1-hour expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();
    const reseturl = origin + "/password_reset/" + token;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const subject = "Password Reset";
    try {
        const dynamicValues = {
            "[User Name]": user.first_name + " " + user.last_name,
            "[Reset Link]": reseturl,
            "[Your Company Name]": institutedata?.institute_name,
            "[Year]": new Date().getFullYear(),
        };
        const emailTemplate = emailtemplate?.alumni_reset_password_mail;
        const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
            .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
            .replace(/\[Reset Link\]/g, dynamicValues["[Reset Link]"])
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
        res.json({ message: "Email Sent Successfully", data: user });
    }
    catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
    }
    // res.send('Hello, World!');
});
userRouter.post("/reset_password/:key", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const key = req.params.key;
    const { password } = req.body;
    const user = await User_1.default.findOne({
        where: {
            resetPasswordToken: key,
            resetPasswordExpires: { [sequelize_1.Op.gt]: new Date() }, // Check expiration
        },
    });
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    if (user) {
        if (user.status == 'inactive' || user.status == 'rejected') {
            res.status(500).json({ message: "Account is not activated" });
            return;
        }
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password has been reset successfully' });
    // res.send('Hello, World!');
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
userRouter.delete("/:id", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const user = await User_1.default.findOne({
        where: { id: req.params.id, institute_id: instituteId },
    });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    try {
        await User_1.default.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            status: "success",
            message: "Delete User Successfully",
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
});
userRouter.post("/status", auth_1.auth, async (req, res) => {
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
        const user = await User_1.default.findOne({ where: { id: id } });
        const institutedata = await Institute_1.default.findOne({ where: { id: instituteId } });
        console.log("institutedata", institutedata);
        if (!user) {
            res.status(500).json({ message: "Invalid User" });
            return;
        }
        const usernew = await User_1.default.update({
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
            subject = "Your account has been activated";
        }
        else if (status == 'rejected') {
            subject = "Your account has been rejected";
        }
        else {
            subject = "Your account has been deactivated";
        }
        if (user) {
            try {
                const dynamicValues = {
                    "[User Name]": user.first_name + " " + user.last_name,
                    "[subject]": subject,
                    "[Your Company Name]": institutedata?.institute_name,
                    "[Year]": new Date().getFullYear(),
                };
                const emailTemplate = emailtemplate?.alumni_confirm_mail;
                const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                    .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
                    .replace(/\[subject\]/g, dynamicValues["[subject]"])
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
        res.json({ message: "Status Updated Successfully", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/profilepic", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, image } = req.body;
        const user = await User_1.default.update({
            image,
        }, {
            where: { id: id },
        });
        res.json({ message: "Profile Picture Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/proheadline", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, professional_headline } = req.body;
        const user = await User_1.default.update({
            professional_headline,
        }, {
            where: { id: id },
        });
        res.json({ message: "Professional Headline Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/socialuser", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url, } = req.body;
        const user = await User_1.default.update({
            linkedin_url,
            facebook_url,
            twitter_url,
            instagram_url,
            youtube_url,
        }, {
            where: { id: id },
        });
        res.json({ message: "Contact Details Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/basicprofileupdate", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, first_name, middle_name, last_name, salutation, nickname, gender, dob, relationship_status, about_me, } = req.body;
        const user = await User_1.default.update({
            first_name,
            middle_name,
            last_name,
            salutation,
            nickname,
            gender,
            dob,
            relationship_status,
            about_me,
        }, {
            where: { id: id },
        });
        res.json({ message: "Basic Profile Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/locationprofileupdate", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, address1, city, state_id, country_id, address2, city2, state2_id, country2_id, country_mobileno_code, mobileno, country_workno_code, work_phone_no, email_alternate, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url, } = req.body;
        const user = await User_1.default.update({
            address1,
            city,
            state_id,
            country_id,
            address2,
            city2,
            state2_id,
            country2_id,
            country_mobileno_code,
            mobileno,
            country_workno_code,
            work_phone_no,
            email_alternate,
            linkedin_url,
            facebook_url,
            twitter_url,
            instagram_url,
            youtube_url,
        }, {
            where: { id: id },
        });
        res.json({ message: "Location Profile Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/alumnisendmessage", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, subject, message_desc, sender_id, receiver_id, status } = req.body;
        const institute_id = req.instituteId;
        const alumnimessage = await AlumniMessage_1.default.create({
            institute_id,
            subject,
            message_desc,
            sender_id,
            receiver_id,
            status,
        });
        res.json({ message: "Message Sent", data: alumnimessage });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/accountdeleterequest", auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, mobile_no, delete_message } = req.body;
        const accountdelete = await AccountDeleteRequest_1.default.create({
            user_id,
            mobile_no,
            delete_message,
        });
        res.json({ message: "Request Sent", data: accountdelete });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/create", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, EmailTemplate_1.initializeEmailTemplateModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Group_1.initializeGroupModel)((0, db_1.getSequelize)());
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    (0, Institute_1.initializeInstitutesModel)((0, db_1.getSequelize)());
    const emailtemplate = await EmailTemplate_1.default.findOne({
        order: [["id", "DESC"]],
        offset: 0, // Set the offset
        limit: 1, // Set the limit to the page size
    });
    try {
        const { id, email, password, first_name, middle_name, last_name, role_id, is_alumni, gender, course_id, department_id, end_year, specialization, address1, city, state_id, country_id, country_mobileno_code, mobileno, image, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url, status, about_me, } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        const institutedata = await Institute_1.default.findOne({ where: { id: institute_id } });
        console.log("institutedata", institutedata);
        const yeargroupname = "Batch of " + end_year;
        let user;
        if (id) {
            user = await User_1.default.findOne({
                where: {
                    email: email,
                    institute_id: institute_id,
                    id: { $not: id },
                },
            });
            console.log("user>>>>>>>>>>>>>>>>", user);
        }
        else {
            user = await User_1.default.findOne({
                where: { email: email, institute_id: institute_id },
            });
        }
        if (user) {
            res.status(500).json({ message: "Email already exist." });
            return;
        }
        if (id) {
            const user = await User_1.default.update({
                email,
                first_name,
                middle_name,
                last_name,
                role_id,
                is_alumni,
                gender,
                address1,
                city,
                state_id,
                country_id,
                country_mobileno_code,
                mobileno,
                image,
                linkedin_url,
                facebook_url,
                twitter_url,
                instagram_url,
                youtube_url,
                status,
                about_me,
            }, {
                where: { id: id },
            });
            res.json({ message: "User Updated", data: user });
        }
        else {
            bcrypt_1.default.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: err,
                    });
                }
                else {
                    // const password = new_item.password;
                    // const saltRounds = 10;
                    // new_item.password = await bcrypt.hash(password, saltRounds)
                    const institute_id = req.instituteId;
                    const user = await User_1.default.create({
                        institute_id,
                        email,
                        password: hash,
                        first_name,
                        middle_name,
                        last_name,
                        role_id,
                        is_alumni,
                        gender,
                        address1,
                        city,
                        state_id,
                        country_id,
                        country_mobileno_code,
                        mobileno,
                        image,
                        linkedin_url,
                        facebook_url,
                        twitter_url,
                        instagram_url,
                        youtube_url,
                        status,
                        about_me,
                    });
                    const university = institutedata?.institute_name;
                    const user_id = user.id;
                    const degree = "";
                    const is_additional = 0;
                    const start_year = 0;
                    const location = "";
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
                    const adminuser = await User_1.default.findOne({ where: { is_admin: 1, status: "active", institute_id: institute_id } });
                    const group = await Group_1.default.findOne({ where: { group_name: yeargroupname, institute_id: institute_id } });
                    const coursename = await Course_1.default.findOne({ where: { id: course_id } });
                    const departname = await Department_1.default.findOne({ where: { id: department_id } });
                    let coursegroupname;
                    let depart_name;
                    if (departname) {
                        coursegroupname = coursename?.course_shortcode + " " + end_year + ", " + departname?.department_shortcode;
                        depart_name = departname.department_name;
                    }
                    else {
                        coursegroupname = coursename?.course_shortcode + " " + end_year;
                        depart_name = '';
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
                    let subjectAdmin;
                    subject = "Welcome to " + institutedata?.institute_name;
                    subjectAdmin = "New Alumni Registered";
                    try {
                        const dynamicValues = {
                            "[User Name]": first_name + " " + last_name,
                            "[Your Company Name]": institutedata?.institute_name,
                            "[Year]": new Date().getFullYear(),
                            "[Email]": email,
                            "[Course Name]": coursename?.course_name,
                            "[Department Name]": depart_name,
                            "[Batch End Year]": end_year,
                        };
                        const emailTemplate = emailtemplate?.alumni_register_mail;
                        const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                            .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
                            .replace(/\[Year\]/g, dynamicValues["[Year]"]);
                        const emailAdminTemplate = emailtemplate?.alumni_register_mail_admin;
                        const finalAdminHtml = emailAdminTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                            .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
                            .replace(/\[Email\]/g, dynamicValues["[Email]"])
                            .replace(/\[Course Name\]/g, dynamicValues["[Course Name]"])
                            .replace(/\[Department Name\]/g, dynamicValues["[Department Name]"])
                            .replace(/\[Batch End Year\]/g, dynamicValues["[Batch End Year]"])
                            .replace(/\[Year\]/g, dynamicValues["[Year]"]);
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: email,
                            subject: subject,
                            html: finalHtml,
                            headers: {
                                'Content-Type': 'text/html; charset=UTF-8',
                            },
                        });
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: adminuser?.email,
                            subject: subjectAdmin,
                            html: finalAdminHtml,
                            headers: {
                                'Content-Type': 'text/html; charset=UTF-8',
                            },
                        });
                    }
                    catch (err) {
                        console.error(`Failed to send email to ${email}:`, err);
                    }
                    res.json({ message: "User Created", data: user });
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post("/logout", async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    const { cookies } = req;
    const jwt = cookies.token;
    if (!jwt) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const tokenSerialized = (0, cookie_1.serialize)("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
    });
    const instituteIdSerialized = (0, cookie_1.serialize)("institute_id", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
    });
    res.setHeader("Set-Cookie", [tokenSerialized, instituteIdSerialized]);
    res.status(200).json({
        status: "success",
        message: "Logged out",
    });
});
userRouter.post("/upload", auth_1.auth, upload.fields([{ name: "file", maxCount: 10 }]), async (req, res) => {
    console.log("req.files", req.files);
    console.log("req.body", req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files = req.files;
    /* if (req.files) {
    req.body.file = req.files.file && req.files.file.length ? req.files.file[0].filename : '';
}
req.body.created_by = req.body.sessionUser.id; */
    /*
    var role = '';
    if (!req.body.from_profile) {
        role = JSON.parse(req.body.role);
        req.body.role = role.filter(item => item.status == 'active').map(item => item.name).toString();
    } */
    res.status(200).json({
        message: "Upload Success",
        files: files?.file,
    });
});
// userRouter.post("/send-email", async (req, res) => {
// 	initializeUserModel(getSequelize());
// 	const { recipients, subject, message } = req.body;
// 	if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
// 		return res.status(400).json({ message: "No recipients provided." });
// 	}
// 	try {
// 		// Configure Nodemailer transporter
// 		const transporter = nodemailer.createTransport({
// 			service: "gmail",
// 			auth: {
// 				user: process.env.EMAIL_USER,
// 				pass: process.env.EMAIL_PASS,
// 			},
// 		});
// 		const sentEmails: string[] = [];
// 		const notFoundEmails: string[] = [];
// 		// Process each recipient
// 		for (const email of recipients) {
// 			const user = await Users.findOne({ where: { email } });
// 			if (user) {
// 				try {
// 					await transporter.sendMail({
// 						from: process.env.EMAIL_USER,
// 						to: email,
// 						subject: subject,
// 						html: `
//               <p>Hello, ${user.first_name || "User"}</p>
//               <p>${message}</p>
//               <p>Thank you,<br>Your App Team</p>
//             `,
// 					});
// 					sentEmails.push(email);
// 				} catch (err) {
// 					console.error(`Failed to send email to ${email}:`, err);
// 				}
// 			} else {
// 				notFoundEmails.push(email);
// 			}
// 		}
// 		// Response summarizing the result
// 		return res.status(200).json({
// 			message: "Emails processed.",
// 			sentEmails,
// 			notFoundEmails,
// 		});
// 	} catch (error) {
// 		console.error("Error in send-email route:", error);
// 		return res.status(500).json({ message: "Internal server error." });
// 	}
// });
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map
