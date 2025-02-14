"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    failOnErrors: true,
    swaggerDefinition: {
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'Bldea',
        },
        basePath: '/',
    },
    apis: ['src/routes/*.route.ts'], // Replace with the path to your route file
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map