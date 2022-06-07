// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
// import QuestionsDAO from "../../dao/questionsDAO";
import StudentsDAO from "../../dao/studentsDAO";
import InstructorsDAO from "../../dao/instructorsDAO";
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

      const fetchedInstructor = await InstructorsDAO.getInstructorById(
        // @ts-ignore
        fetchedCourse.instructor,
      );

      const fetchedStudents = await StudentsDAO.getStudentsById(
        // @ts-ignore
        fetchedCourse.students,
      );

      return res.status(200).json({
        ...fetchedCourse,
        students: fetchedStudents,
        instructor: fetchedInstructor,
      });
    } catch (error) {
      console.error(`Failed at DataController/getCourse. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at DataController/getCourse. error: ${error}`);
    }
  }

  // static async getCourses(req: Request, res: Response) {
  //   try {
  //     const { courseIds } = req.body.data;
  //     const result = {};
  //     const fetchedCourses = await CoursesDAO.getCourses(courseIds);

  //     courseIds.forEach(async (courseId: string) => {
  //       const fetchedCourse = await CoursesDAO.getCourse(courseId);

  //       const fetchedInstructor = await InstructorsDAO.getInstructorById(
  //         // @ts-ignore
  //         fetchedCourse.instructor,
  //       );

  //       const fetchedStudents = await StudentsDAO.getStudentsById(
  //         // @ts-ignore
  //         fetchedCourse.students,
  //       );

  //       result[courseId] = {
  //         ...fetchedCourse,
  //         students: fetchedStudents,
  //         instructor: fetchedInstructor,
  //       };
  //     });

  //     return res.status(200).json(result);
  //   } catch (error) {
  //     console.error(`Failed at DataController/getCourse. error: ${error}`);
  //     return res
  //       .status(500)
  //       .send(`Failed at DataController/getCourse. error: ${error}`);
  //   }
  // }
}
