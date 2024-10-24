import { DateTime } from 'luxon';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';

export default {
  Query: {
    feedbacks: async () => {
      return await db.findMany('feedback', {});
    },

    feedback: async (_, { id }) => {
      const feedback = await db.findOne('feedback', { id });
      if (!feedback) {
        ThrowError('Feedback not found');
      }
      return feedback;
    }
  },

  Mutation: {
    createFeedback: async (_, { message }, context) => {
      const feedback = {
        user_id: context.user.id,
        message,
        created_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
      };

      const feedbackId = await db.insertOne('feedback', feedback);

      return {
        ...feedback,
        id: feedbackId
      };
    }
  }
};