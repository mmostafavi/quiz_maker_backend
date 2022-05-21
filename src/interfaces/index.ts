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
  name: string;
  instructor: string;
  modules: Module[];
}

export interface Question {
  title: string;
  course: string;
  module: string;
}
