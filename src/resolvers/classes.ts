import { DateTime } from 'luxon';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';

export default {
  Query: {
    classes: async () => {
      return await db.findMany('classes', {});
    },

    class: async (_, { id }) => {
      const classData = await db.findOne('classes', { id });
      if (!classData) {
        ThrowError('Class not found');
      }
      return classData;
    }
  },

  Mutation: {
    createClass: async (_, { name }, context) => {
      if (context.user.role !== 'ADMIN') {
        ThrowError('Only admins can create classes');
      }

      const classData = {
        name,
        created_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
      };

      const classId = await db.insertOne('classes', classData);

      return {
        ...classData,
        id: classId
      };
    }
  }
};
