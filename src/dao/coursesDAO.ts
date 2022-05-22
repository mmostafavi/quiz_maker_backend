import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { Course } from "../interfaces";

let quizMakerDb: Db;
let coursesCollection: Collection;
let studentsCollection: Collection;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    coursesCollection = await quizMakerDb.collection("courses");
    studentsCollection = await quizMakerDb.collection("students");
  }

  static async doesCourseExist(courseId: string) {
    const fetchedCourse = await coursesCollection.findOne({ courseId });

    return { exists: !_.isNil(fetchedCourse), course: fetchedCourse };
  }

  static async isCreator(courseId: string, userId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw Error("Course not found");
      }

      return fetchedCourse.instructor === userId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async createCourse(
    name: string,
    password: string,
    logo: string,
    instructor: string,
    courseId: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const courseDoc: Course = {
        courseId,
        password: hashedPassword,
        name,
        logo,
        instructor,
        students: [],
        modules: [],
      };

      await coursesCollection.insertOne(courseDoc);
    } catch (error) {
      console.error(`Failed at CoursesDAO/createCourse. Error: ${error}`);
      throw error;
    }
  }

  static async editName(name: string, courseId: string) {
    try {
      await coursesCollection.updateOne({ courseId }, { $set: { name } });
    } catch (error) {
      console.error(`Failed at CoursesDAO/editName. error: ${error}`);
      throw error;
    }
  }

  static async dropStudents(courseId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw new Error(`Course does not exist`);
      }

      const transformedStudentIds: ObjectId[] = fetchedCourse.students.map(
        (studentId: string) => new ObjectId(studentId),
      );
      console.log(
        "🚀 ~ file: coursesDAO.ts ~ line 86 ~ CoursesDAO ~ dropStudents ~ transformedStudentIds",
        transformedStudentIds,
      );

      // updating students' course field
      await studentsCollection.updateMany(
        { _id: { $in: transformedStudentIds } },
        // @ts-ignore
        { $pull: { courses: fetchedCourse._id.toString() } },
      );

      // updating course's students field
      await coursesCollection.updateOne(
        { courseId },
        { $set: { students: [] } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/dropStudents. error: ${error}`);
      throw error;
    }
  }
}
