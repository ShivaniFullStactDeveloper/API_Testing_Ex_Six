const request = require('supertest');
const app = require('../../../app');
const { pool } = require('../../config/db');

let counter = 0;

const nextSuffix = () => `${Date.now()}_${counter++}`;

const getBaseContext = async () => {

    const userResult = await pool.query(
        `
            SELECT id FROM users
            WHERE email = $1
            ORDER BY id
            LIMIT 1
        `,
        ['noah@scos.com']
    );

    const instituteResult = await pool.query(
        `
            SELECT id, tenant_id FROM institutes
            ORDER BY id
            LIMIT 1
        `
    );

    if (
        userResult.rows.length === 0 ||
        instituteResult.rows.length === 0
    ) {
        throw new Error(
            'Mapping tests require at least one user and one institute.'
        );
    }

    return {
        tenant_id:
            instituteResult.rows[0].tenant_id,

        user_id:
            userResult.rows[0].id,

        institute_id:
            instituteResult.rows[0].id
    };

};

const createRole = async () => {

    const suffix =
        nextSuffix();

    const roleResult = await pool.query(
        `
            INSERT INTO roles
                (name, code, icon, description)
            VALUES
                ($1, $2, $3, $4)
            RETURNING id
        `,
        [
            `Mapping Test Role ${suffix}`,
            `MAP_ROLE_${suffix}`,
            'user',
            'Role created by mapping tests'
        ]
    );

    return roleResult.rows[0].id;

};

const getValidPayload = async () => {

    const context =
        await getBaseContext();

    const role_id =
        await createRole();

    return {
        ...context,
        role_id,
        is_primary: true
    };

};

