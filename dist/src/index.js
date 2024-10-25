"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const typeDefs_js_1 = __importDefault(require("./typeDefs.js"));
const resolverMain_js_1 = __importDefault(require("./resolvers/resolverMain.js"));
const Database_js_1 = require("./modules/Database.js");
const Logger_js_1 = __importDefault(require("./modules/Logger.js"));
const FormatError_js_1 = __importDefault(require("./middleware/FormatError.js"));
const Auth_js_1 = __importDefault(require("./middleware/Auth.js"));
Logger_js_1.default.init({
    logDir: 'logs',
    levels: ['info', 'warn', 'error'],
    format: Logger_js_1.default.defaultFormat,
    dateFormat: 'yyyy-LL-dd',
    maxFiles: 30,
});
await (0, Database_js_1.DBConnect)();
const server = new server_1.ApolloServer({
    typeDefs: typeDefs_js_1.default,
    resolvers: resolverMain_js_1.default,
    introspection: true,
    formatError: FormatError_js_1.default,
});
const { url } = await (0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const config = await (0, Auth_js_1.default)(req, res);
        return config;
    },
});
console.log(`🚀  Server ready at: ${url}`);
