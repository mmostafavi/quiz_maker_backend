import express from "express";
import dataController from "../controllers/dataController";

const router = express.Router();

router.route("/course").post(dataController.getCourse);
router.route("/courses").post(dataController.getCourse);
router.route("/general-info-courses").post(dataController.getCourse);
// router.route("/instructor");
// router.route("/student");

export default router;
