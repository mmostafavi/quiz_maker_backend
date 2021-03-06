// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
import StudentsDAO from "../../dao/studentsDAO";
import QuestionsDAO from "../../dao/questionsDAO";
import ExamsDAO from "../../dao/examsDAO";
// import StudentsDAO from "../../dao/studentsDAO";
import InstructorsDAO from "../../dao/instructorsDAO";
import isAdmin from "../../utils/validators/isAdmin";
import isStudent from "../../utils/validators/isStudent";
import isInstructor from "../../utils/validators/isInstructor";

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

  static async getStudentCourses(req: Request, res: Response) {
    try {
      if (!req.body.isAuth) {
        return res.status(403).send("user is not authorized");
      }

      const { studentId } = req.body.data;
      const fetchedCourses = await StudentsDAO.getCourses(studentId);

      return res.status(200).json(fetchedCourses);
    } catch (error) {
      console.error(
        `Failed at DataController/getStudentCourses. error: ${error}`,
      );
      return res
        .status(500)
        .send(`Failed at DataController/getStudentCourses. error: ${error}`);
    }
  }

  static async getInstructorCourses(req: Request, res: Response) {
    try {
      if (!isInstructor(req.body.isAuth, req.body.userData)) {
        return res.status(403).send("user is not authorized");
      }

      const { instructorId } = req.body.data;
      const fetchedCourses = await InstructorsDAO.getCourses(instructorId);

      return res.status(200).json(fetchedCourses);
    } catch (error) {
      console.error(
        `Failed at DataController/getInstructorCourses. error: ${error}`,
      );
      return res
        .status(500)
        .send(`Failed at DataController/getInstructorCourses. error: ${error}`);
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

  static async getCourseQuestions(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res.status(403).send("user is not allowed to access this data");
      }

      const { courseId } = req.body.data;

      const fetchedQuestions = await QuestionsDAO.getQuestionsByCourseId(
        courseId,
      );

      return res.status(200).json(fetchedQuestions);
    } catch (error) {
      console.error(
        `Failed at DataController/getCourseQuestions. error: ${error}`,
      );
      return res
        .status(500)
        .send(`Failed at DataController/getCourseQuestions. error: ${error}`);
    }
  }

  static async getCourseExams(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res.status(403).send("user is not allowed to access this data");
      }

      const { courseId } = req.body.data;

      const fetchedCourse = await CoursesDAO.getCourseByCourseId(courseId);

      if (req.body.userData.userId !== fetchedCourse.instructor.toString()) {
        throw new Error("Instructor isn't the owner of this course");
      }

      const fetchedExams = await ExamsDAO.getCourseExams(
        fetchedCourse._id.toString(),
      );

      return res.status(200).json(fetchedExams);
    } catch (error) {
      console.error(`Failed at DataController/getCourseExams. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at DataController/getCourseExams. error: ${error}`);
    }
  }
}
