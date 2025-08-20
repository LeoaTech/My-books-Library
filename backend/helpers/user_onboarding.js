const db = require("../config/dbConfig.js");

// Generate subdomain from organization name
function generateSubdomain(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 50);
}

// Check subdomain and get a unique subdomain

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
    INSERT INTO entity (name, city,country, address, phone, type_of_books, deliver_inter_city,multiple_branches,description,subdomain) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) RETURNING id`;
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

async function createRole(client, entityId, role_type) {
  const query = `
    INSERT INTO roles (entity_id, name)
    VALUES ($1, $2)
    RETURNING role_id;
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
    // roleId,
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

module.exports = {
  createBranch,
  createEntity,
  createRole,
  createUser,
  addPermissions,
  checkSubdomain,
  generateSubdomain,
};
