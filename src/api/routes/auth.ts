import express from "express";
// import DataController from "../controllers/dataController";
const router = express.Router();

router.route("/student/sign-in");
router.route("/student/signup");
router.route("/instructor/sign-in");
router.route("/instructor/signup");

export default router;
