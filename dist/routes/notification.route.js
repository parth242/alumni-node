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
const Notification_1 = __importStar(require("../models/Notification"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const notificationRouter = express_1.default.Router();
notificationRouter.get('/', async (req, res) => {
    (0, Notification_1.initializeNotificationModel)((0, db_1.getSequelize)());
    console.log("reqnotify", req.body);
    let filterwhere;
    filterwhere = {
        ...filterwhere,
        is_read: 0,
    };
    if (req.query.hasOwnProperty("user_id")) {
        filterwhere = {
            ...filterwhere,
            receiver_id: req.query.user_id,
        };
    }
    const notification = await Notification_1.default.findAll({ where: filterwhere, order: [["id", "DESC"]], });
    res.status(200).json({ total_records: 10, data: notification });
});
notificationRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Notification_1.initializeNotificationModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const notification = await Notification_1.default.findOne({ where: { id: req.params.id } });
    console.log("notification", notification);
    const notificationDetails = JSON.parse(JSON.stringify(notification));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!notification) {
        res.status(500).json({ message: "Invalid Notification" });
        return;
    }
    res.json({ message: "Notification Details", data: notificationDetails });
});
notificationRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Notification_1.initializeNotificationModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const notification = await Notification_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!notification) {
        res.status(500).json({ message: "Invalid Notification" });
        return;
    }
    try {
        await Notification_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Notification Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Notification" });
        return;
    }
});
notificationRouter.post('/updatenotification', async (req, res) => {
    (0, Notification_1.initializeNotificationModel)((0, db_1.getSequelize)());
    try {
        const { id, is_read } = req.body;
        console.log("req.body", req.body);
        const user = await Notification_1.default.update({
            is_read
        }, {
            where: { id: id }
        });
        res.json({ message: "Notification Updated Successfully", data: user });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = notificationRouter;
//# sourceMappingURL=notification.route.js.map