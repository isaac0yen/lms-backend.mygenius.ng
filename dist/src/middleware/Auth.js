"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ThrowError_js_1 = __importDefault(require("../modules/ThrowError.js"));
const Database_js_1 = require("../modules/Database.js");
const SetJwt_js_1 = __importDefault(require("../modules/SetJwt.js"));
const Logger_js_1 = __importDefault(require("../modules/Logger.js"));
function validateAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ['HS256'],
        });
    }
    catch (error) {
        Logger_js_1.default.error('An error occured in Auth line 15', error);
        return null;
    }
}
function validateRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, {
            algorithms: ['HS256'],
        });
    }
    catch (error) {
        Logger_js_1.default.error('An error occured in Auth line 25', error);
        return null;
    }
}
const Auth = async (req, res) => {
    try {
        const accessToken = req.headers['abc-access'];
        const refreshToken = req.headers['abc-refresh'];
        if (refreshToken && accessToken) {
            const isValidAccessToken = validateAccessToken(accessToken);
            if (isValidAccessToken) {
                return isValidAccessToken.userObject ?? null;
            }
            const isValidRefreshToken = validateRefreshToken(refreshToken);
            if (isValidRefreshToken && isValidRefreshToken.refreshId) {
                const user = await Database_js_1.db.findOne('user', {
                    refreshId: isValidRefreshToken.refreshId,
                });
                if (user) {
                    const userTokens = await (0, SetJwt_js_1.default)(user.id);
                    res.set({
                        'Access-Control-Expose-Headers': 'abc-access,abc-refresh',
                        'abc-access': userTokens.accessToken,
                        'abc-refresh': userTokens.refreshToken,
                    });
                    return user.userObject;
                }
                else {
                    return null;
                }
            }
            else {
                (0, ThrowError_js_1.default)('RELOGIN');
            }
        }
        else {
            return null;
        }
    }
    catch (err) {
        Logger_js_1.default.error('An error occured in Auth line 74 for user with id:', err);
        return null;
    }
};
exports.default = Auth;
