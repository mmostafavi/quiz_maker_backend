import { MongoClient, Collection, Db } from "mongodb";
// import _ from "lodash";
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

  static async submitQuestion(
    courseId: string,
    studentId: string,
    moduleId: number,
    question: { title: string; body?: string; answer: string },
  ) {
    try {
      const newQuestionDoc: Question = {
        ...question,
        courseId,
        studentId,
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
