import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';

const DB_uri = process.env.MONGODB_URI;
const DB_user = process.env.MONGODB_USER;
const DB_pass = process.env.MONGODB_PASSWORD;
const DB_appname_salt = process.env.MONGODB_APPNAME_SALT;
const DB_appname = process.env.MONGODB_APPNAME;

const URI = DB_uri || (() => {
    if (!DB_user || !DB_pass || !DB_appname_salt || !DB_appname) {
        throw new Error(
            'Missing MongoDB configuration. Set MONGODB_URI or MONGODB_USER, MONGODB_PASSWORD, MONGODB_APPNAME_SALT, MONGODB_APPNAME.'
        );
    }
    return `mongodb+srv://${DB_user}:${DB_pass}@${DB_appname_salt}.mongodb.net/?appName=${DB_appname}`;
})();

const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export {client};