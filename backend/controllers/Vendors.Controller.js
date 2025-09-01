const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL vendors */
const GetVendors = asyncHanlder(async (req, res) => {
  try {
    const vendorsQuery = `SELECT * FROM vendors`;
    const getAllVendors = await db.query(vendorsQuery);

    // console.log(getAllVendors?.rows);
    res.status(200).json({
      vendors: getAllVendors?.rows,
      message: "Vendors Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

// Create New Vendor Details

const NewVendor = asyncHanlder(async (req, res) => {
  try {
    const VendorData = req.body;

    const { name, role_id } = VendorData;

    const roleId = parseInt(role_id);

    console.log(roleId);

    /* Check if role_id exists in table */

    const existVendorQuery = `SELECT * FROM vendors WHERE role_id = $1 and name = $2`;

    const findVendor = await db.query(existVendorQuery, [roleId, name]);

    console.log(findVendor?.rows[0], "Vendor found");
    if (findVendor?.rowCount > 0) {
      // Update Details for Vendor

      const editVendorQuery = `Update vendors SET last_login = $1 WHERE name =$2 AND role_id =$3 Returning *`;
      const updateNewVendor = await db.query(editVendorQuery, [
        new Date(),
        name,
        roleId,
      ]);

      console.log(updateNewVendor?.rows[0], "Update Vendor");

      res
        .status(200)
        .json({ message: "Update Vendor", result: updateNewVendor?.rows[0] });
    } else {
      const addVendorQuery = `INSERT INTO vendors (name, role_id,last_login) values ($1,$2,$3) Returning *`;
      const saveNewVendor = await db.query(addVendorQuery, [
        name,
        role_id,
        new Date(),
      ]);

      console.log(saveNewVendor?.rows[0]);

      res
        .status(200)
        .json({ message: "New Vendor", result: saveNewVendor?.rows[0] });
    }
  } catch (error) {
    console.log(error);
  }
});

/* Delete Vendor  */

const DeleteVendor = asyncHanlder(async (req, res) => {
  try {
    const VendorData = req.body;
    const { role_id } = req.params;
    const { name } = VendorData;

    const roleId = parseInt(role_id);

    console.log(roleId);

    /* Check if role_id exists in table */

    const existVendorQuery = `SELECT * FROM vendors WHERE role_id = $1 and name = $2`;

    const findVendor = await db.query(existVendorQuery, [roleId, name]);

    console.log(findVendor?.rows[0], "Vendor found");
    if (findVendor?.rowCount > 0) {
      // Update Details for Vendor

      res.status(200).json({ message: "Deleted  Vendor" });
    }
  } catch (error) {
    console.log(error);
  }
});

/* Fetch vendors By ID */

/* Fetch All vendors by Book ID */

module.exports = { GetVendors, NewVendor, DeleteVendor };
