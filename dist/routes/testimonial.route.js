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
const Testimonial_1 = __importStar(require("../models/Testimonial"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const User_1 = __importStar(require("../models/User"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const testimonialRouter = express_1.default.Router();
testimonialRouter.get('/', async (req, res) => {
    (0, Testimonial_1.initializeTestimonialModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
    User_1.default.hasMany(Testimonial_1.default, { foreignKey: "user_id" });
    Testimonial_1.default.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "id" });
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
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
    offset = (Number(pageNumber) - 1) * Number(pageSize);
    const testimonial = await Testimonial_1.default.findAll({
        include: [
            {
                model: User_1.default,
                required: true,
                attributes: ["first_name", "last_name", "professional_headline", "image"],
            },
        ],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize)
    });
    res.status(200).json({ total_records: 10, data: testimonial });
});
testimonialRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Testimonial_1.initializeTestimonialModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const testimonial = await Testimonial_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("testimonial", testimonial);
    const testimonialDetails = JSON.parse(JSON.stringify(testimonial));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
    res.json({ message: "Testimonial Details", data: testimonialDetails });
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
testimonialRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Testimonial_1.initializeTestimonialModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const testimonial = await Testimonial_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
    try {
        await Testimonial_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Testimonial Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
});
testimonialRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Testimonial_1.initializeTestimonialModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const testimonial = await Testimonial_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
    try {
        if (testimonial.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const testimonialnew = await Testimonial_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Testimonial Updated", data: testimonialnew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
});
testimonialRouter.post('/create', async (req, res) => {
    (0, Testimonial_1.initializeTestimonialModel)((0, db_1.getSequelize)());
    try {
        const { id, story_description, user_id, status } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let testimonial;
        if (id) {
            const testimonial = await Testimonial_1.default.update({
                story_description,
                user_id,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Testimonial Updated", data: testimonial });
        }
        else {
            const testimonial = await Testimonial_1.default.create({
                institute_id,
                story_description,
                user_id,
                status
            });
            res.json({ message: "Testimonial Created", data: testimonial });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = testimonialRouter;
//# sourceMappingURL=testimonial.route.js.map