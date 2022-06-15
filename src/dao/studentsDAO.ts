import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";
import CoursesDAO from "./coursesDAO";
import { Student } from "../interfaces";

let quizMakerDb: Db;
let studentsCollection: Collection;

export default class StudentsDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    studentsCollection = await quizMakerDb.collection("students");
  }

  static async getStudent() {
    // do sth
  }

  static async getCourses(studentId: string) {
    try {
      const transformedStudentId = new ObjectId(studentId);

      const fetchedStudent = await studentsCollection.findOne(
        { _id: transformedStudentId },
        {
          projection: {
            courses: 1,
          },
        },
      );

      if (_.isNil(fetchedStudent)) {
        throw new Error("Student is not found");
      }

      const fetchedCourseIds: string[] = fetchedStudent.courses.map(
        (course: ObjectId) => course.toString(),
      );

      const fetchedCourses = await CoursesDAO.getCourses(fetchedCourseIds);

      return fetchedCourses;
    } catch (error) {
      console.error(`Failed at studentsDAO/getCourses. Error: ${error}`);
      throw error;
    }
  }

  static async doesStudentExist(username: string) {
    try {
      const fetchedStudent = await studentsCollection.findOne({
        "authData.username": username,
      });

      return { exists: !_.isNil(fetchedStudent), student: fetchedStudent };
    } catch (error) {
      console.error(`Failed at doesStudentExist: ${error}`);
      throw error;
    }
  }

  static async doesStudentExistByID(id: string) {
    try {
      const fetchedStudent = await studentsCollection.findOne({
        _id: new ObjectId(id),
      });

      return { exists: !_.isNil(fetchedStudent), student: fetchedStudent };
    } catch (error) {
      console.error(`Failed at doesStudentExist: ${error}`);
      throw error;
    }
  }

  static async getStudentsById(ids: string[]) {
    try {
      const transformedIds = ids.map((id) => new ObjectId(id));
      const fetchedStudents = await studentsCollection
        .find(
          {
            _id: { $in: transformedIds },
          },
          {
            projection: {
              "authData.password": 0,
            },
          },
        )
        .toArray();

      return fetchedStudents;
    } catch (error) {
      console.error(`Failed at getStudentById: ${error}`);
      throw error;
    }
  }

  static async createStudent(
    username: string,
    password: string,
    fName: string,
    lName: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const studentDoc: Student = {
        authData: { username, password: hashedPassword },
        fName,
        lName,
        courses: [],
        questions: [],
      };
      await studentsCollection.insertOne(studentDoc);
    } catch (error) {
      console.error(`Failed to create student in createStudent: ${error}`);
      throw error;
    }
  }

  static async addToCourse(courseId: string, studentId: string) {
    try {
      await CoursesDAO.addStudent(courseId, studentId);
      const fetchedCourse = await CoursesDAO.getCourseByCourseId(courseId);
      await studentsCollection.updateOne(
        { _id: new ObjectId(studentId) },
        { $addToSet: { courses: fetchedCourse._id } },
      );
    } catch (error) {
      console.error(`Failed at joinToCourse: ${error}`);
      throw error;
    }
  }

  static async addQuestion(studentId: string, questionId: string) {
    try {
      await studentsCollection.updateOne(
        { _id: new ObjectId(studentId) },
        { $addToSet: { questions: new ObjectId(questionId) } },
      );
    } catch (error) {
      console.error(`Failed at addQuestion: ${error}`);
      throw error;
    }
  }
}
