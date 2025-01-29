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
const Country_1 = __importDefault(require("../models/Country"));
const State_1 = __importDefault(require("../models/State"));
const UserEducation_1 = __importStar(require("../models/UserEducation"));
const Course_1 = __importStar(require("../models/Course"));
const sequelize_1 = require("sequelize");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const directory = req.body.type || "";
        const dir = 'dist/uploads/' + directory;
        if (fs_1.default.existsSync(dir)) {
            cb(null, dir);
        }
        else {
            fs_1.default.mkdirSync(dir);
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split('.').pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        const file_name = Date.now() + '_' + file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        cb(null, file_name + '.' + file_ext); //Appending extension
    }
});
const upload = (0, multer_1.default)({
    storage: storage
});
const userRouter = express_1.default.Router();
userRouter.get('/isalumni=:isalumninew/', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    console.log('req.query.filter_status', req.query.filter_status);
    const instituteId = req.instituteId;
    Role_1.default.hasMany(User_1.default, { foreignKey: 'role_id' });
    User_1.default.belongsTo(Role_1.default, { foreignKey: 'role_id', targetKey: 'id' });
    User_1.default.hasMany(UserEducation_1.default, { foreignKey: 'user_id' });
    UserEducation_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: 'course_id' });
    UserEducation_1.default.belongsTo(Course_1.default, { foreignKey: 'course_id', targetKey: 'id' });
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: 'department_id' });
    UserEducation_1.default.belongsTo(Department_1.default, { foreignKey: 'department_id', targetKey: 'id' });
    let filterwhere = { is_alumni: req.params.isalumninew, institute_id: instituteId };
    let coursewhere = { is_additional: 0 };
    let pageNumber;
    let pageSize;
    let offset;
    let courseRequired = false;
    let departmentRequired = false;
    if (req.query.hasOwnProperty('filter_status')) {
        filterwhere = {
            ...filterwhere,
            status: req.query.filter_status
        };
    }
    if (req.query.hasOwnProperty('filter_name')) {
        filterwhere = {
            ...filterwhere,
            [sequelize_1.Op.or]: [
                { first_name: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } },
                { email: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } } // Email condition
            ]
        };
    }
    if (req.query.hasOwnProperty('filter_course')) {
        const filtercourseid = Number(req.query.filter_course);
        if (filtercourseid > 0) {
            coursewhere = {
                ...coursewhere,
                course_id: filtercourseid
            };
            courseRequired = true;
        }
    }
    if (req.query.hasOwnProperty('filter_department')) {
        const filterdepartmentid = Number(req.query.filter_department);
        if (filterdepartmentid > 0) {
            coursewhere = {
                ...coursewhere,
                department_id: filterdepartmentid
            };
            departmentRequired = true;
        }
    }
    if (req.query.hasOwnProperty('filter_endyear')) {
        const filterendyear = Number(req.query.filter_endyear);
        if (filterendyear > 0) {
            coursewhere = {
                ...coursewhere,
                end_year: filterendyear
            };
            courseRequired = true;
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
    const users = await User_1.default.findAll({
        include: [
            {
                model: Role_1.default,
                required: false,
                attributes: ['name']
            },
            {
                model: UserEducation_1.default,
                required: courseRequired,
                where: coursewhere
            }
        ],
        attributes: ['id', 'first_name', 'last_name', 'nickname', 'image', 'professional_headline', 'status', 'gender', 'email', 'mobileno', 'createdAt', 'middle_name', 'created_on', 'batch_start', 'batch_end'],
        where: filterwhere,
        order: [['id', 'DESC']],
        offset: offset,
        limit: Number(pageSize) // Set the limit to the page size
    });
    console.log('users', users);
    const formattedUsers = await Promise.all(users.map(async (user) => {
        const educations = await UserEducation_1.default.findAll({
            include: [
                {
                    model: Course_1.default,
                    required: false,
                    attributes: ['course_shortcode']
                },
                {
                    model: Department_1.default,
                    required: false,
                    attributes: ['department_shortcode']
                }
            ],
            attributes: ['end_year'],
            where: { user_id: user.id, is_additional: 0 },
            order: [['id', 'DESC']]
        });
        console.log('educations', educations);
        // Define the type for the skill object
        const educationField = await Promise.all(educations.map(async (education) => {
            // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
            let coursename = '';
            if (education.dataValues && education.dataValues.course) {
                coursename = education.dataValues.course.dataValues.course_shortcode;
            }
            let departmentname = '';
            if (education.dataValues && education.dataValues.department) {
                departmentname = ',' + education.dataValues.department.dataValues.department_shortcode;
            }
            return coursename + ' ' + education.dataValues.end_year + departmentname;
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
            educationField: educationField // Include the skills as an array
        };
    }));
    const totalcount = await User_1.default.count({
        distinct: true,
        col: 'id',
        include: [
            {
                model: Role_1.default,
                required: false
            },
            {
                model: UserEducation_1.default,
                required: courseRequired,
                where: coursewhere
            }
        ],
        where: filterwhere,
    });
    res.status(200).json({ total_records: totalcount, data: formattedUsers });
});
userRouter.get('/group_id=:group_id/', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    (0, UserEducation_1.initializeUEducationModel)((0, db_1.getSequelize)());
    (0, Course_1.initializeCourseModel)((0, db_1.getSequelize)());
    (0, Department_1.initializeDepartmentModel)((0, db_1.getSequelize)());
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    console.log('req.query.filter_status', req.query.filter_status);
    const instituteId = req.instituteId;
    User_1.default.hasMany(UserGroup_1.default, { foreignKey: 'user_id' });
    UserGroup_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    User_1.default.hasMany(UserEducation_1.default, { foreignKey: 'user_id' });
    UserEducation_1.default.belongsTo(User_1.default, { foreignKey: 'user_id', targetKey: 'id' });
    Course_1.default.hasMany(UserEducation_1.default, { foreignKey: 'course_id' });
    UserEducation_1.default.belongsTo(Course_1.default, { foreignKey: 'course_id', targetKey: 'id' });
    Department_1.default.hasMany(UserEducation_1.default, { foreignKey: 'department_id' });
    UserEducation_1.default.belongsTo(Department_1.default, { foreignKey: 'department_id', targetKey: 'id' });
    let filterwhere = { is_alumni: "1", institute_id: instituteId };
    let coursewhere = { is_additional: 0 };
    let groupwhere = { group_id: Number(req.params.group_id) };
    let pageNumber;
    let pageSize;
    let offset;
    let courseRequired = false;
    let departmentRequired = false;
    if (req.query.hasOwnProperty('filter_status')) {
        filterwhere = {
            ...filterwhere,
            status: req.query.filter_status
        };
    }
    if (req.query.hasOwnProperty('filter_name')) {
        filterwhere = {
            ...filterwhere,
            [sequelize_1.Op.or]: [
                { first_name: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } },
                { email: { [sequelize_1.Op.like]: `%${req.query.filter_name}%` } } // Email condition
            ]
        };
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
    const users = await User_1.default.findAll({
        include: [
            {
                model: UserGroup_1.default,
                required: true,
                where: groupwhere
            },
            {
                model: UserEducation_1.default,
                required: courseRequired,
                where: coursewhere
            }
        ],
        attributes: ['id', 'first_name', 'last_name', 'nickname', 'image', 'professional_headline', 'status', 'gender', 'email', 'mobileno', 'createdAt', 'middle_name', 'created_on', 'batch_start', 'batch_end'],
        where: filterwhere,
        order: [['id', 'DESC']],
        offset: offset,
        limit: Number(pageSize) // Set the limit to the page size
    });
    console.log('users', users);
    const formattedUsers = await Promise.all(users.map(async (user) => {
        const educations = await UserEducation_1.default.findAll({
            include: [
                {
                    model: Course_1.default,
                    required: false,
                    attributes: ['course_shortcode']
                },
                {
                    model: Department_1.default,
                    required: false,
                    attributes: ['department_shortcode']
                }
            ],
            attributes: ['end_year'],
            where: { user_id: user.id, is_additional: 0 },
            order: [['id', 'DESC']]
        });
        console.log('educations', educations);
        // Define the type for the skill object
        const educationField = await Promise.all(educations.map(async (education) => {
            // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
            let coursename = '';
            if (education.dataValues && education.dataValues.course) {
                coursename = education.dataValues.course.dataValues.course_shortcode;
            }
            let departmentname = '';
            if (education.dataValues && education.dataValues.department) {
                departmentname = ',' + education.dataValues.department.dataValues.department_shortcode;
            }
            return coursename + ' ' + education.dataValues.end_year + departmentname;
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
            educationField: educationField // Include the skills as an array
        };
    }));
    const totalcount = await User_1.default.count({
        distinct: true,
        col: 'id',
        include: [
            {
                model: UserGroup_1.default,
                required: true,
                where: groupwhere
            },
            {
                model: UserEducation_1.default,
                required: courseRequired,
                where: coursewhere
            }
        ],
        where: filterwhere,
    });
    res.status(200).json({ total_records: totalcount, data: formattedUsers });
});
userRouter.get('/me', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    const instituteId = req.instituteId;
    const user = await User_1.default.findOne({ where: { id: req.body.sessionUser.id, institute_id: instituteId } });
    console.log("user", user);
    const userDetails = JSON.parse(JSON.stringify(user));
    delete userDetails.password;
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    res.json(userDetails);
});
userRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    Country_1.default.hasMany(User_1.default, { foreignKey: 'country_id' });
    User_1.default.belongsTo(Country_1.default, { foreignKey: 'country_id', targetKey: 'id' });
    State_1.default.hasMany(User_1.default, { foreignKey: 'state_id' });
    User_1.default.belongsTo(State_1.default, { foreignKey: 'state_id', targetKey: 'id' });
    // Add another association with alias for country2
    if (!User_1.default.associations.Country2) {
        User_1.default.belongsTo(Country_1.default, { foreignKey: 'country2_id', targetKey: 'id', as: 'Country2' });
    }
    if (!User_1.default.associations.State2) {
        User_1.default.belongsTo(State_1.default, { foreignKey: 'state2_id', targetKey: 'id', as: 'State2' });
    }
    const user = await User_1.default.findOne({
        include: [
            {
                model: Country_1.default,
                required: false,
                attributes: ['country_name']
            },
            {
                model: State_1.default,
                required: false,
                attributes: ['state_name']
            },
            {
                model: Country_1.default,
                as: 'Country2',
                required: false,
                attributes: ['country_name']
            },
            {
                model: State_1.default,
                as: 'State2',
                required: false,
                attributes: ['state_name']
            }
        ],
        where: { id: req.params.id, institute_id: instituteId }
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
                attributes: ['course_shortcode']
            },
            {
                model: Department_1.default,
                required: false,
                attributes: ['department_shortcode']
            }
        ],
        attributes: ['end_year'],
        where: { user_id: user?.id, is_additional: 0 },
        order: [['id', 'DESC']]
    });
    const educationField = await Promise.all(educations.map(async (education) => {
        // const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
        let coursename = '';
        if (education.dataValues && education.dataValues.course) {
            coursename = education.dataValues.course.dataValues.course_shortcode;
        }
        let departmentname = '';
        if (education.dataValues && education.dataValues.department) {
            departmentname = ',' + education.dataValues.department.dataValues.department_shortcode;
        }
        return coursename + ' ' + education.dataValues.end_year + departmentname;
    }));
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    res.json({ message: "User Details", data: userDetails, education: educationField });
});
userRouter.post('/login', async (req, res) => {
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
    // Decrypt password which send from FE
    /* const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_ENCRYPT_KEY || "");
    const decPassword = bytes.toString(CryptoJS.enc.Utf8);
    const comparision = await bcrypt.compare(decPassword, user.password); */
    console.log("password, user.password", password, user.password);
    const comparision = await bcrypt_1.default.compare(password, user.password);
    if (comparision) {
        const userId = { id: user.id, email: user.email };
        const token = jsonwebtoken_1.default.sign(userId, process.env.JWT_KEY || "", { expiresIn: '24h' });
        const serialized = (0, cookie_1.serialize)('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60,
            path: '/',
        });
        res.setHeader('Set-Cookie', serialized);
        res.json({ message: "LOGIN SUCCESS", user: user });
    }
    else {
        // res.send({ success: false, message: "Email and password does not match" })
        return res.status(401).json({
            message: "you_ve_entered_an_incorrect_email_password",
        });
    }
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
userRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const user = await User_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    try {
        await User_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete User Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
});
userRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const user = await User_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    try {
        if (user.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const usernew = await User_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "User Updated", data: usernew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
});
userRouter.post('/profilepic', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, image } = req.body;
        const user = await User_1.default.update({
            image
        }, {
            where: { id: id }
        });
        res.json({ message: "Profile Picture Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/proheadline', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, professional_headline } = req.body;
        const user = await User_1.default.update({
            professional_headline
        }, {
            where: { id: id }
        });
        res.json({ message: "Professional Headline Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/socialuser', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url } = req.body;
        const user = await User_1.default.update({
            linkedin_url,
            facebook_url,
            twitter_url,
            instagram_url,
            youtube_url
        }, {
            where: { id: id }
        });
        res.json({ message: "Contact Details Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/basicprofileupdate', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, first_name, middle_name, last_name, salutation, nickname, gender, dob, relationship_status, about_me } = req.body;
        const user = await User_1.default.update({
            first_name,
            middle_name,
            last_name,
            salutation,
            nickname,
            gender,
            dob,
            relationship_status,
            about_me
        }, {
            where: { id: id }
        });
        res.json({ message: "Basic Profile Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/locationprofileupdate', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, address1, city, state_id, country_id, address2, city2, state2_id, country2_id, country_mobileno_code, mobileno, country_phone_code, work_phone_no, email_alternate, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url } = req.body;
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
            country_phone_code,
            work_phone_no,
            email_alternate,
            linkedin_url,
            facebook_url,
            twitter_url,
            instagram_url,
            youtube_url
        }, {
            where: { id: id }
        });
        res.json({ message: "Location Profile Updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/alumnisendmessage', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, subject, message_desc, sender_id, receiver_id, status } = req.body;
        const instituteId = req.instituteId;
        const alumnimessage = await AlumniMessage_1.default.create({
            instituteId,
            subject,
            message_desc,
            sender_id,
            receiver_id,
            status
        });
        res.json({ message: "Message Sent", data: alumnimessage });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/accountdeleterequest', auth_1.auth, async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, mobile_no, delete_message } = req.body;
        const accountdelete = await AccountDeleteRequest_1.default.create({
            user_id,
            mobile_no,
            delete_message
        });
        res.json({ message: "Request Sent", data: accountdelete });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/create', async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    try {
        const { id, email, password, first_name, middle_name, last_name, role_id, is_alumni, batch_start, batch_end, department_id, course_id, gender, address1, city, state_id, country_id, country_mobileno_code, mobileno, image, linkedin_url, facebook_url, twitter_url, instagram_url, youtube_url, status, about_me } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let user;
        if (id) {
            user = await User_1.default.findOne({ where: { email: email, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", user);
        }
        else {
            user = await User_1.default.findOne({ where: { email: email, institute_id: institute_id } });
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
                batch_start,
                batch_end,
                department_id,
                course_id,
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
                about_me
            }, {
                where: { id: id }
            });
            res.json({ message: "User Updated", data: user });
        }
        else {
            bcrypt_1.default.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: err
                    });
                }
                else {
                    // const password = new_item.password;
                    // const saltRounds = 10;
                    // new_item.password = await bcrypt.hash(password, saltRounds)
                    const user = await User_1.default.create({
                        email, password: hash, first_name,
                        middle_name,
                        last_name,
                        role_id,
                        is_alumni,
                        batch_start,
                        batch_end,
                        department_id,
                        course_id,
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
                        institute_id
                    });
                    res.json({ message: "User Created", data: user });
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
userRouter.post('/logout', async (req, res) => {
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    const { cookies } = req;
    const jwt = cookies.token;
    if (!jwt) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    const serialized = (0, cookie_1.serialize)('token', "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({
        status: 'success',
        message: 'Logged out',
    });
});
userRouter.post('/upload', auth_1.auth, upload.fields([{ name: 'file', maxCount: 10 }]), async (req, res) => {
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
        message: 'Upload Success',
        files: files?.file
    });
});
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map