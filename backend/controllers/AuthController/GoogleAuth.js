const passport = require("passport");
const db = require("../../config/dbConfig");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const {
  createEntity,
  createBranch,
  createUser,
  addPermissions,
  checkSubdomain,
  generateSubdomain,
  getEntity,
  getBranch,
  createDefaultRoles,
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
      } catch {
        state = {};
      }
      const action = state.action || "login"; // Default to login if no action

      try {
        // console.log("State ", state); //profile, "USER PROFILE",
        await client.query("BEGIN");

        if (!profile.email || !profile.displayName) {
          return done(new Error("Invalid Google profile data"), null);
        }
        let userId;
        let userEntity = {};
        if (action === "join_lib") {
          // console.log("Inside Join Lib Action");

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

          // Check if "customer" role already exists for this entity
          const roleResult = await client.query(
            "SELECT role_id FROM roles WHERE entity_id = $1 and name=$2 ",
            [entityId, "customer"]
          );

          console.log(roleResult.rows, "Roles Exists");

          let role;
          if (roleResult.rows.length > 0) {
            role = roleResult.rows[0];
            console.log(
              "Roles",
              roleResult.rows,
              "Step 3: Existing customer role from Library found",
              role.role_id
            );
          }
          // Check if user_entity_roles entry already exists
          const userRoleCheck = await client.query(
            "SELECT id FROM user_entity_roles WHERE user_id = $1 AND entity_id = $2 AND branch_id = $3 AND role_id = $4",
            [userId, entityId, branchId, role.role_id]
          );

          if (userRoleCheck.rows.length > 0) {
            console.log("User already associated as customer");
            userEntity = { userId, entityId, branchId, roleId: role.role_id };
            return done(null, userEntity);
          } else {
            const userRole = await client.query(
              "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
              [userId, entityId, branchId, role.role_id]
            );
            console.log(
              "Step 4: ",
              userRole.rows[0],
              "User Entity Role Created"
            );
          }
          await client.query("COMMIT");
          userEntity = { userId, entityId, branchId, roleId: role.role_id };
          return done(null, userEntity);
        } else if (action === "create_lib") {
          // console.log("Inside Create Library Action");

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
              return done(null, false, {
                message: "User already owns a library",
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
            businessName: profile.displayName + "-branch(main)", //to identify an entity Id main branch
            city: "",
            country: "",
            address: "",
            city: "",
            phone: "",
            entityId: entity.id,
          };
          const branch = await createBranch(client, branchData, entity.id);
          console.log(branch.id, "Branch Created");

          /* Important: user Sign up with google account to create library will be act as an owner */
          const roles = await createDefaultRoles(client, entity.id);

          console.log(roles, "New Role Created for Entity ", entity.id);

          // Get the owner role_id from roles list
          let ownerRole = roles.find((role) => role.name == "owner");
          // Add permissions => Allow all permissions to the `owner` role
          const roleAdded = await addPermissions(client, ownerRole.role_id);
          console.log(roleAdded, "Roles permissions added");


          // Add the user Id associated entity, role_id and branch
          const userRole = await client.query(
            "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4)",
            [userId, entity.id, branch.id, ownerRole.role_id]
          );
          console.log(userRole, "Created new user with entity role");
          await client.query("COMMIT");
          userEntity = {
            userId,
            entityId: entity.id,
            branchId: branch.id,
            roleId: ownerRole.role_id,
          };
          return done(null, userEntity);
        } else {
          // Default Login Action

          console.log("Inside Login Action");

          // Check if the user already exists in the database
          let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [profile.email]
          );

          if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return done(null, false, {
              message: "User not found. Please create or join a library first.",
            });
          }

          // get the already existing user_id form db
          userId = userResult.rows[0].id;
          const subdomain = state.subdomain;

          // console.log(subdomain);

          if (subdomain) {
            // console.log("Inside Library Domain Login Action", subdomain);

            const entityId = await getEntity(db, subdomain);

            console.log("Step 1: ", entityId, " Entity Founded");

            const branchId = await getBranch(db, entityId);

            console.log("Step 2: ", branchId, "Branch Founded");

            // get the role_id belongs to that subdomain entity id and user_id.
            // As one user_id must belongs to an entity and with one role_id ( user is associated with an entity with single )

            const userRole = await client.query(
              `
            SELECT uer.entity_id, uer.branch_id, uer.role_id
              FROM user_entity_roles uer
              JOIN roles r ON uer.role_id = r.role_id
              WHERE uer.user_id = $1 and uer.entity_id =$2
              `,
              [userId, entityId]
            );

            if (userRole.rows.length == 0) {
              await client.query("ROLLBACK");
              return done(null, false, {
                message: "User is not found for the library domain",
              });
            }

            userEntity = {
              userId,
              entityId,
              branchId,
              roleId: userRole.rows[0].role_id,
            };

            return done(null, userEntity);
          } else {
            // console.log("Inside Owner Login Action from app domain");

            // Else check for owner login
            const ownerCheck = await client.query(
              `
              SELECT uer.entity_id, uer.branch_id, uer.role_id
              FROM user_entity_roles uer
              JOIN roles r ON uer.role_id = r.role_id
              WHERE uer.user_id = $1 AND r.name = 'owner'
              `,
              [userId]
            );

            // If not owner email
            if (ownerCheck.rows.length === 0) {
              await client.query("ROLLBACK");
              return done(null, false, {
                message:
                  "User is not an owner of any library. Please check your domain",
              });
            }
            ({
              entity_id: entityId,
              branch_id: branchId,
              role_id: roleId,
            } = ownerCheck.rows[0]);

            userEntity = { userId, entityId, branchId, roleId };
            await client.query("COMMIT");
            return done(null, userEntity);
          }
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
  // console.log(user, "deserialize User");

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

    // return done("User not found", null);
    return done(null, false, {
      message: "User not found. Please create or join a library first.",
    });
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
