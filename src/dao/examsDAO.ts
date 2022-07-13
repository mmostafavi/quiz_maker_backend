import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
// import bcrypt from "bcryptjs";
// import CoursesDAO from './coursesDAO'
import QuestionsDAO from "./questionsDAO";
// import StudentsDAO from './studentsDAO'
import { ExamDoc } from "../interfaces";
// import StudentsDAO from "./studentsDAO";

let quizMakerDb: Db;
let examsCollection: Collection;

export default class ExamsDAO {
  static async injectDB(client: MongoClient) {
    try {
      quizMakerDb = await client.db("quiz_maker");
      examsCollection = await quizMakerDb.collection("exams");
    } catch (error) {
      console.error(`Failed to inject DB in ExamDAO/injectDB. error: ${error}`);
      throw error;
    }
  }

  static async getExam(examId: string) {
    try {
      const fetchedExam = await examsCollection.findOne({
        _id: new ObjectId(examId),
      });

      if (_.isNil(fetchedExam)) {
        throw new Error(`Could not find exam`);
      }

      return fetchedExam;
    } catch (error) {
      console.error(`Failed to inject DB in ExamDAO/getExam. error: ${error}`);
      throw error;
    }
  }

  static async createRandomExam(
    courseId: string,
    instructorId: string,
    name: string,
    createdAt: string,
    count: number,
    modules: number[],
  ) {
    try {
      const transformedCourseId = new ObjectId(courseId);
      const transformedInstructorId = new ObjectId(instructorId);

      const fetchedQuestionsPromises = modules.map(
        async (countInModule, index) =>
          QuestionsDAO.getRandomQuestionsByModuleId(
            courseId,
            index + 1,
            countInModule,
          ),
      );

      const questions = await Promise.all(fetchedQuestionsPromises);

      const examDoc: ExamDoc = {
        courseId: transformedCourseId,
        name,
        date: createdAt,
        instructorId: transformedInstructorId,
        questions: [],
      };

      const examDocQuestions = questions.reduce(
        (acc, moduleQuestions, index) => {
          const moduleQuestionIds: ObjectId[] = moduleQuestions.map(
            (question: any) => question._id,
          );

          acc.push({
            moduleId: index + 1,
            questions: moduleQuestionIds,
          });

          return acc;
        },
        [],
      );

      const { insertedId: examId } = await examsCollection.insertOne({
        ...examDoc,
        questions: examDocQuestions,
      });

      const questionsToBeUpdatedIds = questions.reduce(
        (acc: string[], moduleQuestions): string[] => {
          const moduleQuestionIds: string[] = moduleQuestions.map(
            (question: any): string => question._id.toString(),
          );

          return [...acc, ...moduleQuestionIds];
        },
        [],
      );
      await QuestionsDAO.updateQuestionsUsedInExam(
        questionsToBeUpdatedIds,
        examId.toString(),
      );
    } catch (error) {
      console.error(`Failed at examsDAO/createRandomExam. Error: ${error}`);
      throw error;
    }
  }

  static async createLeastUsedExam(
    courseId: string,
    instructorId: string,
    name: string,
    createdAt: string,
    count: number,
    modules: number[],
  ) {
    try {
      // Todo: replace logic below to produce least used questions
      const transformedCourseId = new ObjectId(courseId);
      const transformedInstructorId = new ObjectId(instructorId);

      const fetchedQuestionsPromises = modules.map(
        async (countInModule, index) =>
          QuestionsDAO.getRandomQuestionsByModuleId(
            courseId,
            index + 1,
            countInModule,
          ),
      );

      const questions = await Promise.all(fetchedQuestionsPromises);

      const examDoc: ExamDoc = {
        courseId: transformedCourseId,
        name,
        date: createdAt,
        instructorId: transformedInstructorId,
        questions: [],
      };

      const examDocQuestions = questions.reduce(
        (acc, moduleQuestions, index) => {
          const moduleQuestionIds: ObjectId[] = moduleQuestions.map(
            (question: any) => question._id,
          );

          acc.push({
            moduleId: index + 1,
            questions: moduleQuestionIds,
          });

          return acc;
        },
        [],
      );

      const { insertedId: examId } = await examsCollection.insertOne({
        ...examDoc,
        questions: examDocQuestions,
      });

      const questionsToBeUpdatedIds = questions.reduce(
        (acc: string[], moduleQuestions): string[] => {
          const moduleQuestionIds: string[] = moduleQuestions.map(
            (question: any): string => question._id.toString(),
          );

          return [...acc, ...moduleQuestionIds];
        },
        [],
      );
      await QuestionsDAO.updateQuestionsUsedInExam(
        questionsToBeUpdatedIds,
        examId.toString(),
      );
    } catch (error) {
      console.error(`Failed at examsDAO/createExam. Error: ${error}`);
      throw error;
    }
  }

