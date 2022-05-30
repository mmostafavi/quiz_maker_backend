// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
import StudentsDAO from "../../dao/studentsDAO";
// import InstructorsDAO from "../../dao/instructorsDAO";
// import coursesDAO from "../../dao/coursesDAO";
import isAdmin from "../../utils/validators/isAdmin";
// import isInstructor from "../../utils/validators/isInstructor";
import isStudent from "../../utils/validators/isStudent";

export default class CourseController {
  static async joinCourse(req: Request, res: Response) {
    try {
      if (
        !(
          isStudent(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to perform "joinCourse"`);
      }

      // do sth
      const { courseId, studentId, coursePassword } = req.body.data;

      const isPasswordCorrect = await CoursesDAO.isPasswordCorrect(
        courseId,
        coursePassword,
      );

      if (!isPasswordCorrect) {
        return res.status(403).send(`Password is incorrect`);
      }

      if (req.body.userData.userId !== studentId) {
        throw new Error(`A student cannot add another student to a course.`);
      }

      await StudentsDAO.addToCourse(courseId, studentId);
      return res
        .status(200)
        .send(`Student Successfully joined the course with id of ${studentId}`);
    } catch (error) {
      console.error(`Failed at CourseController/joinCourse. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at CourseController/joinCourse. error: ${error}`);
    }
  }
}
