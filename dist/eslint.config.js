"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = __importDefault(require("globals"));
const js_1 = __importDefault(require("@eslint/js"));
const typescript_eslint_1 = __importDefault(require("typescript-eslint"));
exports.default = [
    { languageOptions: { globals: globals_1.default.browser } },
    js_1.default.configs.recommended,
    ...typescript_eslint_1.default.configs.recommended,
];
