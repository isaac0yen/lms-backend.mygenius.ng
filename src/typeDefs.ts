const typeDefs = `#graphql
  scalar JSON

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    middle_name: String
    email: String!
    date_of_birth: String!
    religion: String!
    phone_number: String!
    gender: Gender!
    role: Role!
    status: Status!
    class_id: Int
    approved_by: User
    created_at: String!
    updated_at: String!
    class: Class
  }

  type Class {
    id: ID!
    name: String!
    created_at: String!
    users: [User!]!
    announcements: [Announcement!]!
  }

  type Announcement {
    id: ID!
    title: String!
    body: String!
    class_id: Int!
    created_by: User!
    created_at: String!
    attachments: [Attachment!]!
  }

  type Attachment {
    id: ID!
    announcement_id: Int!
    file_name: String!
    file_path: String!
    file_type: String!
    created_at: String!
  }

  type Feedback {
    id: ID!
    user_id: Int!
    message: String!
    created_at: String!
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
    access_token: String!
  }

  type Query {
    me: JSON!
    users(status: Status): [JSON!]!
    user(id: ID!): JSON
    classes: [Class!]!
    class(id: ID!): Class
    announcements(class_id: Int): [JSON]!
    announcement(id: ID!): JSON
    feedback(id: ID!): JSON
    feedbacks: [JSON!]!
  }

  type Mutation {
    register(
      first_name: String!
      last_name: String!
      middle_name: String
      email: String!
      password: String!
      date_of_birth: String!
      religion: String!
      phone_number: String!
      gender: Gender!
    ): Boolean!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    approve_user(
      user_id: ID!
      status: Status!
    ): Boolean!

    create_announcement(
      title: String!
      body: String!
      class_id: Int!
      attachments: [Upload]
    ): Boolean!

    create_feedback(
      message: String!
    ): Feedback!

    update_profile(
      first_name: String
      last_name: String
      middle_name: String
      religion: String
      phone_number: String
    ): Boolean!

    change_password(
      old_password: String!
      new_password: String!
    ): Boolean!

    create_class(
      name: String!
    ): Boolean!
  }

  scalar Upload

`;

export default typeDefs;