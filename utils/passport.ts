import { Strategy as GitHubStrategy } from 'passport-github2'


export const githubStrategy = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: "http://127.0.0.1:3000/authen/github/callback"
},
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            const firstName = profile.displayName.split(" ")[0]
            const lastName = profile.displayName.split(" ")[1] || ""
            const nodeId = profile.nodeId
            const provider = profile.provider

            return done(null, { firstName, lastName, nodeId, provider });
        });
    }
)