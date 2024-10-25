"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const Validate_js_1 = __importDefault(require("./Validate.js"));
const ThrowError_js_1 = __importDefault(require("./ThrowError.js"));
const Logger_js_1 = __importDefault(require("./Logger.js"));
const Database_js_1 = require("./Database.js");
const setJWT = async (id) => {
    try {
        if (!Validate_js_1.default.integer(id)) {
            Logger_js_1.default.error('Invalid ID passed to SetJWT', { id });
            (0, ThrowError_js_1.default)('JWT_ERROR');
        }
        const userObject = await Database_js_1.db.findOne('user', { id });
        if (!userObject) {
            Logger_js_1.default.error('user not found while setting JWT', { id });
            (0, ThrowError_js_1.default)('JWT_ERROR');
        }
        const accessToken = jsonwebtoken_1.default.sign({ userObject }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        if (!accessToken) {
            Logger_js_1.default.error('Access token not generated', { id });
            (0, ThrowError_js_1.default)('JWT_ERROR');
        }
        const refreshId = Math.round(Math.random() * 9999999999) + '.' + Date.now();
        const refreshObject = {
            id,
            refreshId,
        };
        const refreshToken = await jsonwebtoken_1.default.sign(refreshObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        if (!refreshToken) {
            Logger_js_1.default.error('Refresh token not generated', { id });
            (0, ThrowError_js_1.default)('JWT_ERROR');
        }
        const updated = await Database_js_1.db.updateOne('user', { refreshId }, { id });
        if (updated < 1) {
            Logger_js_1.default.error('Refresh ID not updated', { id });
            (0, ThrowError_js_1.default)('JWT_ERROR');
        }
        return { accessToken, refreshToken };
    }
    catch (error) {
        return null;
    }
};
exports.default = setJWT;
