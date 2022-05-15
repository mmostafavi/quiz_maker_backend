import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./api/routes/auth";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.options("*", (cors as (options: CorsOptions) => RequestHandler)());

app.use("auth", authRoutes);

export default app;
