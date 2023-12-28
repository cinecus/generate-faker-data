import express from 'express'
import authenController from './authenController'
import { verifyJwt } from '../middleware/jwtMiddleware'
import passport from 'passport'
const authenRouter = express.Router()

authenRouter.post("/signup", authenController.signup)
authenRouter.post("/signin", authenController.signin)
authenRouter.post("/signout", verifyJwt, authenController.signout)
authenRouter.get("/me", verifyJwt, authenController.me)
authenRouter.get("/sender", verifyJwt, authenController.sender)

authenRouter.get("/github", passport.authenticate('github', { scope: ['user:email', 'user:name'] }))
authenRouter.get("/github/callback", passport.authenticate('github', { failureRedirect: '/failure' }), authenController.githubRedirect)



export default authenRouter