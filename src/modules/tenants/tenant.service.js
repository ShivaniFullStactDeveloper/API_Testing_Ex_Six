// =============================================================
// SERVICE: tenant.service.js
// Handles tenant creation and retrieval business logic.
// =============================================================

const { pool } = require("../../config/db");
const { AppError, ERRORS } = require("../../config/errors");


// -------------------------------------------------------------
// CREATE TENANT
// Inserts a new tenant record and returns the full row.
// -------------------------------------------------------------
exports.createTenant = async (data) => {
  const { name, code } = data;

  try {
    const result = await pool.query(
      `INSERT INTO tenants (name, code)
       VALUES ($1, $2)
       RETURNING *`,
      [name, code]
    );

    return result.rows[0];
  } catch (err) {
    throw new AppError(ERRORS.INTERNAL_SERVER_ERROR);
  }
};


// -------------------------------------------------------------
// GET ALL TENANTS
// Fetches and returns all tenant records.
// -------------------------------------------------------------
exports.getTenants = async () => {
  const result = await pool.query(`SELECT * FROM tenants`);
  return result.rows;
};
