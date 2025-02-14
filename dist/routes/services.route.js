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
const Services_1 = __importStar(require("../models/Services")); // Adjust the path as necessary
const db_1 = require("../config/db");
const servicesRouter = express_1.default.Router();
// Endpoint to get all services
servicesRouter.get("/", async (req, res) => {
    (0, Services_1.initializeServicesModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    try {
        const services = await Services_1.default.findAll();
        console.log("services", services);
        res.status(200).json({
            total_records: services.length,
            data: services,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving services" });
    }
});
/* servicesRouter.post("/create", async (req, res) => {
    try {
        // Initialize Sequelize model if needed
        initializeServicesModel(getSequelize());

        // Extract service data from the request body
        const { service_name, is_custom } = req.body;

        // Create a new service in the database
        const newService = await Services.create({
            service_name,
            is_custom,
        });

        // Respond with the newly created service
        res.status(201).json({
            message: "Service created successfully",
            service: newService,
        });
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({
            message: "Error creating service",
            error: error,
        });
    }
}); */
exports.default = servicesRouter;
//# sourceMappingURL=services.route.js.map