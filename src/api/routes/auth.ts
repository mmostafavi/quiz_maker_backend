import express from "express";
import AuthControllers from "../controllers/authController";
// import DataController from "../controllers/dataController";
const router = express.Router();

router.route("/student/sign-in").post(AuthControllers.studentSignIn);
router.post("/student/signup", AuthControllers.studentSignup);
router.post("/instructor/sign-in", AuthControllers.instructorSignIn);
router.post("/instructor/signup", AuthControllers.instructorSingUp);

export default router;
