import jwt from 'jsonwebtoken';
import ThrowError from '../modules/ThrowError.js';
import Logger from '../modules/Logger.js';
function validateAccessToken(token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ['HS256'],
        });
    }
    catch (error) {
        Logger.error('An error occured in Auth line 15', error);
        ThrowError('RELOGIN');
    }
}
const Auth = async (req, res) => {
    try {
        const accessToken = req.headers['lms-access'];
        if (!accessToken) {
            return null;
        }
        const isValidAccessToken = validateAccessToken(accessToken);
        if (isValidAccessToken) {
            return isValidAccessToken;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
export default Auth;
