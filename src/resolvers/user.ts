import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';
import Validate from '../modules/Validate.js';
import { UserInput } from '../types/user';

export default {
  Mutation: {
    register: async (_, input: UserInput) => {
      if (!Validate.email(input.email)) {
        ThrowError('Your email is invalid.');
      }

      const userExists = await db.findOne('users', { email: input.email });

      if (userExists) {
        ThrowError('User with this email already exists.');
      }

      const hash = await bcrypt.hash(input.password, 10);

      const user = {
        ...input,
        password: hash,
        role: 'STUDENT',
        status: 'PENDING',
        created_at: DateTime.now().setZone('Africa/Lagos').toJSDate(),
        updated_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
      };

      const userCreated = await db.insertOne('users', user);

      if (userCreated < 1) {
        ThrowError(
          'An error occurred while creating your account, please try again later.',
        );
      }

      return user;
    },

    approveUser: async (_, { userId, status }: { userId: string, status: string }, context) => {
      const user = await db.findOne('users', { id: userId });

      if (!user) {
        ThrowError('User not found.');
      }

      if (context.user.role !== 'ADMIN') {
        ThrowError('Only admins can approve users.');
      }

      const updatedData = {
        status,
        class_id: context.user.class_id,
        approved_by: context.user.id,
        updated_at: new Date()
      };

      const userUpdated = await db.updateOne('users', updatedData, {
        id: userId,
      });

      if (userUpdated < 1) {
        ThrowError(
          'An error occurred while updating the user status.',
        );
      }

      return {
        ...user,
        ...updatedData
      };
    },

    updateProfile: async (_, input, context) => {
      const userExists = await db.findOne('users', { id: context.user.id });

      if (!userExists) {
        ThrowError('User not found.');
      }

      const updatedInput = {
        ...input,
        updated_at: new Date()
      };

      const userUpdated = await db.updateOne('users', updatedInput, {
        id: context.user.id,
      });

      if (userUpdated < 1) {
        ThrowError(
          'An error occurred while updating your profile.',
        );
      }

      return {
        ...userExists,
        ...updatedInput
      };
    },

    changePassword: async (_, { oldPassword, newPassword }, context) => {
      const user = await db.findOne('users', { id: context.user.id });

      if (!user) {
        ThrowError('User not found.');
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        ThrowError('Old password is incorrect.');
      }

      const hash = await bcrypt.hash(newPassword, 10);

      const userUpdated = await db.updateOne(
        'users',
        {
          password: hash,
          updated_at: new Date()
        },
        { id: context.user.id },
      );

      if (userUpdated < 1) {
        ThrowError(
          'An error occurred while updating the password.',
        );
      }

      return true;
    },
  },

  Query: {
    me: async (_, __, context) => {
      const user = await db.findOne('users', { id: context.user.id });

      if (!user) {
        ThrowError('User not found.');
      }

      return user;
    },

    users: async (_, { status }) => {
      const query = status ? { status } : {};
      const users = await db.findMany('users', query);

      if (!users) {
        ThrowError('No users found.');
      }

      return users;
    },

    user: async (_, { id }) => {
      const user = await db.findOne('users', { id });

      if (!user) {
        ThrowError('User not found.');
      }

      return user;
    },
  },
};
