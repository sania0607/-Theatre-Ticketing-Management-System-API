import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./database";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false);
        }

        const result = await pool.query(
          `SELECT id, username, email
           FROM staff
           WHERE email = $1`,
          [email]
        );

        const staff = result.rows[0];

        if (!staff) {
          return done(null, false);
        }

        return done(null, staff);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;