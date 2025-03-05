import express from "express";
import Products, { initializeProductsModel } from "../models/Products"; // Adjust the path as necessary
import { getSequelize } from "../config/db";

const productsRouter = express.Router();
// Endpoint to get all products
productsRouter.get("/", async (req, res) => {
    initializeProductsModel(getSequelize());
    console.log("req", req.body);
    try {
        const products = await Products.findAll();
        console.log("products", products);
        console.log("products", products);
        res.status(200).json({
            total_records: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving products" });
    }
});

// productsRouter.post("/create", async (req, res) => {
//     try {
//         // Initialize Sequelize model if needed
//         initializeProductsModel(getSequelize());

//         // Extract products data from the request body
//         const { product_name, is_custom } = req.body;
//         console.log("product_name", product_name);
//         console.log("is_custom", is_custom);
//         // Create a new products in the database
//         const newService = await Products.create({
//             product_name,
//             is_custom,
//         });

//         // Respond with the newly created product
//         res.status(201).json({
//             message: "Product created successfully",
//             product: newService,
//         });
//     } catch (error) {
//         console.error("Error creating product:", error);
//         res.status(500).json({
//             message: "Error creating products",
//             error: error,
//         });
//     }
// });

export default productsRouter;
