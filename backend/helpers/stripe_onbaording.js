async function getEntityInfo(db, entityId) {
  // console.log(entityId, "Inside getEntityInfo")
  try {
    const res = await db.query(
      `SELECT 
        uer.user_id, uer.entity_id,uer.role_id,
        r.name AS role_name,
        u.user_details,u.name,u.email
      FROM user_entity_roles uer
      JOIN roles r ON uer.role_id = r.role_id
      JOIN users u ON uer.user_id = u.id
      WHERE uer.entity_id =$1 and r.name =$2`,
      [entityId, "owner"]
    );

    // console.log(res.rows, "Library Stripe Info");

    return res?.rows[0];
  } catch (error) {
    console.log(error, "error");
    return null;
  }
}

// Update library's (entityId) Stripe info
async function updateEntityStripeInfo(db, userId, stripeAccountId, info) {
  // console.log(info, "stripe account info");

  const paymentMethod = {
    stripe: {
      stripe_account_id: stripeAccountId,
      stripe_info: info,
      onboarding_complete: info?.charges_enabled || false,
    },
  };
  const query = `
    UPDATE users
    SET user_details =$1 
    WHERE id = $2
  `;
  await db.query(query, [JSON.stringify(paymentMethod), userId]);
}

module.exports = {
  getEntityInfo,
  updateEntityStripeInfo,
};
