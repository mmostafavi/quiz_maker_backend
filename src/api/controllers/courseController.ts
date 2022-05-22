// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
// import studentsDAO from "../../dao/studentsDAO";
// import InstructorsDAO from "../../dao/instructorsDAO";
import coursesDAO from "../../dao/coursesDAO";
import isAdmin from "../../utils/validators/isAdmin";
import isInstructor from "../../utils/validators/isInstructor";

export default class CourseController {
  static async create(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(
            req.body.isAuth,
            req.body.userData,
            req.body.data.instructorUsername,
          ) ||
          isAdmin(
            req.body.isAuth,
            req.body.userData,
            req.body.data.instructorUsername,
          )
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to create a Course`);
      }
      const { name, logo, instructorId, courseId } = req.body.data;

      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (courseExists.exists) {
        return res.status(403).send(`Course already exists`);
      }

      await coursesDAO.createCourse(name, logo, instructorId, courseId);
      return res.status(200).send("course created successfully");
    } catch (error) {
      console.error(`Failed at CourseController/create. error: ${error}`);
      throw error;
    }
  }

  static async edit() {
    // do sth
  }

  static async delete() {
    // do sth
  }
}
