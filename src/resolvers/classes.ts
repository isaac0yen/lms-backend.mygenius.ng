import { DateTime } from 'luxon';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';

export default {
  Query: {
    classes: async (_, __, context) => {
      if (!context?.id || context.id < 1) {
        ThrowError('RELOGIN');
      }
      return await db.findMany('classes', {});
    },

    class: async (_, { id }, context) => {
      if (!context?.id || context.id < 1) {
        ThrowError('RELOGIN');
      }
      const classData = await db.findOne('classes', { id });
      if (!classData) {
        ThrowError('Class not found');
      }
      return classData;
    }
  },

  Mutation: {
    create_class: async (_, { name }, context) => {
      if (!context?.id || context.id < 1) {
        ThrowError('RELOGIN');
      }
      if (context.role !== 'ADMIN') {
        ThrowError('Only admins can create classes');
      }

      const classData = {
        name,
        created_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
      };

      const class_id = await db.insertOne('classes', classData);

      if (class_id < 1) {
        ThrowError('Error creating class');
      }

      return true;
    }
  }
};