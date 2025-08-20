const passport = require("passport");
const db = require("../../config/dbConfig");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const {
  createEntity,
  createRole,
  createBranch,
  createUser,
  addPermissions,
  checkSubdomain,
  generateSubdomain,
  getEntity,
  getBranch
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
      // Parse the state from the request
      const stateBase64 = request.query.state || "";
      let state;
      try {
        state = JSON.parse(Buffer.from(stateBase64, "base64").toString());
        // console.log(state, "State");
      } catch {
        state = {};
      }
      const action = state.action || "login"; // Default to login if no action

      try {
        console.log(profile, "USER PROFILE", state);
        await client.query("BEGIN");

        if (!profile.email || !profile.displayName) {
          return done(new Error("Invalid Google profile data"), null);
        }
        let userId;
        let userEntity = {};
        if (action === "join_lib") {
          const subdomain = state.subdomain;
          if (!subdomain) {
            throw new Error("Subdomain missing for library join");
          }

          // Check if the user already exists in the database
          let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [profile.email]
          );

          if (userResult?.rows?.length > 0) {
            // get the already existing user_id form db
            userId = userResult.rows[0].id;
          } else {
            const userData = {
              fullName: profile.displayName,
              email: profile.email,
              hashedPassword: "",
              city: "",
              country: "",
              address: "",
              phone: "",
              img_url: profile?.picture || profile.photos?.[0]?.value,
            };
            // User doesn't exist, create a new user
            const userResult = await createUser(client, userData);
            console.log(userId, "User Created");

            userId = userResult?.id;
          }

          const entityId = await getEntity(db, subdomain);

          console.log("Step 1: ", entityId, " Entity Founded");

          const branchId = await getBranch(db, entityId);

          console.log("Step 2: ", branchId, "Branch Founded");

          const role = await createRole(client, entityId, "customer");

          console.log("Step 3: ", role.role_id, " role ID created");

          const userRole = await client.query(
            "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
            [userId, entityId, branchId, role.role_id]
          );

          console.log("Step 4: ", userRole.rows[0], "User Entity Role Created");
          await client.query("COMMIT");
          userEntity = { userId, entityId, branchId, roleId: role.role_id };
          return done(null, userEntity);
        } else if (action === "create_lib") {
          // Check if the user already exists in the database
          let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [profile.email]
          );

          // User already exists
          if (userResult?.rows?.length > 0) {
            // get the already existing user_id form db
            userId = userResult.rows[0].id;

            // Check if user already has an "owner" role in any organization
            const ownerCheck = await pool.query(
              `
              SELECT uer.user_id
              FROM user_entity_roles uer
              JOIN roles r ON uer.role_id = r.role_id
              WHERE uer.user_id = $1 AND r.name = 'owner'
             `,
              [userId]
            );

            if (ownerCheck.rows.length > 0) {
              await client.query("ROLLBACK");
              return res.status(403).json({
                error:
                  "User already owns an Library. Please try with another email address to create library.",
              });
            }
          } else {
            // Before creating a user, Check if this email is not own a library
            const userData = {
              fullName: profile.displayName,
              email: profile.email,
              hashedPassword: "",
              city: "",
              country: "",
              address: "",
              phone: "",
              img_url: profile?.picture || profile.photos?.[0]?.value,
            };
            // User doesn't exist, create a new user
            const userResult = await createUser(client, userData);
            console.log(userId, "User Created");

            userId = userResult?.id;
          }

          // Generate a subdomain
          const subdomain = generateSubdomain(profile.displayName);

          console.log(subdomain, "subdomain created");

          // make sure the subdomain for each entity_id is unique

          const uniqueSubdomain = await checkSubdomain(client, subdomain);

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
            uniqueSubdomain,
          };
          /* Create an Organization */
          const entity = await createEntity(client, entityData);
          console.log(entity.id, "entity Created");

          const branchData = {
            businessName: profile.displayName + "-branch",
            city: "",
            country: "",
            address: "",
            city: "",
            phone: "",
            entityId: entity.id,
          };
          const branch = await createBranch(client, branchData, entity.id);
          console.log(branch.id, "Branch Created");

          /* Important: user Sign in with google account from library domain is customer */
          const role = await createRole(client, entity.id, "owner");
          console.log(role.role_id, "Role Created");

          // Add permissions => Allow all permissions to the `owner` role
          const roleAdded = await addPermissions(client, role.role_id);
          console.log(roleAdded, "Roles permissions added");

          // Add the user Id associated entity, role_id and branch
          const userRole = await client.query(
            "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4)",
            [userId, entity.id, branch.id, role.role_id]
          );
          console.log(userRole, "Created new user with entity role");
          await client.query("COMMIT");
          userEntity = { userId,entityId: entity.id, branchId: branch.id, roleId: role.role_id };
          return done(null, userEntity);
        }

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
  console.log(user, "deserialize User");

  try {
    const result = await db.query(
      `
        SELECT 
           uer.user_id, uer.entity_id, uer.branch_id, uer.role_id,
           e.name AS entity_name, e.subdomain,
           b.name AS branch_name,
           r.name AS role_name,
           u.email, u.name
         FROM user_entity_roles uer
         JOIN entity e ON uer.entity_id = e.id
         JOIN branches b ON uer.branch_id = b.id
         JOIN roles r ON uer.role_id = r.role_id
         JOIN users u ON uer.user_id = u.id
        WHERE uer.user_id = $1 AND uer.entity_id = $2 AND uer.branch_id = $3 AND uer.role_id = $4
      `,
      [user.userId, user.entityId, user.branchId, user.roleId]
    );

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
