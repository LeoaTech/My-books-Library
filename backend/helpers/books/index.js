const getOrCreateId = async (client, tableName, value, entityId) => {
  try {
    if (!value) {
      return null;
    }
    const query = `
    WITH ins AS (
      INSERT INTO ${tableName} (name, entity_id)
      VALUES ($1,$2)
      ON CONFLICT (name, entity_id) DO NOTHING
      RETURNING id
    )
    SELECT id FROM ins
    UNION ALL
    SELECT id FROM ${tableName} WHERE name = $1 AND entity_id =$2 AND NOT EXISTS (SELECT 1 FROM ins)
  `;

    const result = await client.query(query, [value, entityId]);
    return result.rows[0].id;
  } catch (error) {
    console.log(error, "Error to Insert in DB or Get existing ID");
    return null;
  }
};

async function getMainBranchId(client, entityId) {
  try {
    const checkBranch = await client.query(
      "SELECT id,name FROM branches WHERE entity_id = $1",
      [entityId]
    );

    // Get the main branch of an entity Id
    const filteredMainBranch = checkBranch.rows.filter((branch) =>
      branch.name.includes("(main)")
    );
    return filteredMainBranch[0]?.id;
  } catch (error) {
    console.log(error);
    return null;
  }
}
module.exports = {getOrCreateId,getMainBranchId};
