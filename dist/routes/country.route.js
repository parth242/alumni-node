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
const Country_1 = __importStar(require("../models/Country"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const countryRouter = express_1.default.Router();
countryRouter.get('/', async (req, res) => {
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const country = await Country_1.default.findAll();
    res.status(200).json({ total_records: 10, data: country });
});
countryRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const country = await Country_1.default.findOne({ where: { id: req.params.id } });
    console.log("country", country);
    const countryDetails = JSON.parse(JSON.stringify(country));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
    res.json({ message: "Country Details", data: countryDetails });
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
countryRouter.post('/create', async (req, res) => {
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    try {
        const { id, country_name, country_short_code, country_phone_code, status } = req.body;
        console.log("req.body", req.body);
        let country;
        if (id) {
            country = await Country_1.default.findOne({ where: { country_name: country_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", country);
        }
        else {
            country = await Country_1.default.findOne({ where: { country_name: country_name } });
        }
        if (country) {
            res.status(500).json({ message: "Country already exist." });
            return;
        }
        if (id) {
            const country = await Country_1.default.update({
                country_name,
                country_short_code,
                country_phone_code,
                status
            }, {
                where: { id: id }
            });
            res.json({ message: "Country Updated", data: country });
        }
        else {
            const country = await Country_1.default.create({
                country_name,
                country_short_code,
                country_phone_code,
                status
            });
            res.json({ message: "Country Created", data: country });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
countryRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const country = await Country_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
    try {
        await Country_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Country Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
});
countryRouter.get('/status/:id', auth_1.auth, async (req, res) => {
    (0, Country_1.initializeCountryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const country = await Country_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
    try {
        if (country.status == 'active') {
            var status = 'inactive';
        }
        else {
            var status = 'active';
        }
        const countrynew = await Country_1.default.update({
            status
        }, {
            where: { id: req.params.id }
        });
        res.json({ message: "Country Updated", data: countrynew });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
});
exports.default = countryRouter;
//# sourceMappingURL=country.route.js.map