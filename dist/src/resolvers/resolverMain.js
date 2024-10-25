"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_js_1 = __importDefault(require("./user.js"));
const resolver = {
    Mutation: {
        ...user_js_1.default.Mutation,
    },
    Query: {
        ...user_js_1.default.Query,
    },
};
exports.default = resolver;
