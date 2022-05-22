import { MongoClient, Collection, Db } from "mongodb";
import _ from "lodash";
import { Course } from "../interfaces";

let quizMakerDb: Db;
let coursesCollection: Collection;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    coursesCollection = await quizMakerDb.collection("courses");
  }

  static async doesCourseExist(courseId: string) {
    const fetchedCourse = await coursesCollection.findOne({ courseId });

    return { exists: !_.isNil(fetchedCourse), course: fetchedCourse };
  }

  static async createCourse(
    name: string,
    logo: string,
    instructor: string,
    courseId: string,
  ) {
    try {
      const courseDoc: Course = {
        courseId,
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
}
