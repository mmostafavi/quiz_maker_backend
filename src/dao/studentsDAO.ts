import { MongoClient, Db, Collection } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";

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

  static async createStudent(
    username: string,
    password: string,
    fName: string,
    lName: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      await studentsCollection.insertOne({
        username,
        password: hashedPassword,
        fName,
        lName,
        courses: [],
        questions: [],
      });
    } catch (error) {
      console.error(`Failed to create student in createStudent: ${error}`);
      throw error;
    }
  }
}
