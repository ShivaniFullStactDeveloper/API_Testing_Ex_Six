
// =============================================================
// SERVICE: institute.service.js
// Handles institute creation and retrieval business logic.
// =============================================================

const { pool } = require("../../config/db");
const { AppError } = require("../../config/errors");
const { INSTITUTE_QUERIES } = require("../../config/queries");


// -------------------------------------------------------------
// CREATE INSTITUTE
// Inserts a new institute under a given tenant
// and returns the full record.
// -------------------------------------------------------------
exports.createInstitute = async (data) => {

  const {
    tenant_id,
    name,
    code,
    type,
    logo
  } = data;


  // =====================================================
  // REQUIRED FIELD VALIDATION
  // =====================================================
  if (
    !tenant_id ||
    !name ||
    !code
  ) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_003',
      message:
        'tenant_id, name and code are required.'
    });

  }


  // =====================================================
  // TENANT UUID VALIDATION
  // =====================================================
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(tenant_id)) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_008',
      message:
        'Invalid tenant_id'
    });

  }


  // =====================================================
  // NAME LENGTH VALIDATION
  // =====================================================
  if (name.length > 100) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_004',
      message:
        'Institute name is too long.'
    });

  }


  // =====================================================
  // INSTITUTE NAME VALIDATION
  // =====================================================
  const instituteNameRegex =
    /^[A-Za-z\s]+$/;

  if (!instituteNameRegex.test(name)) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_009',
      message:
        'Institute name contains invalid characters.'
    });

  }


  // =====================================================
  // INSTITUTE CODE VALIDATION
  // =====================================================
  const codeRegex = /^[A-Z0-9_]+$/;

  if (!codeRegex.test(code)) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_005',
      message:
        'Institute code format is invalid.'
    });

  }


  // =====================================================
  // TYPE VALIDATION
  // =====================================================
  const allowedTypes = [
    'School',
    'College',
    'University',
    'Training'
  ];

  if (
    type &&
    !allowedTypes.includes(type)
  ) {

    throw new AppError({
      statusCode: 400,
      code: 'INST_010',
      message:
        'Invalid institute type.'
    });

  }


  try {

    const result = await pool.query(

      INSTITUTE_QUERIES.CREATE_INSTITUTE,

      [
        tenant_id,
        name,
        code,
        type,
        logo,
        data.city ?? null,
        data.state ?? null,
      ]

    );

    return result.rows[0];

  } catch (err) {

    console.error(
      "DB ERROR:",
      err.message
    );


    // =================================================
    // DUPLICATE ERRORS
    // =================================================
    if (err.code === '23505') {

      // DUPLICATE CODE
      if (
        err.constraint ===
        'institutes_code_key'
      ) {

        throw new AppError({
          statusCode: 409,
          code: 'INST_006',
          message:
            'Institute code already exists.'
        });

      }

      // DUPLICATE NAME
      if (
        err.constraint ===
        'institutes_name_key'
      ) {

        throw new AppError({
          statusCode: 409,
          code: 'INST_011',
          message:
            'Institute name already exists.'
        });

      }

    }


    // =================================================
    // INTERNAL SERVER ERROR
    // =================================================
    throw new AppError({
      statusCode: 500,
      code: 'INST_007',
      message:
        'Failed to create institute.'
    });

  }

};


// -------------------------------------------------------------
// GET ALL INSTITUTES
// Fetches and returns all institute records.
// -------------------------------------------------------------
exports.getInstitutes = async () => {

  const result = await pool.query(
    INSTITUTE_QUERIES.GET_ALL_INSTITUTES
  );

  return result.rows;

};

