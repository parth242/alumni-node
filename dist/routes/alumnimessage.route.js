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
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const User_1 = __importStar(require("../models/User"));
const AlumniMessage_1 = __importStar(require("../models/AlumniMessage"));
const alumnimessageRouter = express_1.default.Router();
alumnimessageRouter.get('/', auth_1.auth, async (req, res) => {
    (0, AlumniMessage_1.initializeMessageModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
    User_1.default.hasMany(AlumniMessage_1.default, { foreignKey: 'sender_id' });
    AlumniMessage_1.default.belongsTo(User_1.default, { foreignKey: 'sender_id', targetKey: 'id' });
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);
        if (filteruserid > 0) {
            const filteruserid = req.query.user_id;
            whereCondition.receiver_id = filteruserid;
        }
    }
    if (req.query.hasOwnProperty('filter_status')) {
        const filterstatus = req.query.filter_status;
        if (filterstatus != "") {
            whereCondition.status = filterstatus;
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
    const alumnimessage = await AlumniMessage_1.default.findAll({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name', 'last_name'] // Fetch the skill_name                
            }
        ],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await AlumniMessage_1.default.count({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned                             
            }
        ],
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount, data: alumnimessage });
});
alumnimessageRouter.get('/unreadcount', auth_1.auth, async (req, res) => {
    (0, AlumniMessage_1.initializeMessageModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
    User_1.default.hasMany(AlumniMessage_1.default, { foreignKey: 'sender_id' });
    AlumniMessage_1.default.belongsTo(User_1.default, { foreignKey: 'sender_id', targetKey: 'id' });
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    whereCondition.status = 'active';
    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);
        if (filteruserid > 0) {
            const filteruserid = req.query.user_id;
            whereCondition.receiver_id = filteruserid;
        }
    }
    const totalcount = await AlumniMessage_1.default.count({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned                             
            }
        ],
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount });
});
alumnimessageRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, AlumniMessage_1.initializeMessageModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    User_1.default.hasMany(AlumniMessage_1.default, { foreignKey: 'sender_id' });
    AlumniMessage_1.default.belongsTo(User_1.default, { foreignKey: 'sender_id', targetKey: 'id' });
    const alumnimessage = await AlumniMessage_1.default.findOne({
        include: [
            {
                model: User_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name', 'last_name'] // Fetch the skill_name                
            }
        ],
        where: { id: req.params.id }
    });
    const alumnimessageDetails = JSON.parse(JSON.stringify(alumnimessage));
    if (!alumnimessage) {
        res.status(500).json({ message: "Invalid Message" });
        return;
    }
    res.json({ message: "Message Details", data: alumnimessageDetails });
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
alumnimessageRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, AlumniMessage_1.initializeMessageModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const alumnimessage = await AlumniMessage_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!alumnimessage) {
        res.status(500).json({ message: "Invalid Message" });
        return;
    }
    try {
        await AlumniMessage_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Message Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Message" });
        return;
    }
});
alumnimessageRouter.post("/updatestatus", auth_1.auth, async (req, res) => {
    (0, AlumniMessage_1.initializeMessageModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    try {
        const { id, status } = req.body;
        const alumnimessage = await AlumniMessage_1.default.findOne({ where: { id: id } });
        if (!alumnimessage) {
            res.status(500).json({ message: "Invalid Message" });
            return;
        }
        const alumnimessagenew = await AlumniMessage_1.default.update({
            status,
        }, {
            where: { id: id },
        });
        res.json({ message: "Status Updated Successfully", data: alumnimessage });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = alumnimessageRouter;
//# sourceMappingURL=alumnimessage.route.js.map