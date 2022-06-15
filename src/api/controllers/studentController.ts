// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CoursesDAO from "../../dao/coursesDAO";
import QuestionsDAO from "../../dao/questionsDAO";
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
        .send(`Student Successfully joined the course with id of ${courseId}`);
    } catch (error) {
      console.error(`Failed at StudentController/joinCourse. error: ${error}`);
      return res
        .status(500)
        .send(`Failed at StudentController/joinCourse. error: ${error}`);
    }
  }

  static async submitQuestion(req: Request, res: Response) {
    try {
      if (
        !(
          isStudent(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(
            `This user does not have permission to perform "submitQuestion"`,
          );
      }

      const { studentId, courseId, moduleId, question } = req.body.data;

      const courseExists = await CoursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res.status(403).send("Course not found");
      }

      const studentExists = await StudentsDAO.doesStudentExistByID(studentId);
      if (!studentExists.exists) {
        return res.status(403).send("Student not found");
      }

      if (req.body.userData.userId !== studentId) {
        throw new Error(
          `A student cannot add a question on behalf of an another student.`,
        );
      }

      await QuestionsDAO.submitQuestion(
        courseExists.course!._id.toString(),
        studentId,
        moduleId,
        question,
      );
      return res.status(200).send(`Question submitted successfully`);
    } catch (error) {
      console.error(
        `Failed at StudentController/submitQuestion. error: ${error}`,
      );
      return res
        .status(500)
        .send(`Failed at StudentController/submitQuestion. error: ${error}`);
    }
  }
}
