
const request = require('supertest');
const app = require('../../app');
const { pool } = require('../../src/config/db');


const {
    getAccessToken
} = require('../helpers/token.helper');

const {
    getTestInstitute,
    getDuplicateInstitute
} = require('../utils/constants');


describe('INSTITUTE API TESTING', () => {

    let testTenantId;

    beforeAll(async () => {
        const tenantResult = await pool.query('SELECT id FROM tenants LIMIT 1');
        if (tenantResult.rows.length > 0) {
            testTenantId = tenantResult.rows[0].id;
        }
    });

    // =====================================================
    // INST_01 - Create valid institute
    // Expected Status Code: 201
    // =====================================================
    test('INST_01 - Create valid institute', async () => {

        const token =
            await getAccessToken();

        const response = await request(app)

            .post('/institutes')

            .set(
                'Authorization',
                `Bearer ${token}`
            )

            .send(
                getTestInstitute(testTenantId)
            );

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // INST_02 - Create institute missing fields
    // Expected Status Code: 400
    // =====================================================
    test('INST_02 - Create institute missing fields', async () => {

        const token =
            await getAccessToken();

        const response = await request(app)

            .post('/institutes')

            .set(
                'Authorization',
                `Bearer ${token}`
            )

            .send({

                name: 'Test Institute'

            });

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // INST_03 - Create duplicate institute code
    // Expected Status Code: 409
    // =====================================================
    test('INST_03 - Create duplicate institute code', async () => {

        const token =
            await getAccessToken();

        const code = `INST_DUP_${Date.now()}`;

        // Create first institute
        await request(app)
            .post('/institutes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tenant_id: testTenantId,
                name: 'Duplicate Institute One',
                code,
                type: 'School'
            });

        // Try to create second institute with same code
        const response = await request(app)
            .post('/institutes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tenant_id: testTenantId,
                name: 'Duplicate Institute Two',
                code,
                type: 'School'
            });

        expect(response.statusCode)
            .toBe(409);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // INST_04 - Get institutes list
    // Expected Status Code: 200
    // =====================================================
    test('INST_04 - Get institutes list', async () => {

        const token =
            await getAccessToken();

        const response = await request(app)

            .get('/institutes')

            .set(
                'Authorization',
                `Bearer ${token}`
            );

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // INST_05 - Get institutes without token
    // Expected Status Code: 401
    // =====================================================
    test('INST_05 - Get institutes without token', async () => {

        const response = await request(app)

            .get('/institutes');

        expect(response.statusCode)
            .toBe(401);
    });

// =====================================================
// INST_06 - Create institute invalid tenant_id
// Expected Status Code: 400
// =====================================================
test('INST_06 - Create institute invalid tenant_id', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({

            tenant_id: 'invalid-id',

            name:
                `Institute ${Date.now()}`,

            code:
                `INST_${Date.now()}`,

            type: 'School'

        });

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_07 - Create institute invalid type
// Expected Status Code: 400
// =====================================================
test('INST_07 - Create institute invalid type', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({

            tenant_id:
                testTenantId,

            name:
                `Institute ${Date.now()}`,

            code:
                `INST_${Date.now()}`,

            type: '@@@###'

        });

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_08 - Create institute long name
// Expected Status Code: 400
// =====================================================
test('INST_08 - Create institute long name', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({

            tenant_id:
                testTenantId,

            name:
                'A'.repeat(500),

            code:
                `INST_${Date.now()}`,

            type: 'School'

        });

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_09 - Create institute special characters
// Expected Status Code: 400
// =====================================================
test('INST_09 - Create institute special characters', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({

            tenant_id:
                testTenantId,

            name: '@@@###',

            code:
                `INST_${Date.now()}`,

            type: 'School'

        });

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_11 - Create institute empty body
// Expected Status Code: 400
// =====================================================
test('INST_11 - Create institute empty body', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({});

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_12 - Create institute null values
// Expected Status Code: 400
// =====================================================
test('INST_12 - Create institute null values', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send({

            tenant_id: null,

            name: null,

            code: null

        });

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_13 - Verify response structure
// Expected Status Code: 201
// =====================================================
test('INST_13 - Verify response structure', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send(getTestInstitute(testTenantId));

    expect(response.statusCode)
        .toBe(201);

    expect(response.body.success)
        .toBe(true);

    expect(response.body)
        .toHaveProperty('message');

    expect(response.body)
        .toHaveProperty('data');

});


// =====================================================
// INST_14 - Verify 201 status code
// Expected Status Code: 201
// =====================================================
test('INST_14 - Verify 201 status code', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .post('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        )

        .send(getTestInstitute(testTenantId));

    expect(response.statusCode)
        .toBe(201);

});


// =====================================================
// INST_15 - Verify unsupported PUT method
// Expected Status Code: 404
// =====================================================
test('INST_15 - Verify unsupported PUT method', async () => {

    const response = await request(app)

        .put('/institutes')

        .send({});

    expect(response.statusCode)
        .toBe(404);

});


// =====================================================
// INST_16 - Verify DB failure handling
// Expected Status Code: 500
// =====================================================
test('INST_16 - Verify DB failure handling', async () => {

    const token =
        await getAccessToken();

    const originalQuery =
        pool.query;

    // MOCK DB FAILURE
    pool.query = jest.fn()
        .mockRejectedValue(
            new Error('DB Failed')
        );

    let response;
    try {
        response = await request(app)

            .post('/institutes')

            .set(
                'Authorization',
                `Bearer ${token}`
            )

            .send(getTestInstitute(testTenantId));
    } finally {
        // RESTORE
        pool.query = originalQuery;
    }

    expect(response.statusCode)
        .toBe(500);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// INST_17 - Verify response time
// Expected Status Code: 200
// =====================================================
test('INST_17 - Verify response time', async () => {

    const token =
        await getAccessToken();

    const startTime =
        Date.now();

    const response = await request(app)

        .get('/institutes')

        .set(
            'Authorization',
            `Bearer ${token}`
        );

    const endTime =
        Date.now();

    const responseTime =
        endTime - startTime;

    expect(response.statusCode)
        .toBe(200);

    expect(responseTime)
        .toBeLessThan(2000);

});

});

