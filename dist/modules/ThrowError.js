import { GraphQLError } from 'graphql';
const ThrowError = (message, code = '') => {
    throw new GraphQLError(message, {
        extensions: { code: code.length > 0 ? code : 'USER' },
    });
};
export default ThrowError;
