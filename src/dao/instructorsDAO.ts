import { MongoClient, Collection, Db } from "mongodb";
import _ from "lodash";

let quizMakerDB: Db;
let instructorsCollection: Collection;

export default class InstructorsDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDB = await client.db("quiz_maker");
    instructorsCollection = await quizMakerDB.collection("instructors");
  }

  static async doesInstructorExist(username: string) {
    try {
      const fetchedInstructor = await instructorsCollection.findOne({
        "authData.username": username,
      });

      if (!_.isNil(fetchedInstructor)) {
        return {
          exists: true,
          instructor: fetchedInstructor,
        };
      }
      return { exists: false };
    } catch (error) {
      console.error(`Failed at doesInstructorExist. error: ${error}`);
      throw error;
    }
  }
}
