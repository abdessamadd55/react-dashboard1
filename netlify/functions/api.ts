import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

// Create an Express app instance for our serverless function.
const app = express();

// Apply the same middleware you use in your local development server.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// The `registerRoutes` function now accepts an IRouter, which the `app` object is.
// It will add routes like /suppliers, /items, etc., to the app.
// Netlify's redirect from /api/* makes this work seamlessly.
registerRoutes(app);

// Wrap the app with serverless-http and export it as a handler.
export const handler = serverless(app);