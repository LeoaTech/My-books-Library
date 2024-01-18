const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;
require("dotenv").config()
const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Google Auth controller connected");
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      passReqToCallback: true,
    },

    async (request, accessToken, refreshToken, profile, done) => {
      try {
        console.log(accessToken, "User infor", refreshToken);
        // Check if the user already exists in the database
        const query = "SELECT * FROM users WHERE email= $1";
        const result = await client.query(query, [profile.email]);

        console.log(profile, "google profile ");
        console.log(result, "find user");
        if (result?.rows?.length > 0) {
          // User already exists, return the user
          return done(null, result.rows[0]);
        }

        // User doesn't exist, create a new user
        const insertQuery =
          "INSERT INTO users ( name, password,role, email,img_url,email_verified  ) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *";
        const insertedUser = await client.query(insertQuery, [
          profile.displayName,
          "",
          "user",
          profile.email,
          profile?.picture,
          profile?.email_verified,
        ]);

        console.log(insertedUser, "inserted data");

        // Return the new user
        return done(null, insertedUser.rows[0]);
      } catch (err) {
        // Handle errors
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  // done(null, user);

  try {
    const query = "SELECT * FROM users WHERE email= $1";
    const result = await client.query(query, [user.email]);

    // console.log(result, "Deserialized user");
    if (result?.rows?.length > 0) {
      // User already exists, return the user
      return done(null, result.rows[0]);
    }
  } catch (error) {
    return done(error, null);
  }
});
