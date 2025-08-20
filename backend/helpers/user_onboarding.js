

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
 
};
