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
const UserGroup_1 = __importStar(require("../models/UserGroup"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const Group_1 = __importStar(require("../models/Group"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const groupRouter = express_1.default.Router();
groupRouter.get('/newsgroup', auth_1.auth, async (req, res) => {
    (0, Group_1.initializeGroupModel)((0, db_1.getSequelize)());
    const institute_id = req.instituteId;
    let whereCondition = {};
    const usergroup = await Group_1.default.findAll({
        where: { institute_id: institute_id },
        order: [['id', 'ASC']],
    });
    res.status(200).json({ total_records: 10, data: usergroup });
});
groupRouter.get('/', auth_1.auth, async (req, res) => {
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    (0, Group_1.initializeGroupModel)((0, db_1.getSequelize)());
    const institute_id = req.instituteId;
    Group_1.default.hasMany(UserGroup_1.default, { foreignKey: 'group_id' });
    UserGroup_1.default.belongsTo(Group_1.default, { foreignKey: 'group_id', targetKey: 'id' });
    let whereCondition = {};
    if (req.query.hasOwnProperty('user_id')) {
        whereCondition.user_id = req.query.user_id;
    }
    const usergroup = await UserGroup_1.default.findAll({
        include: [{
                model: Group_1.default,
                required: true,
                where: { institute_id: institute_id }
            },
        ],
        where: whereCondition,
        order: [['id', 'ASC']],
    });
    res.status(200).json({ total_records: 10, data: usergroup });
});
groupRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Group_1.initializeGroupModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const group = await Group_1.default.findOne({ where: { id: req.params.id } });
    const groupDetails = JSON.parse(JSON.stringify(group));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!group) {
        res.status(500).json({ message: "Invalid Group" });
        return;
    }
    res.json({ message: "Group Details", data: groupDetails });
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
groupRouter.post('/add', auth_1.auth, async (req, res) => {
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    try {
        const { id, user_id, group_id, } = req.body;
        if (id) {
            const group = await UserGroup_1.default.update({
                user_id,
                group_id,
            }, {
                where: { id: id }
            });
            res.json({ message: "Group Updated", data: group });
        }
        else {
            const alumnimessage = await UserGroup_1.default.create({
                user_id,
                group_id,
            });
            res.json({ message: "Group Added", data: alumnimessage });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
groupRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, UserGroup_1.initializeUGroupModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const group = await UserGroup_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!group) {
        res.status(500).json({ message: "Invalid Group" });
        return;
    }
    try {
        await UserGroup_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Group Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Group" });
        return;
    }
});
exports.default = groupRouter;
//# sourceMappingURL=group.route.js.map