"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const Database_js_1 = require("../modules/Database.js");
const ThrowError_js_1 = __importDefault(require("../modules/ThrowError.js"));
const Validate_js_1 = __importDefault(require("../modules/Validate.js"));
exports.default = {
    Mutation: {
        createUser: async (_, { input }) => {
            if (!Validate_js_1.default.email(input.email)) {
                (0, ThrowError_js_1.default)('Your email is invalid.');
            }
            if (!Validate_js_1.default.object(input.phone)) {
                (0, ThrowError_js_1.default)('Your phone is invalid.');
            }
            const userExists = await Database_js_1.db.findOne('user', { email: input.email });
            if (userExists) {
                (0, ThrowError_js_1.default)('User with this email already exists.');
            }
            const phoneNumber = `+${input.phone.prefix}${parseInt(input.phone.number)}`;
            const password = input.password;
            const hash = await bcrypt_1.default.hash(password, 10);
            const user = {
                ...input,
                password: hash,
                phone: phoneNumber,
                status: 'ACTIVE',
            };
            const userCreated = await Database_js_1.db.insertOne('user', user);
            if (userCreated < 1) {
                (0, ThrowError_js_1.default)('An error occurred while creating your account, please try again later.');
            }
            return true;
        },
        updateUser: async (_, { userId, input }) => {
            const userExists = await Database_js_1.db.findOne('user', { id: userId });
            if (!userExists) {
                (0, ThrowError_js_1.default)('User not found.');
            }
            let phone;
            if (input.phone) {
                phone = `+${input.phone.prefix}${parseInt(input.phone.number)}`;
            }
            const updatedData = {
                ...input,
                phone,
            };
            const userUpdated = await Database_js_1.db.updateOne('user', updatedData, {
                id: userId,
            });
            if (userUpdated < 1) {
                (0, ThrowError_js_1.default)('An error occurred while updating your account, please try again later.');
            }
            return true;
        },
        deleteUser: async (_, { userId }) => {
            const userExists = await Database_js_1.db.findOne('user', { id: userId });
            if (!userExists) {
                (0, ThrowError_js_1.default)('User not found.');
            }
            const userDeleted = await Database_js_1.db.deleteOne('user', { id: userId });
            if (userDeleted < 1) {
                (0, ThrowError_js_1.default)('An error occurred while deleting the user, please try again later.');
            }
            return true;
        },
        updatePassword: async (_, { userId, oldPassword, newPassword, }) => {
            const user = await Database_js_1.db.findOne('user', { id: userId });
            if (!user) {
                (0, ThrowError_js_1.default)('User not found.');
            }
            const validPassword = await bcrypt_1.default.compare(oldPassword, user.password);
            if (!validPassword) {
                (0, ThrowError_js_1.default)('Old password is incorrect.');
            }
            const hash = await bcrypt_1.default.hash(newPassword, 10);
            const userUpdated = await Database_js_1.db.updateOne('user', { password: hash }, { id: userId });
            if (userUpdated < 1) {
                (0, ThrowError_js_1.default)('An error occurred while updating the password, please try again later.');
            }
            return true;
        },
    },
    Query: {
        getUser: async (_, { userId }) => {
            const user = await Database_js_1.db.findOne('user', { id: userId });
            if (!user) {
                (0, ThrowError_js_1.default)('User not found.');
            }
            return user;
        },
        getUsers: async () => {
            const users = await Database_js_1.db.findMany('user');
            if (!users) {
                (0, ThrowError_js_1.default)('No users found.');
            }
            return users;
        },
    },
};
