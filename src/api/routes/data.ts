import express from "express";
import dataController from "../controllers/dataController";

const router = express.Router();

router.route("/student/courses").post(dataController.getStudentCourses);
router.route("/instructor/courses").post(dataController.getInstructorCourses);
router.route("/general-info-courses").get(dataController.getGeneralInfo);
router.route("/student/questions").post(dataController.getStudentQuestions);
router.route("/course/questions").post(dataController.getCourseQuestions);
router.route("/course").post(dataController.getCourse);
// router.route("/instructor");
// router.route("/student");

export default router;