  static async createMostUsedExam(
    courseId: string,
    instructorId: string,
    name: string,
    createdAt: string,
    count: number,
    modules: number[],
  ) {
    try {
      // Todo: replace logic below to produce most used questions
      const transformedCourseId = new ObjectId(courseId);
      const transformedInstructorId = new ObjectId(instructorId);

      const fetchedQuestionsPromises = modules.map(
        async (countInModule, index) =>
          QuestionsDAO.getRandomQuestionsByModuleId(
            courseId,
            index + 1,
            countInModule,
          ),
      );

      const questions = await Promise.all(fetchedQuestionsPromises);

      const examDoc: ExamDoc = {
        courseId: transformedCourseId,
        name,
        date: createdAt,
        instructorId: transformedInstructorId,
        questions: [],
      };

      const examDocQuestions = questions.reduce(
        (acc, moduleQuestions, index) => {
          const moduleQuestionIds: ObjectId[] = moduleQuestions.map(
            (question: any) => question._id,
          );

          acc.push({
            moduleId: index + 1,
            questions: moduleQuestionIds,
          });

          return acc;
        },
        [],
      );

      const { insertedId: examId } = await examsCollection.insertOne({
        ...examDoc,
        questions: examDocQuestions,
      });

      const questionsToBeUpdatedIds = questions.reduce(
        (acc: string[], moduleQuestions): string[] => {
          const moduleQuestionIds: string[] = moduleQuestions.map(
            (question: any): string => question._id.toString(),
          );

          return [...acc, ...moduleQuestionIds];
        },
        [],
      );
      await QuestionsDAO.updateQuestionsUsedInExam(
        questionsToBeUpdatedIds,
        examId.toString(),
      );
    } catch (error) {
      console.error(`Failed at examsDAO/createExam. Error: ${error}`);
      throw error;
    }
  }

  static async createExam(
    courseId: string,
    instructorId: string,
    name: string,
    createdAt: string,
    count: number,
    modules: number[],
    examMode: string,
  ) {
    try {
      if (examMode === "least-used") {
        return await this.createLeastUsedExam(
          courseId,
          instructorId,
          name,
          createdAt,
          count,
          modules,
        );
      }

      if (examMode === "most-used") {
        return await this.createMostUsedExam(
          courseId,
          instructorId,
          name,
          createdAt,
          count,
          modules,
        );
      }

      // *: default case
      return await this.createRandomExam(
        courseId,
        instructorId,
        name,
        createdAt,
        count,
        modules,
      );
    } catch (error) {
      console.error(`Failed at examsDAO/createRandomExam. Error: ${error}`);
      throw error;
    }
  }

  static async getCourseExams(courseId: string) {
    try {
      const transformedCourseId = new ObjectId(courseId);
      const fetchedExams = await examsCollection
        .aggregate([
          {
            $match: { courseId: transformedCourseId },
          },

          {
            $lookup: {
              from: "questions",
              localField: "questions.questions",
              foreignField: "_id",
              as: "questions",
            },
          },
        ])
        .toArray();

      return fetchedExams;
    } catch (error) {
      console.error(`Failed at examsDAO/getCourseExams. Error: ${error}`);
      throw error;
    }
  }

  static async deleteByExamId(examId: string) {
    try {
      await examsCollection.deleteOne({
        _id: new ObjectId(examId),
      });
    } catch (error) {
      console.error(`Failed at examsDAO/deleteByExamId. Error: ${error}`);
      throw error;
    }
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
