const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");
const PurchaseHistory = mongoose.model("purchaseHistory");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_CLIENT_ID,
      clientSecret: keys.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${keys.BASE_URL}/auth/facebook/callback`,
      profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
          done(null, existingUser);
        } else {
          const newUser = await new User({
            facebookId: profile.id,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            email: profile.emails[0].value,
            credits: 0,
            ownImages: [],
            purchaseHistory: [],
          }).save();

          new PurchaseHistory({
            userId: newUser._id,
            purchaseHistory: [],
          }).save();

          done(null, newUser);
        }
      } catch (e) {
        console.error(`Error fetching user from MongoDB: ${e.message}`);
        done(e, null);
      }
    }
  )
);
