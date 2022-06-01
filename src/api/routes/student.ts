import express from "express";
import StudentController from "../controllers/studentController";

const router = express.Router();

router.route("/join/course").post(StudentController.joinCourse);
router.route("/submit/question").post(StudentController.submitQuestion);

export default router;
