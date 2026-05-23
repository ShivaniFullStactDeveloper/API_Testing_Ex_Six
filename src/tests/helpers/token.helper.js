const request = require('supertest');
const app = require('../../../app');
const { pool } = require('../../config/db');

const {
    TEST_USERS
} = require('../utils/constants');

const AUTH_TEST_CONTEXT = {
    tenant_id:
        '4ba86db5-68b3-4f20-9f86-81f2d805126f',

    user_email:
        TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE.email,

    institute_id:
        '3bd4c00b-4ea9-440c-aea4-1e614ffdff65'
};

// =========================================================
// ENSURE AUTH TEST CONTEXT
// Keeps auth tests independent from mapping.test.js execution order.
// =========================================================
exports.ensureAuthTestContext = async () => {

    const userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [AUTH_TEST_CONTEXT.user_email]
    );

    const roleResult = await pool.query(
        'SELECT id FROM roles ORDER BY CASE WHEN name = $1 THEN 0 ELSE 1 END, id LIMIT 1',
        ['Admin']
    );

    if (
        userResult.rows.length === 0 ||
        roleResult.rows.length === 0
    ) {
        throw new Error(
            'Auth test fixtures require the Noah user and at least one role.'
        );
    }

    const context = {
        tenant_id:
            AUTH_TEST_CONTEXT.tenant_id,

        user_id:
            userResult.rows[0].id,

        institute_id:
            AUTH_TEST_CONTEXT.institute_id,

        role_id:
            roleResult.rows[0].id
    };

    const existingMapping = await pool.query(
        `
            SELECT id FROM user_institute_roles
            WHERE user_id = $1
              AND tenant_id = $2
              AND institute_id = $3
              AND role_id = $4
        `,
        [
            context.user_id,
            context.tenant_id,
            context.institute_id,
            context.role_id
        ]
    );

    if (existingMapping.rows.length === 0) {
        await pool.query(
            `
                INSERT INTO user_institute_roles
                    (tenant_id, user_id, institute_id, role_id, is_primary)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [
                context.tenant_id,
                context.user_id,
                context.institute_id,
                context.role_id,
                true
            ]
        );
    }

    return context;

};


// =========================================================
// GET PRE CONTEXT TOKEN
// =========================================================
exports.getPreContextToken = async () => {

    const response = await request(app)
        .post('/auth/login')
        .send(
            TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE
        );

    return response.body.pre_context_token;

};

// =========================================================
// GET ACCESS TOKEN
// =========================================================
exports.getAccessToken = async () => {

    const context =
        await exports.ensureAuthTestContext();

    // LOGIN
    const loginResponse = await request(app)

        .post('/auth/login')

        .send(
            TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE
        );

    const preContextToken =
        loginResponse.body.pre_context_token;

    // SELECT CONTEXT
    const contextResponse = await request(app)

        .post('/auth/select-context')

        .set(
            'Authorization',
            `Bearer ${preContextToken}`
        )

        .send({

            tenant_id:
                context.tenant_id,

            institute_id:
                context.institute_id,

            role_id:
                context.role_id

        });

    return contextResponse.body.access_token;

};
