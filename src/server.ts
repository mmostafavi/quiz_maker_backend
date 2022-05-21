import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./api/routes/auth";

import authMiddleware from "../src/middlewares/auth";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authMiddleware);
// app.options("*", (cors as (options: CorsOptions) => RequestHandler)());

app.use("/auth", authRoutes);
// eslint-disable-next-line no-unused-vars
app.use("/gg", (_req: Request, res: Response) => {
  console.log("reached here");
  res.send("hello");
});

export default app;
