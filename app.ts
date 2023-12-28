import express from 'express';
import generateDataRouter from './src/generate-data/generateDataRouter';
import dotenv from 'dotenv';
import authenRouter from './src/authen/authenRouter';
import { verifyJwt } from './src/middleware/jwtMiddleware';
import { connectToDatabase } from './src/connect-db';
import session from 'express-session'
import passport from 'passport'
import { githubStrategy } from './utils/passport';
import { checkCredit, consumeCredit } from './src/middleware/requestCreditMiddleware';
import { toCsvFile, toJsonFile, toXlsxFile } from './src/middleware/toFileMiddleware';
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '.env.develop' });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
    done(null, obj);
});
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(githubStrategy);


app.use('/authen', authenRouter)
app.use('/generateData', verifyJwt, checkCredit, generateDataRouter, consumeCredit, toJsonFile, toCsvFile, toXlsxFile,)

app.get('/', (req, res) => res.send("Hello"))
app.get('/failure', (req, res) => res.send("404"))

app.listen(port, async () => {
    await connectToDatabase()
    console.log(`Server is running on port ${port}`);
});
