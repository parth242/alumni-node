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
const Slideshow_1 = __importStar(require("../models/Slideshow"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const directory = 'slideshow';
        const dir = 'dist/uploads/' + directory;
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
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const slideshowRouter = express_1.default.Router();
slideshowRouter.get('/', async (req, res) => {
    (0, Slideshow_1.initializeSlideshowModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const instituteId = req.instituteId;
    const slideshow = await Slideshow_1.default.findAll({
        where: { institute_id: instituteId }
    });
    res.status(200).json({ total_records: 10, data: slideshow });
});
slideshowRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Slideshow_1.initializeSlideshowModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const instituteId = req.instituteId;
    const slideshow = await Slideshow_1.default.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("slideshow", slideshow);
    const slideshowDetails = JSON.parse(JSON.stringify(slideshow));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
    res.json({ message: "Slideshow Details", data: slideshowDetails });
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
slideshowRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Slideshow_1.initializeSlideshowModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const institute_id = req.instituteId;
    const slideshow = await Slideshow_1.default.findOne({ where: { id: req.params.id, institute_id: institute_id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
    try {
        await Slideshow_1.default.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Slideshow Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
});
slideshowRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Slideshow_1.initializeSlideshowModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const slideshow = await Slideshow_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
    try {
        if (slideshow.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const slideshownew = await Slideshow_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Slideshow Updated", data: slideshownew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
});
slideshowRouter.post('/create', async (req, res) => {
    (0, Slideshow_1.initializeSlideshowModel)((0, db_1.getSequelize)());
    try {
        const { id, slide_title, slide_image, status } = req.body;
        console.log("req.body", req.body);
        const institute_id = req.instituteId;
        let slideshow;
        if (id) {
            slideshow = await Slideshow_1.default.findOne({ where: { slide_title: slide_title, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", slideshow);
        }
        else {
            slideshow = await Slideshow_1.default.findOne({ where: { slide_title: slide_title, institute_id: institute_id } });
        }
        if (slideshow) {
            res.status(500).json({ message: "Slideshow already exist." });
            return;
        }
        if (id) {
            const slideshow = await Slideshow_1.default.update({
                slide_title,
                slide_image,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Slideshow Updated", data: slideshow });
        }
        else {
            const slideshow = await Slideshow_1.default.create({
                institute_id,
                slide_title,
                slide_image,
                status
            });
            res.json({ message: "Slideshow Created", data: slideshow });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = slideshowRouter;
//# sourceMappingURL=slideshow.route.js.map