import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.options("*", (cors as (options: CorsOptions) => RequestHandler)());

// *: Import the controllers here
// app.use("route", controller)

export default app;
