import { Course } from './courses';

export class User {
    ssn?: number;
    phone?: string;
    username?: string;
    email?: string;
    password?: string;
    approved?: boolean;
    level?: number;
    gpa?: number;
    registeredCourses?: Course[];
    completedCourses?: Course[];
    role?: UserRole;
  }

  export enum UserRole {
    Student = 'student',
    Instructor = 'instructor'
  }