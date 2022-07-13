import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
// import bcrypt from "bcryptjs";
// import CoursesDAO from './coursesDAO'
// import StudentsDAO from './studentsDAO'
import { Question } from "../interfaces";
import StudentsDAO from "./studentsDAO";

let quizMakerDb: Db;
let questionsCollection: Collection;

export default class QuestionsDAO {
  static async injectDB(client: MongoClient) {
    try {
      quizMakerDb = await client.db("quiz_maker");
      questionsCollection = await quizMakerDb.collection("questions");
    } catch (error) {
      console.error(`Failed at questionsDAO/injectDB. Error: ${error}`);
      throw error;
    }
  }

  static async getQuestionsOfStudentInCourse(
    courseId: string,
    studentId: string,
  ) {
    try {
      const transformedCourseId = new ObjectId(courseId);
      const transformedStudentId = new ObjectId(studentId);

      const fetchedQuestions = await questionsCollection
        .find({
          studentId: transformedStudentId,
          courseId: transformedCourseId,
        })
        .toArray();

      return fetchedQuestions;
    } catch (error) {
      console.error(
        `Failed at questionsDAO/getQuestionsOfStudentInCourse. Error: ${error}`,
      );
      throw error;
    }
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

  static async getQuestionsByCourseId(courseId: string) {
    try {
      const transformedCourseId = new ObjectId(courseId);

      const fetchedQuestions = await questionsCollection
        .find({
          courseId: transformedCourseId,
        })
        .toArray();

      return fetchedQuestions;
    } catch (error) {
      console.error(
        `Failed at questionsDAO/getQuestionsByCourseId. Error: ${error}`,
      );
      throw error;
    }
  }

  static async deleteByCourseId(courseId: string) {
    try {
      await questionsCollection.deleteMany({
        courseId: new ObjectId(courseId),
      });
    } catch (error) {
      console.error(`Failed at questionsDAO/deleteByCourseId. Error: ${error}`);
      throw error;
    }
  }

  static async deleteByQuestionId(questionId: string) {
    try {
      await questionsCollection.deleteOne({
        _id: new ObjectId(questionId),
      });
    } catch (error) {
      console.error(
        `Failed at questionsDAO/deleteByQuestionId. Error: ${error}`,
      );
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
      const { insertedId } = await questionsCollection.insertOne(
        newQuestionDoc,
      );

      // adding the question to students profile
      await StudentsDAO.addQuestion(studentId, insertedId.toString());
    } catch (error) {
      console.error(`Failed at questionsDAO/submitQuestion. Error: ${error}`);
      throw error;
    }
  }

  static async getRandomQuestionsByModuleId(
    courseId: string,
    moduleId: number,
    countInModule: number,
  ) {
    try {
      const transformedCourseId = new ObjectId(courseId);

      const fetchedQuestions = await questionsCollection
        .aggregate([
          {
            $match: {
              courseId: transformedCourseId,
              moduleId,
            },
          },
          {
            $sample: {
              size: countInModule,
            },
          },
        ])
        .toArray();

      return fetchedQuestions;
    } catch (error) {
      console.error(
        `Failed at questionsDAO/getRandomQuestionsByModuleId. Error: ${error}`,
      );
      throw error;
    }
  }

  static async updateQuestionsUsedInExam(
    questionIds: string[],
    examId: string,
  ) {
    try {
      const transformedQuestionIds = questionIds.map(
        (questionId) => new ObjectId(questionId),
      );

      const transformedExamId = new ObjectId(examId);

      await questionsCollection.updateMany(
        {
          _id: { $in: transformedQuestionIds },
        },
        {
          $inc: { "usage.count": 1 },

          // @ts-ignore
          $addToSet: { "usage.exams": transformedExamId },
        },
      );
    } catch (error) {
      console.error(
        `Failed at questionsDAO/updateQuestionsUsedInExam. Error: ${error}`,
      );
      throw error;
    }
  }
}
