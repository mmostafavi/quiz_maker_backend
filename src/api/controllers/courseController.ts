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
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to create a Course`);
      }
      const { name, password, logo, instructorId, courseId } = req.body.data;

      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (courseExists.exists) {
        return res.status(403).send(`Course already exists`);
      }

      await coursesDAO.createCourse(
        name,
        password,
        logo,
        instructorId,
        courseId,
      );
      return res.status(200).send("course created successfully");
    } catch (error) {
      console.error(`Failed at CourseController/create. error: ${error}`);
      throw error;
    }
  }

  static async editName(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to rename a Course`);
      }
      const { name, courseId } = req.body.data;

      // checks whether the course with given courseId exists
      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res
          .status(403)
          .send(`Course with id: ${courseId}, doesn't exist`);
      }

      // checks whether the instructor is creator of the course or has admin privileges
      const isCreator = await coursesDAO.isCreator(
        courseId as string,
        req.body.userData.userId as string,
      );

      if (isAdmin(req.body.isAuth, req.body.userData) || isCreator) {
        await coursesDAO.editName(name, courseId);
        return res.status(200).send("course renamed successfully");
      }

      return res
        .status(403)
        .send("instructor hasn't the permission to rename this course'");
    } catch (error) {
      console.error(`Failed at CourseController/create. error: ${error}`);
      throw error;
    }
  }

  static async editModules(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(
            `This user does not have permission to edit modules in a Course`,
          );
      }
      const { courseId, modules } = req.body.data;

      // checks whether the course with given courseId exists
      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res
          .status(403)
          .send(`Course with id: ${courseId}, doesn't exist`);
      }

      // checks whether the instructor is creator of the course or has admin privileges
      const isCreator = await coursesDAO.isCreator(
        courseId as string,
        req.body.userData.userId as string,
      );

      if (isAdmin(req.body.isAuth, req.body.userData) || isCreator) {
        // Module Validation
        // *: Add modules validation here
        // Module Validation

        await coursesDAO.editModules(courseId, modules);
        return res.status(200).send("course modules edited successfully");
      }

      return res
        .status(403)
        .send(
          "instructor hasn't the permission to edit modules of this course'",
        );
    } catch (error) {
      console.error(`Failed at CourseController/editModules. error: ${error}`);
      throw error;
    }
  }

  static async dropStudents(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to drop students`);
      }
      const { courseId } = req.body.data;

      // checks whether the course with given courseId exists
      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res
          .status(403)
          .send(`Course with id: ${courseId}, doesn't exist`);
      }

      // checks whether the instructor is creator of the course or has admin privileges
      const isCreator = await coursesDAO.isCreator(
        courseId as string,
        req.body.userData.userId as string,
      );

      if (isAdmin(req.body.isAuth, req.body.userData) || isCreator) {
        await coursesDAO.dropStudents(courseId);
        return res
          .status(200)
          .send("dropped students from the course successfully");
      }

      return res
        .status(403)
        .send(
          "instructor hasn't the permission to drop students of this course",
        );
    } catch (error) {
      console.error(`Failed at CourseController/dropStudents. error: ${error}`);
      throw error;
    }
  }

  static async dropStudent(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to drop this student`);
      }
      const { courseId, studentId } = req.body.data;

      // checks whether the course with given courseId exists
      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res
          .status(403)
          .send(`Course with id: ${courseId}, doesn't exist`);
      }

      // checks whether the instructor is creator of the course or has admin privileges
      const isCreator = await coursesDAO.isCreator(
        courseId as string,
        req.body.userData.userId as string,
      );

      if (isAdmin(req.body.isAuth, req.body.userData) || isCreator) {
        await coursesDAO.dropStudent(courseId, studentId);
        return res
          .status(200)
          .send("dropped student from the course successfully");
      }

      return res
        .status(403)
        .send(
          "instructor hasn't the permission to drop students of this course",
        );
    } catch (error) {
      console.error(`Failed at CourseController/dropStudent. error: ${error}`);
      throw error;
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      if (
        !(
          isInstructor(req.body.isAuth, req.body.userData) ||
          isAdmin(req.body.isAuth, req.body.userData)
        )
      ) {
        return res
          .status(403)
          .send(`This user does not have permission to delete the course`);
      }
      const { courseId } = req.body.data;

      // checks whether the course with given courseId exists
      const courseExists = await coursesDAO.doesCourseExist(courseId);
      if (!courseExists.exists) {
        return res
          .status(403)
          .send(`Course with id: ${courseId}, doesn't exist`);
      }

      // checks whether the instructor is creator of the course or has admin privileges
      const isCreator = await coursesDAO.isCreator(
        courseId as string,
        req.body.userData.userId as string,
      );

      if (isAdmin(req.body.isAuth, req.body.userData) || isCreator) {
        await coursesDAO.deleteCourse(courseId);
        return res.status(200).send("deleted course successfully");
      }

      return res
        .status(403)
        .send("instructor hasn't the permission to delete this course");
    } catch (error) {
      console.error(`Failed at CourseController/deleteCourse. error: ${error}`);
      throw error;
    }
  }
}
