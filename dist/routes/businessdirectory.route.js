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
const BusinessDirectory_1 = __importStar(require("../models/BusinessDirectory"));
const db_1 = require("../config/db");
const User_1 = __importStar(require("../models/User"));
const Industry_1 = __importStar(require("../models/Industry"));
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const sequelize_1 = require("sequelize");
const Services_1 = __importStar(require("../models/Services"));
const Products_1 = __importStar(require("../models/Products"));
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const businessdirectoryRouter = express_1.default.Router();
businessdirectoryRouter.get("/", auth_1.auth, async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    (0, User_1.initializeUserModel)((0, db_1.getSequelize)());
    Industry_1.default.hasMany(BusinessDirectory_1.default, { foreignKey: "industry_id" });
    BusinessDirectory_1.default.belongsTo(Industry_1.default, {
        foreignKey: "industry_id",
        targetKey: "id",
    });
    User_1.default.hasMany(BusinessDirectory_1.default, { foreignKey: "user_id" });
    BusinessDirectory_1.default.belongsTo(User_1.default, {
        foreignKey: "user_id",
        targetKey: "id",
    });
    const institute_id = req.instituteId;
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    if (req.query.hasOwnProperty("user_id")) {
        const filteruserid = Number(req.query.user_id);
        if (filteruserid > 0) {
            const filteruserid = req.query.user_id;
            whereCondition.user_id = {
                [sequelize_1.Op.eq]: filteruserid, // For Sequelize or similar ORMs
            };
        }
    }
    whereCondition.status = "active";
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
    const businessdirectorys = await BusinessDirectory_1.default.findAll({
        include: [
            {
                model: Industry_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ["industry_name"], // Fetch the skill_name
            },
            {
                model: User_1.default,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ["first_name", "last_name", "image"], // Fetch the skill_name
            },
        ],
        where: whereCondition, // Your conditions for filtering BusinessDirectorys
        order: [["id", "DESC"]],
        offset: offset, // Pagination offset
        limit: Number(pageSize), // Pagination limit
    });
    const totalcount = await BusinessDirectory_1.default.count({
        include: [
            {
                model: Industry_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ["industry_name"], // Fetch the skill_name
            },
        ],
        distinct: true, // Ensures distinct businessdirectory IDs are counted
        col: "id",
        where: whereCondition,
    });
    const businessdirectorysall = await BusinessDirectory_1.default.findAll({
        include: [
            {
                model: Industry_1.default,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ["industry_name"], // Fetch the skill_name
            },
        ],
        order: [["id", "DESC"]],
        where: { status: "active" },
    });
    res.status(200).json({
        total_records: totalcount,
        data: businessdirectorys,
        total_data: businessdirectorysall,
    });
});
businessdirectoryRouter.get("/:id", auth_1.auth, async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    (0, Industry_1.initializeIndustryModel)((0, db_1.getSequelize)());
    const businessdirectory = await BusinessDirectory_1.default.findOne({
        where: { id: req.params.id, status: "active" },
        include: [
            {
                model: Industry_1.default,
                required: true,
                attributes: ["industry_name"],
            },
        ],
    });
    if (!businessdirectory) {
        res.status(500).json({
            message: "BusinessDirectory not found or already deleted",
        });
        return;
    }
    else {
        res.json({
            message: "BusinessDirectory Details",
            data: businessdirectory,
        });
    }
});
// businessdirectoryRouter.get("/:id", auth, async (req, res) => {
//     initializeBusinessDirectoryModel(getSequelize());
//     const businessdirectory = await BusinessDirectorys.findOne({
//         where: { id: req.params.id },
//     });
//     if (!businessdirectory) {
//         res.status(500).json({ message: "Invalid BusinessDirectory" });
//         return;
//     } else {
//         res.json({
//             message: "BusinessDirectory Details",
//             data: businessdirectory,
//         });
//     }
// });
/**
 *
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
businessdirectoryRouter.delete("/:id", auth_1.auth, async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const event = await BusinessDirectory_1.default.findOne({
        where: { id: req.params.id },
    });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid BusinessDirectory" });
        return;
    }
    try {
        await BusinessDirectory_1.default.update({ status: "deleted" }, { where: { id: req.params.id } });
        res.status(200).json({
            status: "success",
            message: "Delete BusinessDirectory Successfully",
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid BusinessDirectory" });
        return;
    }
});
businessdirectoryRouter.post("/create", async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    try {
        const { id, business_name, business_website, contact_number, industry_id, number_of_employees, founded, location, business_email, description, is_member_association, business_logo, user_id, status, social_facebook, social_instagram, social_linkedin, social_twitter, social_youtube, } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        if (id) {
            console.log("id", id);
            // Construct update fields only with properties available in req.body
            const updateFields = {
                institute_id,
                business_name,
                business_website,
                contact_number,
                industry_id,
                number_of_employees,
                founded,
                location,
                business_email,
                description,
                is_member_association,
                business_logo,
                user_id,
                status,
            };
            // Add social fields only if they are provided in the request
            if (social_facebook !== undefined)
                updateFields.social_facebook = social_facebook;
            if (social_instagram !== undefined)
                updateFields.social_instagram = social_instagram;
            if (social_linkedin !== undefined)
                updateFields.social_linkedin = social_linkedin;
            if (social_twitter !== undefined)
                updateFields.social_twitter = social_twitter;
            if (social_youtube !== undefined)
                updateFields.social_youtube = social_youtube;
            const [updateCount] = await BusinessDirectory_1.default.update(updateFields, {
                where: { id: id },
            });
            console.log("updateFields", updateFields);
            if (updateCount > 0) {
                res.json({
                    message: "BusinessDirectory Updated",
                    data: updateFields,
                });
            }
            else {
                res.status(404).json({
                    message: "BusinessDirectory not found",
                });
            }
        }
        else {
            const businessdirectory = await BusinessDirectory_1.default.create({
                institute_id,
                business_name,
                business_website,
                contact_number,
                industry_id,
                number_of_employees,
                founded,
                location,
                business_email,
                description,
                is_member_association,
                business_logo,
                user_id,
                status,
                social_facebook: social_facebook || "",
                social_instagram: social_instagram || "",
                social_linkedin: social_linkedin || "",
                social_twitter: social_twitter || "",
                social_youtube: social_youtube || "",
            });
            res.json({
                message: "BusinessDirectory Created",
                data: businessdirectory,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
businessdirectoryRouter.patch("/update-members", async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    try {
        const { id, members } = req.body;
        console.log("member_ids", members);
        // Make sure id and members are provided in the request
        if (!id || !members) {
            return res.status(400).json({
                message: "Business ID and members are required",
            });
        }
        // Find the business directory by ID
        const businessDirectory = await BusinessDirectory_1.default.findOne({
            where: { id: id },
        });
        if (!businessDirectory) {
            return res.status(404).json({
                message: "Business Directory not found",
            });
        }
        const membersString = members.map(item => item.id).join(",");
        businessDirectory.member_ids = membersString;
        await businessDirectory.save();
        return res.json({
            message: "Business Directory members updated successfully",
            data: {
                id,
                members: membersString,
            },
        });
    }
    catch (error) {
        console.error("Error updating members:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
});
businessdirectoryRouter.patch("/update-services", async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    (0, Services_1.initializeServicesModel)((0, db_1.getSequelize)());
    try {
        const { id, services } = req.body;
        // Make sure id and services are provided in the request
        if (!id || !services) {
            return res.status(400).json({
                message: "Business ID and services are required",
            });
        }
        // Find the business directory by ID
        const businessDirectory = await BusinessDirectory_1.default.findOne({
            where: { id: id },
        });
        if (!businessDirectory) {
            return res.status(404).json({
                message: "Business Directory not found",
            });
        }
        const customServices = services.filter(item => item.isCustom);
        for (let index = 0; index < customServices.length; index++) {
            const serviceExist = await Services_1.default.findOne({
                where: { service_name: customServices[index].name.trim() },
            });
            if (!serviceExist) {
                await Services_1.default.create({
                    service_name: customServices[index].name,
                    is_custom: true,
                });
            }
        }
        const servicesString = services.map(item => item.name).join(",");
        businessDirectory.services = servicesString;
        await businessDirectory.save(); // Save the updated business directory
        return res.json({
            message: "Business Directory services updated successfully",
            data: {
                id,
                services: servicesString,
            },
        });
    }
    catch (error) {
        console.error("Error updating services:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
});
businessdirectoryRouter.patch("/update-products", async (req, res) => {
    (0, BusinessDirectory_1.initializeBusinessDirectoryModel)((0, db_1.getSequelize)());
    (0, Products_1.initializeProductsModel)((0, db_1.getSequelize)());
    try {
        const { id, products } = req.body;
        // Make sure id and products are provided in the request
        if (!id || !products) {
            return res.status(400).json({
                message: "Business ID and products are required",
            });
        }
        // Find the business directory by ID
        const businessDirectory = await BusinessDirectory_1.default.findOne({
            where: { id: id },
        });
        if (!businessDirectory) {
            return res.status(404).json({
                message: "Business Directory not found",
            });
        }
        const customProducts = products.filter(item => item.isCustom);
        for (let index = 0; index < customProducts.length; index++) {
            const productsExist = await Products_1.default.findOne({
                where: { product_name: customProducts[index].name.trim() },
            });
            if (!productsExist) {
                await Products_1.default.create({
                    product_name: customProducts[index].name,
                    is_custom: true,
                });
            }
        }
        // Join the updated products into a comma-separated string
        const productNamesString = products.map(item => item.name).join(",");
        // Update the products field in the database
        businessDirectory.products = productNamesString;
        await businessDirectory.save(); // Save the updated business directory
        return res.json({
            message: "Business Directory products updated successfully",
            data: {
                id,
                products: productNamesString,
            },
        });
    }
    catch (error) {
        console.error("Error updating products:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
});
exports.default = businessdirectoryRouter;
//# sourceMappingURL=businessdirectory.route.js.map