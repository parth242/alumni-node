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
const Gallery_1 = __importStar(require("../models/Gallery"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const galleryRouter = express_1.default.Router();
galleryRouter.get('/', async (req, res) => {
    (0, Gallery_1.initializeGalleryModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
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
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const gallery = await Gallery_1.default.findAll({
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await Gallery_1.default.count({
        where: whereCondition
    });
    const totalData = await Gallery_1.default.findAll();
    res.status(200).json({ total_records: totalcount, data: gallery, total_data: totalData });
});
galleryRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Gallery_1.initializeGalleryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const gallery = await Gallery_1.default.findOne({
        where: { id: req.params.id }
    });
    if (!gallery) {
        res.status(500).json({ message: "Invalid Gallery" });
        return;
    }
    const galleryDetails = JSON.parse(JSON.stringify(gallery));
    res.json({ message: "Gallery Details", data: galleryDetails });
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
galleryRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Gallery_1.initializeGalleryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const gallery = await Gallery_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!gallery) {
        res.status(500).json({ message: "Invalid Gallery" });
        return;
    }
    try {
        await Gallery_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Gallery Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Gallery" });
        return;
    }
});
galleryRouter.post('/create', async (req, res) => {
    (0, Gallery_1.initializeGalleryModel)((0, db_1.getSequelize)());
    try {
        const { id, gallery_image } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let gallery;
        if (id) {
            const gallery = await Gallery_1.default.update({
                institute_id,
                gallery_image
            }, {
                where: { id: id }
            });
            res.json({ message: "Gallery Updated", data: gallery });
        }
        else {
            const gallery = await Gallery_1.default.create({
                institute_id,
                gallery_image
            });
            res.json({ message: "Gallery Created", data: gallery });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = galleryRouter;
//# sourceMappingURL=gallery.route.js.map