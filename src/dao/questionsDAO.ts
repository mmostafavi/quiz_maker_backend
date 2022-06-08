import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
// import bcrypt from "bcryptjs";
// import CoursesDAO from './coursesDAO'
// import StudentsDAO from './studentsDAO'
import { Question } from "../interfaces";

let quizMakerDb: Db;
// let coursesCollection: Collection;
// let studentsCollection: Collection;
let questionsCollection: Collection;

export default class QuestionsDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    // coursesCollection = await quizMakerDb.collection("courses");
    // studentsCollection = await quizMakerDb.collection("students");
    questionsCollection = await quizMakerDb.collection("questions");
  }

  static async getQuestionById(id: string) {
    try {
      const transformedId = new ObjectId(id);
      const fetchedQuestion = await questionsCollection.findOne({
        _id: transformedId,
      });

      if (_.isNil(fetchedQuestion)) {
        throw new Error(`Question could not find`);
      }

      return fetchedQuestion;
    } catch (error) {
      console.error(`Failed at questionsDAO/getQuestionById. Error: ${error}`);
      throw error;
    }
  }

  static async submitQuestion(
    courseId: string,
    studentId: string,
    moduleId: number,
    question: { title: string; body?: string; answer: string },
  ) {
    try {
      const newQuestionDoc: Question = {
        ...question,
        courseId: new ObjectId(courseId),
        studentId: new ObjectId(studentId),
        moduleId,
        usage: {
          count: 0,
          exams: [],
        },
      };
      await questionsCollection.insertOne(newQuestionDoc);
    } catch (error) {
      console.error(`Failed at questionsDAO/submitQuestion. Error: ${error}`);
      throw error;
    }
  }
}
