import { MongoClient } from "mongodb";

let studentsDB;

export default class StudentsDAO {
  static async injectDB(client: MongoClient) {
    studentsDB = await client.db("students");
  }

  static async getStudent() {
    // do sth
  }
}
