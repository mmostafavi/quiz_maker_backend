import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { Course, Module } from "../interfaces";

import StudentsDAO from "./studentsDAO";
import ExamsDAO from "./examsDAO";
import QuestionsDAO from "./questionsDAO";
import InstructorsDAO from "./instructorsDAO";

let quizMakerDb: Db;
let coursesCollection: Collection;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    coursesCollection = await quizMakerDb.collection("courses");
  }

  static async getGeneralInfo() {
    try {
      const fetchedCourses = await coursesCollection
        .aggregate([
          {
            $lookup: {
              from: "instructors",
              localField: "instructor",
              foreignField: "_id",
              as: "instructor",
            },
          },
          {
            $addFields: {
              instructor: {
                $arrayElemAt: ["$instructor", 0],
              },
            },
          },
          {
            $project: {
              "instructor.authData.password": 0,
              password: 0,
            },
          },
        ])
        .toArray();

      return fetchedCourses;
    } catch (error) {
      console.error(`Failed at CoursesDAO/getGeneralInfo. error: ${error}`);

      throw error;
    }
  }

  static async getCourseByCourseId(courseId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw new Error("Course not found");
      }

      return fetchedCourse;
    } catch (error) {
      console.error(
        `Failed at CoursesDAO/getCourseByCourseId. error: ${error}`,
      );
      throw error;
    }
  }

  static async getCourseById(id: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({
        _id: new ObjectId(id),
      });

      if (_.isNil(fetchedCourse)) {
        throw new Error("Course not found");
      }

      return fetchedCourse;
    } catch (error) {
      console.error(
        `Failed at CoursesDAO/getCourseByCourseId. error: ${error}`,
      );
      throw error;
    }
  }

  static async doesCourseExist(courseId: string) {
    const fetchedCourse = await coursesCollection.findOne({ courseId });

    return { exists: !_.isNil(fetchedCourse), course: fetchedCourse };
  }

  static async isCreator(courseId: string, userId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw Error("Course not found");
      }

      return fetchedCourse.instructor.toString() === userId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async isStudentAMember(courseId: string, userId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw new Error(`Course ${courseId} does not exist`);
      }

      // stringifying student ids
      fetchedCourse.students = fetchedCourse.students.map((student: ObjectId) =>
        student.toString(),
      );

      if (fetchedCourse.students.includes(userId)) {
        return {
          result: true,
          payload: fetchedCourse,
        };
      }

      return {
        result: false,
        payload: fetchedCourse,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async isPasswordCorrect(courseId: string, password: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw Error("Course not found");
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        fetchedCourse.password,
      );

      return isPasswordCorrect;
    } catch (error) {
      console.error(`Failed at coursesDAO/isPasswordCorrect. Error: ${error}`);
      throw error;
    }
  }

  static async getCourse(id: string) {
    try {
      const transformedId = new ObjectId(id);

      const fetchedCourse = await coursesCollection
        .aggregate([
          {
            $match: {
              _id: transformedId,
            },
          },
          {
            $lookup: {
              from: "instructors",
              foreignField: "_id",
              localField: "instructor",
              as: "instructor",
            },
          },
          {
            $lookup: {
              from: "students",
              foreignField: "_id",
              localField: "students",
              as: "students",
            },
          },

          {
            $addFields: {
              instructor: {
                $arrayElemAt: ["$instructor", 0],
              },
            },
          },
          {
            $project: {
              "instructor.authData.password": 0,
              "students.authData.password": 0,
              password: 0,
            },
          },
        ])
        .toArray();

      if (_.isEmpty(fetchedCourse)) {
        throw Error("Course not found");
      }

      return fetchedCourse[0];
    } catch (error) {
      console.error(`Failed at coursesDAO/getCourse. Error: ${error}`);
      throw error;
    }
  }

  static async getCourses(courseIds: string[]) {
    try {
      const transformedIds = courseIds.map(
        (courseId) => new ObjectId(courseId),
      );

      const fetchedCourses = await coursesCollection
        .aggregate([
          {
            $match: {
              _id: {
                $in: transformedIds,
              },
            },
          },
          {
            $lookup: {
              from: "instructors",
              foreignField: "_id",
              localField: "instructor",
              as: "instructor",
            },
          },
          {
            $lookup: {
              from: "students",
              foreignField: "_id",
              localField: "students",
              as: "students",
            },
          },

          {
            $addFields: {
              instructor: {
                $arrayElemAt: ["$instructor", 0],
              },
            },
          },
          {
            $project: {
              "instructor.authData.password": 0,
              "students.authData.password": 0,
              password: 0,
            },
          },
        ])
        .toArray();

      return fetchedCourses;
    } catch (error) {
      console.error(`Failed at coursesDAO/getCourses. Error: ${error}`);
      throw error;
    }
  }

  static async createCourse(
    name: string,
    password: string,
    logo: string,
    instructor: string,
    courseId: string,
    modules: Module[],
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const courseDoc: Course = {
        courseId,
        password: hashedPassword,
        name,
        logo,
        instructor: new ObjectId(instructor),
        students: [],
        modules,
      };

      const { insertedId } = await coursesCollection.insertOne(courseDoc);
      await InstructorsDAO.addCourse(instructor, insertedId.toString());
    } catch (error) {
      console.error(`Failed at CoursesDAO/createCourse. Error: ${error}`);
      throw error;
    }
  }

  static async editName(name: string, courseId: string) {
    try {
      await coursesCollection.updateOne({ courseId }, { $set: { name } });
    } catch (error) {
      console.error(`Failed at CoursesDAO/editName. error: ${error}`);
      throw error;
    }
  }

  static async dropStudents(courseId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw new Error(`Course does not exist`);
      }

      const studentIds = fetchedCourse.students.map((stdObjId: ObjectId) =>
        stdObjId.toString(),
      );

      // updating students' course field
      await StudentsDAO.dropCourseFromStudents(
        studentIds,
        fetchedCourse._id.toString(),
      );

      // updating course's students field
      await coursesCollection.updateOne(
        { courseId },
        { $set: { students: [] } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/dropStudents. error: ${error}`);
      throw error;
    }
  }

  static async dropStudent(courseId: string, studentId: string) {
    try {
      const fetchedCourse = await coursesCollection.findOne({ courseId });

      if (_.isNil(fetchedCourse)) {
        throw new Error(`Course does not exist`);
      }

      const isStudentAMember = await this.isStudentAMember(courseId, studentId);
      if (!isStudentAMember.result) {
        throw new Error(
          `student with id ${studentId} isn't a member of course with id ${courseId}`,
        );
      }

      const transformedStudentId: ObjectId = new ObjectId(studentId);

      // updating student's course field
      await StudentsDAO.dropCourseFromStudent(
        studentId,
        fetchedCourse._id.toString(),
      );

      // updating course's students field
      await coursesCollection.updateOne(
        { courseId },
        { $pull: { students: transformedStudentId } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/dropStudent. error: ${error}`);
      throw error;
    }
  }

  static async deleteCourse(courseId: string) {
    try {
      // fetching the course
      const fetchedCourse = await this.doesCourseExist(courseId);

      if (!fetchedCourse.exists) {
        throw new Error(`Course ${courseId} does not exist`);
      }

      // drop students first
      await this.dropStudents(courseId);

      // pulling the course from instructor's courses
      await InstructorsDAO.dropCourse(
        fetchedCourse.course!.instructor.toString(),
        fetchedCourse.course!._id.toString(),
      );

      // deleting questions created for that course
      await QuestionsDAO.deleteByCourseId(fetchedCourse.course!._id.toString());

      // deleting exams created for that course
      await ExamsDAO.deleteByCourseId(fetchedCourse.course!._id.toString());

      // delete the course
      await coursesCollection.deleteOne({ courseId });
    } catch (error) {
      console.error(`Failed at CoursesDAO/deleteCourse. error: ${error}`);
      throw error;
    }
  }

  static async editModules(courseId: string, modules: Module[]) {
    try {
      await coursesCollection.updateOne({ courseId }, { $set: { modules } });
    } catch (error) {
      console.error(`Failed at CoursesDAO/editModules. error: ${error}`);
      throw error;
    }
  }

  static async addStudent(courseId: string, studentId: string) {
    try {
      const isStudentAMember = await this.isStudentAMember(courseId, studentId);

      if (isStudentAMember.result) {
        throw new Error(
          `student with id ${studentId} already is joined to the course with id ${courseId}`,
        );
      }

      await coursesCollection.updateOne(
        { courseId },
        { $push: { students: new ObjectId(studentId) } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/addStudent. error: ${error}`);
      throw error;
    }
  }
}
