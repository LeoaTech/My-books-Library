const db = require("../config/dbConfig.js");

// Generate subdomain from Library Business name
function generateSubdomain(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 50);
}

// Verify subdomain and get a unique subdomain

async function checkSubdomain(client, subdomain) {
  let newSubdomain = subdomain;
  while (true) {
    const subdomainCheck = await db.query(
      "SELECT id FROM entity WHERE subdomain = $1",
      [newSubdomain]
    );

    if (subdomainCheck.rows.length === 0) {
      return newSubdomain;
    }

    // Append a random number to try again
    newSubdomain = subdomain + Math.floor(Math.random() * 10000);
  }
}

// allow all Permissions for Owner roles

async function addPermissions(client, roleId) {
  const getAllPermissions = await db.query(
    `Select permission_id from permissions`
  );

  console.log(getAllPermissions.rowCount, "Get all permissions");

  if (getAllPermissions.rows.length > 0) {
    const values = getAllPermissions.rows
      .map((p) => `(${roleId}, ${p.permission_id})`)
      .join(",");

    console.log(values, "Values");

    const addPermissionQuery = `
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES
        ${values}
      RETURNING *;
    `;

    const saveNewRolePermissions = await client.query(addPermissionQuery);
    console.log(saveNewRolePermissions.rowCount);

    return saveNewRolePermissions?.rows || [];
  } else {
    console.log("No Permissions founds");
    return [];
  }
}

// Database operation functions
async function createEntity(client, entityData) {
  const {
    businessName,
    country,
    address,
    city,
    phone,
    typeOfBooks,
    hasMultipleBranches,
    deliverIntercity,
    description,
    uniqueSubdomain,
  } = entityData;
  const query = `
    INSERT INTO entity (name, city,country, address, phone, type_of_books, deliver_inter_city,multiple_branches,description,subdomain) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) RETURNING id,name`;
  const values = [
    businessName,
    city,
    country,
    address,
    phone,
    typeOfBooks,
    deliverIntercity,
    hasMultipleBranches,
    description,
    uniqueSubdomain,
  ];
  const result = await client.query(query, values);
  return result.rows[0];
}

async function createBranch(client, branchData, entityId) {
  const { businessName, city, country, address, phone } = branchData;
  const query = `
    INSERT INTO branches (entity_id, name, city,country,address,phone)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  const values = [entityId, businessName, city, country, address, phone];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Add Default Roles
async function createDefaultRoles(client, entityId) {
  const roleTypes = ["owner", "customer", "vendor"];

  try {
    // Use Promise.all to wait for all role creations to complete
    const roles = await Promise.all(
      roleTypes.map(async (role_type) => {
        return await createRole(client, entityId, role_type, true);
      })
    );
    return roles;
  } catch (error) {
    console.error("Error creating default roles:", error);
    throw error;
  }
}

async function createRole(client, entityId, role_type) {
  const query = `
    INSERT INTO roles (entity_id, name)
    VALUES ($1, $2)
    RETURNING role_id,name;
  `;
  const values = [entityId, role_type];
  const result = await client.query(query, values);
  console.log(result.rows[0], "Roles table");

  return result.rows[0];
}

async function createUser(client, userData) {
  const {
    fullName,
    email,
    hashedPassword,
    city,
    country,
    address,
    phone,
    img_url,
  } = userData;

  const query = `
    INSERT INTO users (name, email,password,city,country,address, phone, img_url)
    VALUES ($1, $2, $3, $4,$5,$6,$7,$8)
    RETURNING *;
  `;
  const values = [
    fullName,
    email,
    hashedPassword,
    city,
    country,
    address,
    phone,
    img_url || "",
  ];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Get the Entity Id belongs to Subdomain
async function getEntity(db, subdomain) {
  const subdomainCheck = await db.query(
    "SELECT id FROM entity WHERE subdomain = $1",
    [subdomain]
  );

  return subdomainCheck.rows[0].id;
}

// Get Branch Id belongs to that subdomain entity

async function getBranch(db, entityId) {
  const checkBranch = await db.query(
    "SELECT id FROM branches WHERE entity_id = $1",
    [entityId]
  );

  // Get the main branch entity Id
  // const names = checkBranch.rows.filter((branch) => branch.name.includes("(main)"));
  return checkBranch.rows[0].id;
}

// Create a Dummy Vendor
async function createDummyVendor(client, entity, roleId) {
  const defaultVendorQuery = `
      INSERT INTO vendors ( name,role_id)
      VALUES ($1, $2)
      RETURNING id;
    `;
  const defaultVendorResult = await client.query(defaultVendorQuery, [
    `${entity.name} Vendor`,
    roleId,
  ]);
  return defaultVendorResult.rows[0].id;

}

module.exports = {
  createBranch,
  createEntity,
  createDefaultRoles,
  createRole,
  createUser,
  addPermissions,
  checkSubdomain,
  generateSubdomain,
  getBranch,
  getEntity,
  createDummyVendor,
};
