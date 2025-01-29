// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

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

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
