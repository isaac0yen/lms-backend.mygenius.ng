const typeDefs = `#graphql
  scalar JSON

  type User {
  id: ID!
  firstName: String!
  lastName: String!
  middleName: String
  email: String!
  dateOfBirth: String!
  religion: String!
  phoneNumber: String!
  gender: Gender!
  role: Role!
  status: Status!
  classId: Int
  approvedBy: User
  createdAt: String!
  updatedAt: String!
  class: Class
}

type Class {
  id: ID!
  name: String!
  createdAt: String!
  users: [User!]!
  announcements: [Announcement!]!
}

type Announcement {
  id: ID!
  title: String!
  body: String!
  classId: Int!
  createdBy: User!
  createdAt: String!
  attachments: [Attachment!]!
}

type Attachment {
  id: ID!
  announcementId: Int!
  fileName: String!
  filePath: String!
  fileType: String!
  createdAt: String!
}

type Feedback {
  id: ID!
  userId: Int!
  message: String!
  createdAt: String!
  user: User!
}

enum Gender {
  MALE
  FEMALE
}

enum Role {
  ADMIN
  STUDENT
}

enum Status {
  PENDING
  APPROVED
  REJECTED
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type Query {
  me: User!
  users(status: Status): [User!]!
  user(id: ID!): User
  classes: [Class!]!
  class(id: ID!): Class
  announcements(classId: Int): [Announcement!]!
  announcement(id: ID!): Announcement
  feedback(id: ID!): Feedback
  feedbacks: [Feedback!]!
}

type Mutation {
  register(
    firstName: String!
    lastName: String!
    middleName: String
    email: String!
    password: String!
    dateOfBirth: String!
    religion: String!
    phoneNumber: String!
    gender: Gender!
  ): User!

  login(
    email: String!
    password: String!
  ): AuthPayload!

  refreshToken(
    refreshToken: String!
  ): AuthPayload!

  approveUser(
    userId: ID!
    status: Status!
  ): User!

  createAnnouncement(
    title: String!
    body: String!
    classId: Int!
    attachments: [Upload]
  ): Announcement!

  createFeedback(
    message: String!
  ): Feedback!

  updateProfile(
    firstName: String
    lastName: String
    middleName: String
    religion: String
    phoneNumber: String
  ): User!

  changePassword(
    oldPassword: String!
    newPassword: String!
  ): Boolean!

  createClass(
    name: String!
  ): Class!
}

scalar Upload

`;

export default typeDefs;
