"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions_1 = require("../common/functions");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const route = express_1.default.Router();
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
route.get("/", async (req, res) => {
    // initializeStateModel(getSequelize());
    try {
        /* if(req.query.hasOwnProperty('page_size')){
            pageSize = req.query.page_size; // Page size
        } else{
            pageSize = 10; // Page size
        } */
        /* req.body.sessionUser.id = 1;
        const user = await Users.findOne({
            where: { id: req.body.sessionUser.id },
        });
        if (!user) {
            res.status(500).json({ message: "Invalid User" });
            return;
        } */
        const type = req.query?.type || "general";
        console.log("req.query?.type", req.query?.type);
        const fileName = req.query?.filename?.toString() || "";
        const fileExt = fileName.split(".").pop() || "jpeg";
        const key = `${type}/${(0, uuid_1.v4)()}.` + fileExt;
        /* if (process.env.NEXT_PUBLIC_IS_S3_BUCKET === "true") {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
            },
            region: process.env.AWS_REGION as string,
        });

        s3.getSignedUrl(
            'putObject',
            {
                Bucket: process.env.AWS_S3_BUCKET_NAME as string,
                ContentType: 'image/jpeg',
                Key: key,
            },
            (err, url) => {
                return NextResponse.json({ data: { key, url } });
            }
        );
    } else { */
        // Start Tebi Cloud
        const credentials = {
            accessKeyId: process.env.TEBI_S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.TEBI_S3_SECRET_ACCESS_KEY || "",
        };
        console.log("credentials", credentials);
        // Create an S3 service client object.
        const s3Client = new client_s3_1.S3Client({
            endpoint: process.env.TEBI_S3_ENDPOINT_URL,
            credentials: credentials,
            region: process.env.TEBI_S3_REGION,
        });
        console.log("process.env.TEBI_S3_ENDPOINT_URL", process.env.TEBI_S3_ENDPOINT_URL);
        // Generate a presigned URL
        const get_command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.TEBI_S3_BUCKET_NAME,
            Key: key,
            // ResponseContentDisposition: 'attachment; filename="' + file + '"'
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, get_command, {
            expiresIn: 3600,
        });
        res.status(200).json({
            message: "State Created",
            status: 200,
            data: { key, url },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = route;
//# sourceMappingURL=upload.route.js.map