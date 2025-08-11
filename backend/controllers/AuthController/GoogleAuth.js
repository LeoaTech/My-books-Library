const passport = require("passport");
const db = require("../../config/dbConfig");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const {
  createEntity,
  createRole,
  createBranch,
  createUser,
} = require("../../helpers/user_onboarding.js");
const { pool } = require("../../config/dbConfig.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      passReqToCallback: true,
    },

    async (request, accessToken, refreshToken, profile, done) => {
      const client = await pool.connect();

      try {
        console.log(profile, "USER PROFILE", refreshToken, "Tokens");
        await client.query("BEGIN");

        if (!profile.email || !profile.displayName) {
          return done(new Error("Invalid Google profile data"), null);
        }
        // Check if the user already exists in the database
        const query = `
        SELECT 
        u.id, u.email,u.name, u.branch_id, u.role_id,
        b.entity_id , b.name AS branch_name,
        e.name AS entity_name,
        r.name AS role_name
      FROM users u
      JOIN branches b ON u.branch_id = b.id
      JOIN entity e  ON b.entity_id  = e.id
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = $1
        `;
        const result = await db.query(query, [profile.email]);

        let user;
        if (result?.rows?.length > 0) {
          user = result.rows[0].id;
        } else {
          /* Create an Entity  */

          const entityData = {
            businessName: profile?.displayName + "-library",
            city: "",
            country: "",
            address: "",
            city: "",
            phone: "",
            description: "",
            typeOfBooks: "",
            hasMultipleBranches: false,
            deliverIntercity: false,
          };

          /* Create an Organization */
          const entityId = await createEntity(client, entityData);
          console.log(entityId, "entity Created");

          const branch = {
            businessName: profile.displayName + "-branch",
            city: "",
            country: "",
            address: "",
            city: "",
            phone: "",
            entityId,
          };
          const branchId = await createBranch(client, branch, entityId);
          console.log(branchId, "Branch Created");

          /* Create Role for this Entity ID */
          const roleId = await createRole(client, entityId);
          console.log(roleId, "Role Created");

          /* Create new user  */
          const userData = {
            fullName: profile.displayName,
            email: profile.email,
            hashedPassword: "",
            city: "",
            country: "",
            address: "",
            phone: "",
            roleId,
            img_url: profile?.picture || profile.photos?.[0]?.value,
          };
          // User doesn't exist, create a new user
          const userId = await createUser(client, userData, branchId);
          console.log(userId, "User Created");
          await client.query("COMMIT");

          user = userId;

          //  return the new user
          return done(null, user);
        }
        // Return the existing user
        return done(null, user);
      } catch (err) {
        // Handle errors
        await client.query("ROLLBACK");
        console.log(err, "Google login error");
        return done(err, null);
      } finally {
        client.release();
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serilaze user", user);

  done(null, user); //store only user_id in the session
});

passport.deserializeUser(async (user, done) => {
  // console.log(user, "deserialize User");

  try {
    const query = `SELECT 
        u.id, u.email,u.name, u.branch_id, u.role_id,
        b.entity_id , b.name AS branch_name,
        e.name AS entity_name,
        r.name AS role_name
      FROM users u
      JOIN branches b ON u.branch_id = b.id
      JOIN entity e  ON b.entity_id  = e.id
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.id= $1`;
    const result = await db.query(query, [user]);

    console.log(result.rows[0], "Deserialized user");
    if (result?.rows?.length > 0) {
      // User already exists, return the user
      return done(null, result?.rows[0]);
    }

    return done("User not found", null);
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
