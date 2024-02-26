const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { Client } = require("pg");
const { jwtDecode } = require("jwt-decode");

const connectionUrl = process.env.CONNECTION_URL;
require("dotenv").config();
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
        console.log(accessToken, "USER PROFILE", refreshToken, "Tokens");

        // Check if the user already exists in the database
        const query = "SELECT * FROM users WHERE email= $1";
        const result = await client.query(query, [profile?.email]);

        if (result?.rows?.length > 0) {
          // User already exists, return the user
          return done(null, result?.rows[0]);
        }

        const checkRole = await client.query(
          "SELECT role_id FROM roles Where name=  $1",
          ["user" || "USER" || "User"]
        );

        let role;
        if (checkRole?.rowCount > 0) {
          role = checkRole?.rows[0]?.role_id;
        }

        // User doesn't exist, create a new user
        const insertQuery =
          "INSERT INTO users ( name, password,role_id, email,img_url  ) VALUES ($1, $2,$3,$4,$5) RETURNING *";
        const insertedUser = await client.query(insertQuery, [
          profile?.displayName,
          "",
          role,
          profile?.email,
          profile?.picture,
        ]);

        console.log(insertedUser?.rowCount, "Google Login inserted data");

        let signedInUser = { ...insertedUser?.rows[0] };
        // Return the new user
        return done(null, signedInUser);
      } catch (err) {
        // Handle errors
        console.log(err, "Google login error");
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    const query = "SELECT * FROM users WHERE email= $1";
    const result = await client.query(query, [user?.email]);

    // console.log(result, "Deserialized user");
    if (result?.rows?.length > 0) {
      // User already exists, return the user
      return done(null, result?.rows[0]);
    }
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
