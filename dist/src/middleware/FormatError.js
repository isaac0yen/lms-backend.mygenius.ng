"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_js_1 = __importDefault(require("../modules/Logger.js"));
const formatError = (error) => {
    const message = error.message
        .replace(/Error: /g, '')
        .replace(/GraphQL error: /g, '');
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
        Logger_js_1.default.error('UNCAUGHT_INTERNAL_SERVER_ERROR', error);
        return {
            message: "Oops!, that's on us. Please try again later.",
        };
    }
    return {
        ...error,
        message,
    };
};
exports.default = formatError;
