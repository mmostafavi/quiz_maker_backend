import { MongoClient } from "mongodb";

let coursesDB;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    coursesDB = await client.db("courses");
  }
}
