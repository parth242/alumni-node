"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_http_1 = __importDefault(require("serverless-http")); // Import serverless-http to wrap your app
// Import your existing Express app logic (assuming it's in src/index.ts)
const index_1 = __importDefault(require("../../index")); // Adjust the path as per your file structure
// Wrap your app with serverless-http
// const handler: Handler = serverless(app);
// Create serverless handler
const serverlessHandler = (0, serverless_http_1.default)(index_1.default);
// Export a Netlify-compatible handler
const handler = async (event, context) => {
    const result = await serverlessHandler(event, context);
    // Ensure the response matches Netlify's `HandlerResponse` type
    return {
        statusCode: result.statusCode || 200,
        headers: result.headers,
        body: result.body,
    };
};
exports.handler = handler;
//# sourceMappingURL=express.js.map