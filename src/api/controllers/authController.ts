import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import studentsDAO from "../../dao/studentsDAO";
import isInstructor from "../../utils/validators/isInstructor";
import InstructorsDAO from "../../dao/instructorsDAO";

export default class AuthControllers {
  static async studentSignIn(req: Request, res: Response) {
    try {
      const { username, password } = req.body.data;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      const studentExist = await studentsDAO.doesStudentExist(username);
      console.log(
        "🚀 ~ file: authController.ts ~ line 24 ~ AuthControllers ~ studentSignIn ~ studentExist",
        studentExist,
      );

      if (!studentExist.exists) {
        res
          .status(403)
          .send(`student with username '${username}' does not exist`);
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          studentExist.student!.authData.password,
        );

        if (isPasswordCorrect) {
          const token = jwt.sign(
            {
              userType: "student",
              username,
              userId: studentExist.student!._id.toString(),
              fName: studentExist.student!.fName,
              lName: studentExist.student!.lName,
            },
            process.env.JWT_KEY!,
            {
              expiresIn: "1h",
            },
          );

          res.json({
            ...studentExist.student!,
            token,
            authData: {
              ...studentExist.student!.authData,
              password: null,
            },
          });
        } else {
          res.status(403).send(`password is incorrect`);
        }
      }
    } catch (err) {
      console.error(`Failed at studentSignIn. error: ${err}`);
      res.status(500).send(err);
      throw err;
    }
  }

  static async studentSignup(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      // ----------------------------------------------------------
      // *: validation for signing up
      // ----------------------------------------------------------

      if (
        !isInstructor(
          req.body.isAuth!,
          req.body.userData,
          req.body.data.instructorUserId,
        )
      ) {
        return res
          .status(403)
          .send("this user doesn't have permission for this action");
      }

      const { username, password, fName, lName } = req.body.data;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      // checking for availability of student
      const studentExist = await studentsDAO.doesStudentExist(username);

      if (!studentExist) {
        studentsDAO.createStudent(username, password, fName, lName);
        res.status(200).send(`user with username of ${username} created`);
      } else {
        res
          .status(500)
          .send(`Student with username of ${username} already exists`);
      }

      return null;
    } catch (error) {
      console.error(`Failed at studentSignUp. error: ${error}`);
      res.status(500).send(error);
      throw error;
    }
  }

  static async instructorSignIn(req: Request, res: Response) {
    try {
      const { username, password } = req.body.data;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      const instructorExists = await InstructorsDAO.doesInstructorExist(
        username,
      );

      if (!instructorExists.exists) {
        res
          .status(403)
          .send(`instructor with username '${username}' does not exist`);
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          instructorExists.instructor!.authData.password,
        );

        if (isPasswordCorrect) {
          const token = jwt.sign(
            {
              userType: "instructor",
              username,
              userId: instructorExists.instructor!._id.toString(),
              fName: instructorExists.instructor!.fName,
              lName: instructorExists.instructor!.lName,
            },
            process.env.JWT_KEY!,
            {
              expiresIn: "1h",
            },
          );

          res.json({
            ...instructorExists.instructor!,
            token,
            authData: {
              ...instructorExists.instructor!.authData,
              password: null,
            },
          });
        } else {
          res.status(403).send(`password is incorrect`);
        }
      }
    } catch (err) {
      console.error(`Failed at InstructorSignIn. error: ${err}`);
      res.status(500).send(err);
      throw err;
    }
  }

  static async instructorSingUp() {
    // do sth
  }

  static async adminSingIn(req: Request, res: Response) {
    try {
      const { username, password } = req.body.data;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      const instructorExists = await InstructorsDAO.doesInstructorExist(
        username,
      );

      if (!instructorExists.exists) {
        res
          .status(403)
          .send(`Admin with username '${username}' does not exist`);
      } else if (username === process.env.admin_username) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          instructorExists.instructor!.authData.password,
        );

        if (isPasswordCorrect) {
          const token = jwt.sign(
            {
              userType: "admin",
              username,
              userId: instructorExists.instructor!._id.toString(),
              fName: instructorExists.instructor!.fName,
              lName: instructorExists.instructor!.lName,
            },
            process.env.JWT_KEY!,
            {
              expiresIn: "1h",
            },
          );

          res.json({
            ...instructorExists.instructor!,
            token,
            authData: {
              ...instructorExists.instructor!.authData,
              password: null,
            },
          });
        } else {
          res.status(403).send(`password is incorrect`);
        }
      } else {
        res.status(403).send(`User is not admin`);
      }
    } catch (err) {
      console.error(`Failed at InstructorSignIn. error: ${err}`);
      res.status(500).send(err);
      throw err;
    }
  }
}
