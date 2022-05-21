import express from "express";
import AuthControllers from "../controllers/authController";
// import DataController from "../controllers/dataController";
const router = express.Router();

router.route("/student/sign-in").post(AuthControllers.studentSignIn);
router.route("/student/signup").post(AuthControllers.studentSignup);
router.route("/instructor/sign-in").post(AuthControllers.instructorSignIn);
router.route("/instructor/signup").post(AuthControllers.instructorSingUp);
router.route("/admin/sign-in").post(AuthControllers.adminSingIn);

export default router;