describe('MAPPING API TESTING', () => {

    // =====================================================
    // MAP_01 - Create valid mapping
    // =====================================================
    test('MAP_01 - Create valid mapping', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .send(await getValidPayload());

        console.log(
            'MAP_01 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // MAP_02 - Create duplicate mapping
    // =====================================================
    test('MAP_02 - Create duplicate mapping', async () => {

        const payload =
            await getValidPayload();

        await request(app)
            .post('/user-institute-roles')
            .send(payload);

        const response = await request(app)
            .post('/user-institute-roles')
            .send(payload);

        console.log(
            'MAP_02 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(409);

    });


    // =====================================================
    // MAP_03 - Create mapping missing fields
    // =====================================================
    test('MAP_03 - Create mapping missing fields', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                tenant_id:
                    '4ba86db5-68b3-4f20-9f86-81f2d805126f'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_04 - Create mapping invalid user_id
    // =====================================================
    test('MAP_04 - Create mapping invalid user_id', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                user_id:
                    'invalid-user-id'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_05 - Create mapping invalid institute_id
    // =====================================================
    test('MAP_05 - Create mapping invalid institute_id', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                institute_id:
                    'invalid-id'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_06 - Create mapping invalid role_id
    // =====================================================
    test('MAP_06 - Create mapping invalid role_id', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                role_id:
                    'invalid-role-id'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_07 - Create mapping invalid tenant_id
    // =====================================================
    test('MAP_07 - Create mapping invalid tenant_id', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                tenant_id:
                    'invalid-tenant-id'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_08 - Create mapping with null values
    // =====================================================
    test('MAP_08 - Create mapping with null values', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                tenant_id: null,
                user_id: null,
                institute_id: null,
                role_id: null
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_09 - Create mapping empty body
    // =====================================================
    test('MAP_09 - Create mapping empty body', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .send({});

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_10 - Create mapping invalid is_primary type
    // =====================================================
    test('MAP_10 - Create mapping invalid is_primary type', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                is_primary:
                    'yes'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // MAP_11 - Get mappings list
    // =====================================================
    test('MAP_11 - Get mappings list', async () => {

        const response = await request(app)
            .get('/user-institute-roles');

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(Array.isArray(response.body.data))
            .toBe(true);

    });


    // =====================================================
    // MAP_12 - Verify mapping response structure
    // =====================================================
    test('MAP_12 - Verify mapping response structure', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .send(await getValidPayload());

        expect(response.statusCode)
            .toBe(201);

        expect(response.body)
            .toHaveProperty('success');

        expect(response.body)
            .toHaveProperty('message');

        expect(response.body)
            .toHaveProperty('data');

        expect(response.body.data)
            .toHaveProperty('id');

    });


    // =====================================================
    // MAP_13 - Verify GET mappings response structure
    // =====================================================
    test('MAP_13 - Verify GET mappings response structure', async () => {

        const response = await request(app)
            .get('/user-institute-roles');

        expect(response.statusCode)
            .toBe(200);

        expect(response.body)
            .toHaveProperty('success');

        expect(response.body)
            .toHaveProperty('data');

        expect(Array.isArray(response.body.data))
            .toBe(true);

    });


    // =====================================================
    // MAP_14 - Verify unsupported PUT method
    // =====================================================
    test('MAP_14 - Verify unsupported PUT method', async () => {

        const response = await request(app)
            .put('/user-institute-roles')
            .send(await getValidPayload());

        expect(response.statusCode)
            .toBe(404);

    });


    // =====================================================
    // MAP_15 - Verify DB failure handling
    // =====================================================
    test('MAP_15 - Verify DB failure handling', async () => {

        const payload =
            await getValidPayload();

        const originalQuery =
            pool.query;

        const consoleErrorSpy =
            jest.spyOn(console, 'error')
                .mockImplementation(() => {});

        let response;

        try {
            pool.query = jest.fn()
                .mockRejectedValue(new Error('Forced DB failure'));

            response = await request(app)
                .post('/user-institute-roles')
                .send(payload);
        } finally {
            pool.query =
                originalQuery;

            consoleErrorSpy.mockRestore();
        }

        expect(response.statusCode)
            .toBe(500);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // MAP_16 - Verify response time
    // =====================================================
    test('MAP_16 - Verify response time', async () => {

        const startedAt =
            Date.now();

        const response = await request(app)
            .get('/user-institute-roles');

        const durationMs =
            Date.now() - startedAt;

        expect(response.statusCode)
            .toBe(200);

        expect(durationMs)
            .toBeLessThan(2000);

    });


    // =====================================================
    // MAP_17 - Create mapping foreign key violation
    // =====================================================
    test('MAP_17 - Create mapping foreign key violation', async () => {

        const payload =
            await getValidPayload();

        const response = await request(app)
            .post('/user-institute-roles')
            .send({
                ...payload,
                user_id:
                    '11111111-1111-4111-8111-111111111111'
            });

        expect([400, 500])
            .toContain(response.statusCode);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // MAP_18 - Verify GET mappings joined data
    // =====================================================
    test('MAP_18 - Verify GET mappings joined data', async () => {

        await request(app)
            .post('/user-institute-roles')
            .send(await getValidPayload());

        const response = await request(app)
            .get('/user-institute-roles');

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.data.length)
            .toBeGreaterThan(0);

        expect(response.body.data[0])
            .toHaveProperty('full_name');

        expect(response.body.data[0])
            .toHaveProperty('institute_name');

        expect(response.body.data[0])
            .toHaveProperty('role_name');

    });


    // =====================================================
    // MAP_19 - Get mappings without token
    // =====================================================
    test('MAP_19 - Get mappings without token', async () => {

        const response = await request(app)
            .get('/user-institute-roles');

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // MAP_20 - Verify malformed JSON body
    // =====================================================
    test('MAP_20 - Verify malformed JSON body', async () => {

        const response = await request(app)
            .post('/user-institute-roles')
            .set(
                'Content-Type',
                'application/json'
            )
            .send('{"tenant_id":"bad-json",}');

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.success)
            .toBe(false);

    });

});
