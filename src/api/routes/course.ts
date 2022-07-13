import express from "express";
import CourseControllers from "../controllers/courseController";

const router = express.Router();

router.route("/edit/name").post(CourseControllers.editName);
router.route("/edit/modules").post(CourseControllers.editModules);
router.route("/drop/students").post(CourseControllers.dropStudents);
router.route("/drop/student").post(CourseControllers.dropStudent);
router.route("/delete/course").post(CourseControllers.deleteCourse);
router.route("/create/exam").post(CourseControllers.createExam);
router.route("/create").post(CourseControllers.create);

export default router;
