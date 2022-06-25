import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { Instructor } from "../interfaces";
import CoursesDAO from "./coursesDAO";

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

  static async getInstructorById(id: string) {
    try {
      const instructorId = new ObjectId(id);
      const fetchedInstructor = await instructorsCollection.findOne(
        {
          _id: instructorId,
        },
        {
          projection: {
            "authData.password": 0,
          },
        },
      );

      if (_.isNil(fetchedInstructor)) {
        throw new Error(`Instructor with id ${id} not found`);
      }

      return fetchedInstructor;
    } catch (error) {
      console.error(`Failed to get instructor in getInstructorById: ${error}`);
      throw error;
    }
  }

  static async getCourses(instructorId: string) {
    try {
      const transformedInstructorId = new ObjectId(instructorId);

      const fetchedInstructor = await instructorsCollection.findOne(
        { _id: transformedInstructorId },
        {
          projection: {
            courses: 1,
          },
        },
      );

      if (_.isNil(fetchedInstructor)) {
        throw new Error("Instructor is not found");
      }

      const fetchedCourseIds: string[] = fetchedInstructor.courses.map(
        (course: ObjectId) => course.toString(),
      );

      const fetchedCourses = await CoursesDAO.getCourses(fetchedCourseIds);

      return fetchedCourses;
    } catch (error) {
      console.error(`Failed at instructorDAO/getCourses. Error: ${error}`);
      throw error;
    }
  }

  static async addCourse(instructorId: string, courseId: string) {
    try {
      await instructorsCollection.updateOne(
        { _id: new ObjectId(instructorId) },
        { $addToSet: { courses: new ObjectId(courseId) } },
      );
    } catch (error) {
      console.error(`Failed at InstructorsDAO/addCourse. Error: ${error}`);
      throw error;
    }
  }

  static async dropCourse(instructorId: string, courseId: string) {
    try {
      await instructorsCollection.updateOne(
        { _id: new ObjectId(instructorId) },
        {
          $pull: {
            courses: new ObjectId(courseId),
          },
        },
      );
    } catch (error) {
      console.error(`Failed at InstructorsDAO/dropCourse. Error: ${error}`);
      throw error;
    }
  }

  static async createInstructor(
    username: string,
    password: string,
    fName: string,
    lName: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const instructorDoc: Instructor = {
        authData: { username, password: hashedPassword },
        fName,
        lName,
        courses: [],
      };
      await instructorsCollection.insertOne(instructorDoc);
    } catch (error) {
      console.error(`Failed to create student in createStudent: ${error}`);
      throw error;
    }
  }
}
