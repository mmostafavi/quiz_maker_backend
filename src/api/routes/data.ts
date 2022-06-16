import express from "express";
import dataController from "../controllers/dataController";

const router = express.Router();

router.route("/course").post(dataController.getCourse);
router.route("/courses").post(dataController.getCourses);
router.route("/general-info-courses").get(dataController.getGeneralInfo);
router.route("/student/questions").post(dataController.getStudentQuestions);
// router.route("/instructor");
// router.route("/student");

export default router;
