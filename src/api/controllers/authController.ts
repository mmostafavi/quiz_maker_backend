import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import studentsDAO from "../../dao/studentsDAO";
import isInstructor from "../../utils/validators/isInstructor";

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
        !isInstructor(req.isAuth!, req.userData, req.body.data.instructorUserId)
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
      res.status(500).send(error);
      throw error;
    }
  }

  static async instructorSignIn() {
    // do sth
  }

  static async instructorSingUp() {
    // do sth
  }
}
