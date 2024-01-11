import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            clientID: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_SECRET,
            clientType: 'confidential',
            callbackURL: `http://localhost:3000/user/twitter/callback`,
            scope: ['users.read', 'tweet.read', 'tweet.write', 'offline.access'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any, info?: any) => void,
    ): Promise<any> {
        try {
            const user = { profile, accessToken, refreshToken };
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
}
