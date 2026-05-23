// =============================================================
// CONFIG: queries.js
// Centralized SQL query strings, organized by domain.
// Import the relevant query group in each service file.
// =============================================================

const AUTH_QUERIES = {
  // Fetch a single user record by email address
  GET_USER_BY_EMAIL: `
    SELECT * FROM users WHERE email = $1
  `,

  // Fetch all institute-role mappings for a given user.
  // Returns full institute details (city, state, logo) and
  // all associated roles (icon, code, description) grouped per institute.
  GET_MY_INSTITUTES_ROLES: `
    SELECT
      uir.tenant_id,
      uir.institute_id,
      i.name        AS institute_name,
      i.type        AS institute_type,
      i.logo        AS institute_logo,
      i.city        AS institute_city,
      i.state       AS institute_state,
      json_agg(
        json_build_object(
          'role_id',          r.id,
          'role_name',        r.name,
          'role_code',        r.code,
          'role_icon',        r.icon,
          'role_icon_color',  r.icon_color,
          'role_description', r.description
        )
      ) AS roles
    FROM user_institute_roles uir
    JOIN institutes i ON i.id = uir.institute_id
    JOIN roles     r ON r.id = uir.role_id
    WHERE uir.user_id = $1
    GROUP BY
      uir.tenant_id,
      uir.institute_id,
      i.name, i.type, i.logo, i.city, i.state
  `,

  // Validate that a specific user-tenant-institute-role combination exists
  // before issuing an access token during context selection
  CHECK_CONTEXT_MAPPING: `
    SELECT * FROM user_institute_roles
    WHERE user_id = $1 AND tenant_id = $2 AND institute_id = $3 AND role_id = $4
  `,
};

const USER_QUERIES = {
  // Create a new user and return their id, full_name, and email
  CREATE_USER: `
    INSERT INTO users
      (first_name, last_name, full_name, email, mobile, password_hash)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, email
    
  `,

  // Fetch all users
  GET_ALL_USERS: `SELECT * FROM users`,
};

const INSTITUTE_QUERIES = {
  // Create a new institute record and return all columns
  CREATE_INSTITUTE: `
    INSERT INTO institutes (tenant_id, name, code, type, logo, city, state)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,

  // Fetch all institutes
  GET_ALL_INSTITUTES: `SELECT * FROM institutes`,
};

const ROLE_QUERIES = {
  // Create a new role and return all columns
  CREATE_ROLE: `
    INSERT INTO roles (name, code, icon, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,

  // Fetch all roles
  GET_ALL_ROLES: `SELECT * FROM roles`,
};

const MAPPING_QUERIES = {
  // Check if a user-institute-role mapping already exists (prevent duplicates)
  CHECK_DUPLICATE_MAPPING: `
    SELECT * FROM user_institute_roles
    WHERE user_id = $1 AND institute_id = $2 AND role_id = $3
  `,

  // Create a new user-institute-role mapping and return all columns
  CREATE_MAPPING: `
    INSERT INTO user_institute_roles
      (tenant_id, user_id, institute_id, role_id, is_primary)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,

  // Fetch all mappings with joined user, institute, and role names
  GET_ALL_MAPPINGS: `
    SELECT
      uir.*,
      u.full_name,
      i.name AS institute_name,
      r.name AS role_name
    FROM user_institute_roles uir
    JOIN users      u ON u.id = uir.user_id
    JOIN institutes i ON i.id = uir.institute_id
    JOIN roles      r ON r.id = uir.role_id
  `,
};

module.exports = {
  AUTH_QUERIES,
  USER_QUERIES,
  INSTITUTE_QUERIES,
  ROLE_QUERIES,
  MAPPING_QUERIES,
};
