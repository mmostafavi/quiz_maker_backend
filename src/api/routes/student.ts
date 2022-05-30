import express from "express";
import StudentController from "../controllers/studentController";

const router = express.Router();

router.route("/join/course").post(StudentController.joinCourse);

export default router;
