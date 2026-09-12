import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../modules/user/user.model.js";
import dotenv from "dotenv";

dotenv.config();
export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value;

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              avatar: avatar || undefined,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
};
