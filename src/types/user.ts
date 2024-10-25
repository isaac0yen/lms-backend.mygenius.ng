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
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  password: string;
  date_of_birth: string;
  religion: string;
  phone_number: string;
  gender: Gender;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  date_of_birth: string;
  religion: string;
  phone_number: string;
  gender: Gender;
  role: Role;
  status: Status;
  class_id?: number;
  approved_by?: User;
  created_at: string;
  updated_at: string;
  class?: Class;
}

export interface Class {
  id: number;
  name: string;
  created_at: string;
  users: User[];
  announcements: Announcement[];
}

interface Announcement {
  id: number;
  content: string;
  created_at: string;
}