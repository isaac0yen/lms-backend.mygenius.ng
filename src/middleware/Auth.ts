import jwt, { JwtPayload } from 'jsonwebtoken';
import ThrowError from '../modules/ThrowError.js';
import Logger from '../modules/Logger.js';

interface VerifiedToken extends JwtPayload {
  userObject?: Record<string, unknown>;
}

function validateAccessToken(token: string): VerifiedToken | null {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, {
      algorithms: ['HS256'],
    }) as VerifiedToken;
  } catch (error) {
    Logger.error('An error occured in Auth line 15', error);
    ThrowError('RELOGIN');
  }
}

const Auth = async (req, res): Promise<Record<string, unknown> | null> => {

  try {
    const accessToken = req.headers['lms-access'] as string | undefined;

    if (!accessToken) {
      return null;
    }

    const isValidAccessToken = validateAccessToken(accessToken);

    if (isValidAccessToken) {
      return isValidAccessToken;
    }


    return null;
  } catch (error) {
    return null;

  }

};

export default Auth;