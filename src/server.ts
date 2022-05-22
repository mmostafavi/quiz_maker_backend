import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./api/routes/auth";
import courseRoutes from "./api/routes/course";

import authMiddleware from "../src/middlewares/auth";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authMiddleware);
// app.options("*", (cors as (options: CorsOptions) => RequestHandler)());

app.use("/course", courseRoutes);
app.use("/auth", authRoutes);

export default app;
