// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
// import QuestionsDAO from "../../dao/questionsDAO";
// import StudentsDAO from "../../dao/studentsDAO";
// import InstructorsDAO from "../../dao/instructorsDAO";
// import isAdmin from "../../utils/validators/isAdmin";
// import isInstructor from "../../utils/validators/isInstructor";
// import isStudent from "../../utils/validators/isStudent";

export default class DataController {
  static async getCourse(req: Request, res: Response) {
    try {
      if (!req.body.isAuth) {
        return res.status(403).send("user is not authorized");
      }

      const { courseId } = req.body.data;

      const fetchedCourse = await CoursesDAO.getCourse(courseId);

      // const fetchedInstructor = await InstructorsDAO.getInstructorById(
      //   // @ts-ignore
      //   fetchedCourse.instructor.toString(),
      // );

      // const fetchedStudents = await StudentsDAO.getStudentsById(
      //   // @ts-ignore
      //   fetchedCourse.students,
      // );

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

      const { courseIds } = req.body.data;
      const fetchedCourses = await CoursesDAO.getCourses(courseIds);

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
}
