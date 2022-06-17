import express from "express";
import StudentController from "../controllers/studentController";

const router = express.Router();

router.route("/course/join").post(StudentController.joinCourse);
router.route("/question/submit").post(StudentController.submitQuestion);
router.route("/question/delete").post(StudentController.deleteQuestion);
// router.route("/question/edit").post(StudentController);

export default router;
