import { ObjectId } from "mongodb";

export type WithId<T extends {}> = T & {
  _id: ObjectId;
};

export interface User {
  authData: {
    username: string;
    password: string;
  };
  lName: string;
  fName: string;
}

export interface Student extends User {
  courses: string[];
  questions: string[];
}

export interface Instructor extends User {
  courses: string[];
}

export interface Module {
  id: number;
  name: string;
}

export interface Course {
  courseId: string;
  password: string | null;
  name: string;
  logo: string;
  instructor: ObjectId;
  students: string[];
  modules: Module[];
}

export interface Question {
  title: string;
  body?: string;
  answer: string;
  studentId: ObjectId;
  courseId: ObjectId;
  moduleId: number;
  usage: {
    count: number;
    exams: ObjectId[];
  };
}

export interface ExamDocQuestion {
  moduleId: number;
  questions: ObjectId[];
}

export interface ExamDoc {
  courseId: ObjectId;
  name: string;
  date: string;
  instructorId: ObjectId;
  questions: ExamDocQuestion[];
}
