// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
import StudentsDAO from "../../dao/studentsDAO";
import QuestionsDAO from "../../dao/questionsDAO";
// import StudentsDAO from "../../dao/studentsDAO";
// import InstructorsDAO from "../../dao/instructorsDAO";
// import isAdmin from "../../utils/validators/isAdmin";
// import isInstructor from "../../utils/validators/isInstructor";
import isStudent from "../../utils/validators/isStudent";

export default class DataController {
  static async getCourse(req: Request, res: Response) {
    try {
      if (!req.body.isAuth) {
        return res.status(403).send("user is not authorized");
      }

      const { courseId } = req.body.data;

      const fetchedCourse = await CoursesDAO.getCourse(courseId);

      return res.status(200).json(fetchedCourse);
    } catch (error) {
      console.error(`Failed at DataController/getCourse. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at DataController/getCourse. error: ${error}`);
    }
  }

  static async getCourses(req: Request, res: Response) {
    try {
      if (!req.body.isAuth) {
        return res.status(403).send("user is not authorized");
      }

      const { studentId } = req.body.data;
      const fetchedCourses = await StudentsDAO.getCourses(studentId);

      return res.status(200).json(fetchedCourses);
    } catch (error) {
      console.error(`Failed at DataController/getCourses. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at DataController/getCourse. error: ${error}`);
    }
  }

  static async getGeneralInfo(req: Request, res: Response) {
    try {
      if (!req.body.isAuth) {
        return res.status(403).send("user is not authorized");
      }

      const fetchedInfo = await CoursesDAO.getGeneralInfo();

      return res.status(200).json(fetchedInfo);
    } catch (error) {
      console.error(`Failed at DataController/generalInfo. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at DataController/generalInfo. error: ${error}`);
    }
  }

  static async getStudentQuestions(req: Request, res: Response) {
    try {
      if (!isStudent(req.body.isAuth, req.body.userData)) {
        return res.status(403).send("user is not authorized");
      }

      const { studentId, courseId } = req.body.data;

      const fetchedStudent = await StudentsDAO.doesStudentExistByID(studentId);
      const fetchedCourse = await CoursesDAO.doesCourseExist(courseId);

      if (!fetchedStudent.exists) {
        throw new Error(`Student ${studentId} does not exist`);
      }

      if (!fetchedCourse.exists) {
        throw new Error(`Course ${courseId} does not exist`);
      }

      if (req.body.userData.userId !== studentId) {
        throw new Error(`A student cannot fetch another students' questions`);
      }

      const fetchedInfo = await QuestionsDAO.getQuestionsOfStudentInCourse(
        fetchedCourse.course!._id.toString(),
        studentId,
      );

      return res.status(200).json(fetchedInfo);
    } catch (error) {
      console.error(
        `Failed at DataController/getStudentQuestions. error: ${error}`,
      );
      return res
        .status(500)
        .send(`Failed at DataController/getStudentQuestions. error: ${error}`);
    }
  }
}
