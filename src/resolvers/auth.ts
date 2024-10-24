import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';

export default {
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await db.findOne('users', { email });
      if (!user) {
        ThrowError('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        ThrowError('Invalid email or password');
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '90d' }
      );

      return {
        accessToken,
        user
      };
    }
  }
};
