// require("dotenv").config();

const db = require("../config/dbConfig");

const getRoles = async (entityId) => {
  try {
    const permissionsQuery = `SELECT role_id FROM roles where entity_id =$1 `;
    const getAllPermissions = await db.query(permissionsQuery, [entityId]);

    const roles = getAllPermissions?.rows;
    console.log(roles, "Roles");
    
    return roles.map((role) => role?.role_id); // Returning all role Ids
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const getRolePermissions = async (roleId) => {
  try {
    const permissionQuery = `SELECT
    rp.role_id,
    r.name AS role_name,
    json_agg(p.name) AS permissions
FROM
    public.role_permissions rp
JOIN
    public.permissions p ON rp.permission_id = p.permission_id
JOIN
    public.roles r ON rp.role_id = r.role_id
WHERE
    rp.role_id = $1
GROUP BY
    rp.role_id, r.name
`;

    const getAllPermissions = await db.query(permissionQuery, [roleId]);

    const role = getAllPermissions?.rows[0];
    return role ? role.permissions : []; //Returns all permissions for the role id
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return [];
  }
};

module.exports = {
  getRoles,
  getRolePermissions,
};
