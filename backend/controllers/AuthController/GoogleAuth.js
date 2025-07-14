const passport = require("passport");
const pool = require("../../config/dbConfig");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

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
        const result = await pool.query(query, [profile?.email]);

        if (result?.rows?.length > 0) {
          // User already exists, return the user
          return done(null, result?.rows[0]);
        }

        const checkRole = await pool.query(
          "SELECT role_id FROM roles Where name=  $1",
          ["member" || "Member" || "MEMBER"]
        );

        let role;
        if (checkRole?.rowCount > 0) {
          role = checkRole?.rows[0]?.role_id;
        }

        // User doesn't exist, create a new user
        const insertQuery =
          "INSERT INTO users ( name, password,role_id, email,img_url  ) VALUES ($1, $2,$3,$4,$5) RETURNING *";
        const insertedUser = await pool.query(insertQuery, [
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
  // try {
  //   const query = "SELECT * FROM users WHERE email= $1";
  //   const result = await pool.query(query, [user?.email]);

  //   // console.log(result, "Deserialized user");
  //   if (result?.rows?.length > 0) {
  //     // User already exists, return the user
  //     return done(null, result?.rows[0]);
  //   }
  // } catch (error) {
  //   return done(error, null);
  // }

  console.log(user, "Deserializing user");
  done(null, user);
});

module.exports = passport;
