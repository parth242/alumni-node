import express from "express";
import Services, { initializeServicesModel } from "../models/Services"; // Adjust the path as necessary
import { getSequelize } from "../config/db";

const servicesRouter = express.Router();
// Endpoint to get all services
servicesRouter.get("/", async (req, res) => {
    initializeServicesModel(getSequelize());
    console.log("req", req.body);
    try {
        const services = await Services.findAll();
        console.log("services", services);
        res.status(200).json({
            total_records: services.length,
            data: services,
        });
    } catch (error) {
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

export default servicesRouter;
