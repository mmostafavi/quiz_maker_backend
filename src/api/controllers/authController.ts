import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Department from "../../controller/Department";
import { checkAvailability } from "../../utils/index";

// import { checkAvailability, populate } from "../../utils/index";

export default class AuthControllers {
  static async studentSignIn(req: Request, res: Response) {
    try {
      // ----------------------------------------------------------
      // Add validation for logging in bellow
      // ----------------------------------------------------------
      // here....
      // ----------------------------------------------------------
      // Add validation for logging in above
      // ----------------------------------------------------------
      const { username, password } = req.body;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      const studentExist = await checkAvailability({
        data: username,
        type: "student",
      });

      // if (!studentExist?.exists) {
      //   res.status(403).send(studentExist!.message);
      // } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        studentExist.result?._doc.authData.password,
      );

      if (isPasswordCorrect) {
        const departmentInfo = await populate(
          studentExist?.result?._doc.department._id,
          "department",
        );
        const token = jwt.sign(
          {
            tokenType: "student",
            username,
            departmentInfo,
            userId: studentExist.result.id.toString(),
            numericId: studentExist.result._doc.numericId,
            fName: studentExist.result._doc.fName,
            lName: studentExist.result._doc.lName,
            thesisId: studentExist.result._doc.thesisId,
          },
          process.env.JWT_KEY!,
          {
            expiresIn: "1h",
          },
        );

        res.json({
          ...studentExist!.result._doc,
          token,
          authData: {
            ...studentExist!.result._doc.authData,
            password: null,
          },
        });
      } else {
        res.status(403).send(`password is incorrect`);
      }
      // }
    } catch (err) {
      throw err;
    }
  }

  static async studentSignup(req: Request, res: Response) {
    try {
      // ----------------------------------------------------------
      // Add validation for signing up bellow
      // ----------------------------------------------------------

      if (
        !isManager(req.isAuth, req.userData, req.body.departmentInfo.managerId)
      ) {
        return res
          .status(403)
          .send("this user doesn't have permission for this action");
      }
      // ----------------------------------------------------------
      // Add validation for signing up above
      // ----------------------------------------------------------
      const { username, password, signupData, departmentInfo } = req.body;

      // ----------------------------------------------------------
      // password validation
      // here....
      // password validation
      // ----------------------------------------------------------

      const studentObj = {
        authData: { username, password },
        lName: signupData.lName,
        fName: signupData.fName,
        major: signupData.major,
        grade: +signupData.grade,
        entrance: +signupData.entrance,
        numericId: signupData.numericId,
        department: departmentInfo._id,
      };

      // creating a department instance
      const departmentInstance = new Department(
        departmentInfo.name,
        departmentInfo.managerId,
      );

      // checking for availability of instructor
      const studentExist = await checkAvailability({
        data: username,
        type: "student",
      });

      if (!studentExist?.exists) {
        departmentInstance.createStudent(studentObj);
        res.status(200).send(`user with username of ${username} created`);
      } else {
        res.status(500).send(studentExist?.message);
      }
    } catch (error) {
      res.status(500).send(error);
      throw error;
    }
  }
}
