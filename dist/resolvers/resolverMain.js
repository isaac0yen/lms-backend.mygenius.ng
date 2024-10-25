import user from './user.js';
import feedback from './feedback.js';
import classes from './classes.js';
import auth from './auth.js';
import announcements from './announcements.js';
const resolver = {
    Mutation: {
        ...user.Mutation,
        ...feedback.Mutation,
        ...classes.Mutation,
        ...auth.Mutation,
        ...announcements.Mutation,
    },
    Query: {
        ...user.Query,
        ...feedback.Query,
        ...classes.Query,
        ...announcements.Query,
    },
};
export default resolver;
