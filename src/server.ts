import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./api/routes/auth";
import courseRoutes from "./api/routes/course";
import studentRoutes from "./api/routes/student";
// import questionRoutes from "./api/routes/question";

import authMiddleware from "../src/middlewares/auth";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authMiddleware);
// app.options("*", (cors as (options: CorsOptions) => RequestHandler)());

app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/student", studentRoutes);
// app.use("/question", questionRoutes);

export default app;
