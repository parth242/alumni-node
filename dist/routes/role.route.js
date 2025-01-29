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
const Role_1 = __importStar(require("../models/Role"));
const db_1 = require("../config/db");
const RolePermission_1 = __importStar(require("../models/RolePermission"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const roleRouter = express_1.default.Router();
roleRouter.get('/', auth_1.auth, async (req, res) => {
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const role = await Role_1.default.findAll();
    res.status(200).json({ total_records: 10, data: role });
});
roleRouter.get('/role_id=:roleid', auth_1.auth, async (req, res) => {
    (0, RolePermission_1.initializeRPermissionModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    console.log("reqroleid", req.params.roleid);
    const rolepermission = await RolePermission_1.default.findAll({ where: { role_id: req.params.roleid }, attributes: ['module_id'] });
    const roleWithPermissions = rolepermission.map((permission) => (permission.module_id));
    res.status(200).json({ data: roleWithPermissions });
});
roleRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    Role_1.default.hasMany(RolePermission_1.default, { foreignKey: 'role_id' });
    RolePermission_1.default.belongsTo(Role_1.default, { foreignKey: 'role_id', targetKey: 'id' });
    const role = await Role_1.default.findOne({
        include: [{
                model: RolePermission_1.default,
                required: true,
                attributes: ['module_id'],
                separate: true,
            }
        ],
        where: { id: req.params.id }
    });
    if (role !== null) {
        const roleWithPermissions = role.toJSON();
        console.log('roleWithPermissions', roleWithPermissions.role_permissions);
        if (roleWithPermissions.role_permissions) {
            roleWithPermissions.menu = roleWithPermissions.role_permissions.map((permission) => (String(permission.module_id)));
            console.log(roleWithPermissions);
            const roleDetails = JSON.parse(JSON.stringify(roleWithPermissions));
            if (!role) {
                res.status(500).json({ message: "Invalid Role" });
                return;
            }
            res.json({ message: "Role Details", data: roleDetails });
        }
    }
    else {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
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
roleRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const role = await Role_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!role) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }
    try {
        await Role_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Role Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }
});
roleRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const role = await Role_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!role) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }
    try {
        if (role.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const rolenew = await Role_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Role Updated", data: rolenew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }
});
roleRouter.post('/create', async (req, res) => {
    (0, Role_1.initializeRoleModel)((0, db_1.getSequelize)());
    try {
        const { id, name, status, menu } = req.body;
        console.log("req.body", req.body);
        let role;
        if (id) {
            role = await Role_1.default.findOne({ where: { name: name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", role);
        }
        else {
            role = await Role_1.default.findOne({ where: { name: name } });
        }
        if (role) {
            res.status(500).json({ message: "Role already exist." });
            return;
        }
        if (id) {
            const role = await Role_1.default.update({
                name,
                status
            }, {
                where: { id: id }
            });
            await RolePermission_1.default.destroy({
                where: { role_id: id }
            });
            const doubledNumbers = menu.map((mn) => {
                return { role_id: id, module_id: Number(mn) };
            });
            const rolepermission = await RolePermission_1.default.bulkCreate(doubledNumbers);
            res.json({ message: "Role Updated", data: role });
        }
        else {
            const role = await Role_1.default.create({
                name,
                status
            });
            const lastInsertedId = role.id;
            //console.log("menu",menu);
            const doubledNumbers = menu.map((mn) => {
                return { role_id: lastInsertedId, module_id: Number(mn) };
            });
            console.log("doubledNumbers", doubledNumbers);
            const rolepermission = await RolePermission_1.default.bulkCreate(doubledNumbers);
            console.log(rolepermission);
            res.json({ message: "Role Created", data: role });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = roleRouter;
//# sourceMappingURL=role.route.js.map