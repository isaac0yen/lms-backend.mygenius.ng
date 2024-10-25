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

      if (user.status !== 'APPROVED') {
        ThrowError('Your account is not approved yet.');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        ThrowError('Invalid email or password');
      }

      const access_token = await jwt.sign(
        { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, class_id: user.class_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '90d' }
      );

      return {
        access_token,
      };
    }
  }
};
