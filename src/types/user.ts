enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface UserInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  dateOfBirth: string;
  religion: string;
  phoneNumber: string;
  gender: Gender;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  dateOfBirth: string;
  religion: string;
  phoneNumber: string;
  gender: Gender;
  role: Role;
  status: Status;
  classId?: number;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
  class?: Class;
}

export interface Class {
  id: number;
  name: string;
  createdAt: string;
  users: User[];
  announcements: Announcement[];
}

interface Announcement {
  id: number;
  content: string;
  createdAt: string;
}