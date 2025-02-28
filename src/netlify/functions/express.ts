import { Handler } from '@netlify/functions'; // Import the Netlify function handler
import serverless from 'serverless-http'; // Import serverless-http to wrap your app

// Import your existing Express app logic (assuming it's in src/index.ts)
import app from '../../index';  // Adjust the path as per your file structure

// Wrap your app with serverless-http
// const handler: Handler = serverless(app);

// Create serverless handler
const serverlessHandler = serverless(app);

// Export a Netlify-compatible handler
const handler: Handler = async (event, context) => {
    const result: any = await serverlessHandler(event, context);
    // Ensure the response matches Netlify's `HandlerResponse` type
    return {
        statusCode: result.statusCode || 200,
        headers: result.headers,
        body: result.body,
    };
};

// Export the handler to be used as a serverless function
export { handler };
