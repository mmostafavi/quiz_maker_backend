import { MongoClient, Collection, Db, ObjectId } from "mongodb";
// import _ from "lodash";
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
    quizMakerDb = await client.db("quiz_maker");
    examsCollection = await quizMakerDb.collection("exams");
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
