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
  createDummyVendor,
} = require("../../helpers/user_onboarding.js");
const { pool } = require("../../config/dbConfig.js");
const { emailQueue } = require("../../queues/index.js");

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
        let userInfo;

        if (action === "join_lib") {
          const subdomain = state.subdomain;
          if (!subdomain) {
            throw new Error("Subdomain missing.Failed to join library");
          }
          let userResult = await pool.query(
            "SELECT id,name, email, city,country,phone,address FROM users WHERE email = $1",
            [profile.email]
          );

          

          if (userResult?.rows?.length > 0) {
            userId = userResult?.rows[0].id;
            userInfo = {
              name: userResult?.rows[0]?.name,
              email: userResult?.rows[0]?.email,
              city: userResult?.rows[0]?.city || "",
              country: userResult?.rows[0]?.country || "",
              address: userResult?.rows[0]?.address || "",
              phone: userResult?.rows[0]?.phone || "",
            };
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
            //  create a new user
            const userResult = await createUser(client, userData);

            userId = userResult?.id;
            userInfo = {
              name: userResult?.name,
              email: userResult?.email,
              city: userResult?.city || "",
              country: userResult?.country || "",
              address: userResult?.address || "",
              phone: userResult?.phone || "",
            };
          }

          const entityId = await getEntity(db, subdomain);

          const branchId = await getBranch(db, entityId);

          const roleResult = await client.query(
            "SELECT role_id FROM roles WHERE entity_id = $1 and name=$2 ",
            [entityId, "customer"]
          );

          let role;
          if (roleResult.rows.length > 0) {
            role = roleResult.rows[0];
           
          }
          const userRoleCheck = await client.query(
            "SELECT id FROM user_entity_roles WHERE user_id = $1 AND entity_id = $2 AND branch_id = $3 AND role_id = $4",
            [userId, entityId, branchId, role.role_id]
          );

          if (userRoleCheck?.rows?.length > 0) {
            userEntity = { userId, entityId, branchId, roleId: role.role_id };

            return done(null, userEntity);
          } else {
            await client.query(
              "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
              [userId, entityId, branchId, role.role_id]
            );
          }          
          await client.query("COMMIT");
          await emailQueue.add("send-welcome-email", {
            to: userInfo?.email || profile?.email,
            entityId,
            userData: { ...userInfo, subdomain, entityId },
          });
          userEntity = { userId, entityId, branchId, roleId: role.role_id };

          return done(null, userEntity);
        } else if (action === "create_lib") {
        
          let userResult = await pool.query(
            "SELECT id,name,email,phone,address,city,country FROM users WHERE email = $1",
            [profile.email]
          );

          if (userResult?.rows?.length > 0) {
            userId = userResult.rows[0].id;
            userInfo = {
              name: userResult?.rows[0]?.name,
              email: userResult?.rows[0]?.email,
              city: userResult?.rows[0]?.city || "",
              country: userResult?.rows[0]?.country || "",
              address: userResult?.rows[0]?.address || "",
              phone: userResult?.rows[0]?.phone || "",
            };

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

            if (ownerCheck?.rows?.length > 0) {
              await client.query("ROLLBACK");
              return done(null, false, {
                message: "User already owns a library",
              });
            }
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
            //  create a new user
            const userResult = await createUser(client, userData);

            userId = userResult?.id;
            userInfo = {
              name: userResult?.name,
              email: userResult?.email,
              city: userResult?.city || "",
              country: userResult?.country || "",
              address: userResult?.address || "",
              phone: userResult?.phone || "",
            };
          }

          // Generate a subdomain
          const subdomain = generateSubdomain(profile.displayName);

          const uniqueSubdomain = await checkSubdomain(client, subdomain);


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

          const branchData = {
            businessName: profile.displayName + "-branch(main)",
            city: "",
            country: "",
            address: "",
            city: "",
            phone: "",
            entityId: entity.id,
          };
          const branch = await createBranch(client, branchData, entity.id);

          const roles = await createDefaultRoles(client, entity.id);

          let ownerRole = roles.find((role) => role.name == "owner");
          const roleAdded = await addPermissions(client, ownerRole.role_id);

          let vendorRole = roles.find((role) => role.name == "vendor");

          let vendorId = await createDummyVendor(
            client,
            entity,
            vendorRole.role_id
          );

          const userRole = await client.query(
            "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4)",
            [userId, entity.id, branch.id, ownerRole.role_id]
          );
          await client.query("COMMIT");
          await emailQueue.add("saas-signup-welcome", {
            to: userInfo?.email || profile?.email,
            userData: {
              ...userInfo,
              entity_name: entity?.name,
              subdomain: entity?.subdomain,
            },
            entityId: entity?.id,
          });
          userEntity = {
            userId,
            entityId: entity.id,
            branchId: branch.id,
            roleId: ownerRole.role_id,
          };

          return done(null, userEntity);
        } else {


          // Check if the user already exists in the database
          let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [profile.email]
          );

          if (userResult?.rows?.length === 0) {
            await client.query("ROLLBACK");
            return done(null, false, {
              message: "User not found. Please create or join a library first.",
            });
          }

          userId = userResult?.rows[0]?.id;
          const subdomain = state?.subdomain;

          if (subdomain) {

            const entityId = await getEntity(db, subdomain);

            const branchId = await getBranch(db, entityId);

            const userRole = await client.query(
              `SELECT uer.entity_id, uer.branch_id, uer.role_id
              FROM user_entity_roles uer
              JOIN roles r ON uer.role_id = r.role_id
              WHERE uer.user_id = $1 and uer.entity_id =$2
              `,
              [userId, entityId]
            );

            if (userRole?.rows?.length == 0) {
              await client.query("ROLLBACK");
              return done(null, false, {
                message: `User is not found for ${subdomain} library`,
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
           u.email, u.name, u.plan
         FROM user_entity_roles uer
         JOIN entities e ON uer.entity_id = e.id
         JOIN branches b ON uer.branch_id = b.id
         JOIN roles r ON uer.role_id = r.role_id
         JOIN users u ON uer.user_id = u.id
        WHERE uer.user_id = $1 AND uer.entity_id = $2 AND uer.branch_id = $3 AND uer.role_id = $4
      `,
      [user.userId, user.entityId, user.branchId, user.roleId]
    );

    // console.log(result.rowCount, "Deserialized user");
    if (result?.rows?.length > 0) {
      // User already exists, return the user
      return done(null, result?.rows[0]);
    }

    return done(null, false, {
      message: "User not found. Please create or join a library first.",
    });
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
