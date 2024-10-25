"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const ThrowError = (message, code = '') => {
    throw new graphql_1.GraphQLError(message, {
        extensions: { code: code.length > 0 ? code : 'USER' },
    });
};
exports.default = ThrowError;
