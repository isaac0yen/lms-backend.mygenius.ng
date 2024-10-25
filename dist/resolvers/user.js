import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';
import Validate from '../modules/Validate.js';
export default {
    Mutation: {
        register: async (_, input) => {
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
                ThrowError('An error occurred while creating your account, please try again later.');
            }
            return true;
        },
        approve_user: async (_, { user_id, status }, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const user = await db.findOne('users', { id: user_id });
            if (!user) {
                ThrowError('User not found.');
            }
            if (context.role !== 'ADMIN') {
                ThrowError('Only admins can approve users.');
            }
            const updatedData = {
                status,
                class_id: context.class_id,
                approved_by: context.id,
                updated_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
            };
            const userUpdated = await db.updateOne('users', updatedData, {
                id: user_id,
            });
            if (userUpdated < 1) {
                ThrowError('An error occurred while updating the user status.');
            }
            return true;
        },
        update_profile: async (_, input, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const userExists = await db.findOne('users', { id: context.id });
            if (!userExists) {
                ThrowError('User not found.');
            }
            const updatedInput = {
                ...input,
                updatedAt: new Date()
            };
            const userUpdated = await db.updateOne('users', updatedInput, {
                id: context.id,
            });
            if (userUpdated < 1) {
                ThrowError('An error occurred while updating your profile.');
            }
            return true;
        },
        change_password: async (_, { oldPassword, newPassword }, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const user = await db.findOne('users', { id: context.id });
            if (!user) {
                ThrowError('User not found.');
            }
            const validPassword = await bcrypt.compare(oldPassword, user.password);
            if (!validPassword) {
                ThrowError('Old password is incorrect.');
            }
            const hash = await bcrypt.hash(newPassword, 10);
            const userUpdated = await db.updateOne('users', {
                password: hash,
                updatedAt: new Date()
            }, { id: context.id });
            if (userUpdated < 1) {
                ThrowError('An error occurred while updating the password.');
            }
            return true;
        },
    },
    Query: {
        me: async (_, __, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const user = await db.findOne('users', { id: context.id });
            if (!user) {
                ThrowError('User not found.');
            }
            return user;
        },
        users: async (_, { status }, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const query = status ? { status } : {};
            const users = await db.findMany('users', query);
            if (!users) {
                ThrowError('No users found.');
            }
            return users;
        },
        user: async (_, { id }, context) => {
            if (!context?.id || context.id < 1) {
                ThrowError('RELOGIN');
            }
            const user = await db.findOne('users', { id });
            if (!user) {
                ThrowError('User not found.');
            }
            return user;
        },
    },
};
