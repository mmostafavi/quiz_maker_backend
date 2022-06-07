import { MongoClient, Collection, Db, ObjectId } from "mongodb";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { Course, Module } from "../interfaces";

let quizMakerDb: Db;
let coursesCollection: Collection;
let studentsCollection: Collection;
let instructorsCollection: Collection;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    quizMakerDb = await client.db("quiz_maker");
    coursesCollection = await quizMakerDb.collection("courses");
    studentsCollection = await quizMakerDb.collection("students");
    instructorsCollection = await quizMakerDb.collection("instructors");
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

      return fetchedCourse.instructor === userId;
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
      const fetchedCourse = await coursesCollection.findOne({
        _id: transformedId,
      });

      if (_.isNil(fetchedCourse)) {
        throw Error("Course not found");
      }

      return {
        ...fetchedCourse,
        password: null,
      };
    } catch (error) {
      console.error(`Failed at coursesDAO/isPasswordCorrect. Error: ${error}`);
      throw error;
    }
  }

  // static async getCourses(courseIds: string[]) {
  //   try {
  //     const fetchedCourse = await coursesCollection.find({ courseId });

  //     if (_.isNil(fetchedCourse)) {
  //       throw Error("Course not found");
  //     }

  //     return {
  //       ...fetchedCourse,
  //       password: null,
  //     };
  //   } catch (error) {
  //     console.error(`Failed at coursesDAO/isPasswordCorrect. Error: ${error}`);
  //     throw error;
  //   }
  // }

  static async createCourse(
    name: string,
    password: string,
    logo: string,
    instructor: string,
    courseId: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const courseDoc: Course = {
        courseId,
        password: hashedPassword,
        name,
        logo,
        instructor,
        students: [],
        modules: [],
      };

      const { insertedId } = await coursesCollection.insertOne(courseDoc);
      await instructorsCollection.updateOne(
        { _id: new ObjectId(instructor) },
        { $addToSet: { courses: insertedId } },
      );
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

      const transformedStudentIds: ObjectId[] = fetchedCourse.students.map(
        (studentId: string) => new ObjectId(studentId),
      );

      // updating students' course field
      await studentsCollection.updateMany(
        { _id: { $in: transformedStudentIds } },
        // @ts-ignore
        { $pull: { courses: fetchedCourse._id.toString() } },
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
      await studentsCollection.updateOne(
        { _id: transformedStudentId },
        // @ts-ignore
        { $pull: { courses: fetchedCourse._id.toString() } },
      );

      // updating course's students field
      await coursesCollection.updateOne(
        { courseId },
        { $pull: { students: studentId } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/dropStudent. error: ${error}`);
      throw error;
    }
  }

  static async deleteCourse(courseId: string) {
    try {
      // drop students first
      await this.dropStudents(courseId);

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
        { $push: { students: studentId } },
      );
    } catch (error) {
      console.error(`Failed at CoursesDAO/addStudent. error: ${error}`);
      throw error;
    }
  }
}
