import { MongoClient, Collection, Db, ObjectId } from "mongodb";
// import _ from "lodash";
// import bcrypt from "bcryptjs";
// import CoursesDAO from './coursesDAO'
// import StudentsDAO from './studentsDAO'
// import { Question } from "../interfaces";
// import StudentsDAO from "./studentsDAO";

let quizMakerDb: Db;
let examsCollection: Collection;

export default class ExamsDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    examsCollection = await quizMakerDb.collection("exams");
  }

  static async deleteByCourseId(courseId: string) {
    try {
      await examsCollection.deleteMany({
        courseId: new ObjectId(courseId),
      });
    } catch (error) {
      console.error(`Failed at examsDAO/deleteByCourseId. Error: ${error}`);
      throw error;
    }
  }
}
