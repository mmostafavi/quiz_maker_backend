import { MongoClient } from "mongodb";

let instructorsDB;

export default class InstructorsDAO {
  static async injectDB(client: MongoClient) {
    instructorsDB = await client.db("instructors");
  }
}
