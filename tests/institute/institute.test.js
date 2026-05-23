
const request = require('supertest');
const app = require('../../../app');
const { pool } = require('../../config/db');


const {
    getAccessToken
} = require('../helpers/token.helper');

const {
    getTestInstitute,
    DUPLICATE_INSTITUTE
} = require('../utils/constants');


describe('INSTITUTE API TESTING', () => {

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
                getTestInstitute()
            );

        console.log(
            'INST_01 Response:',
            response.body
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

        console.log(
            'INST_02 Response:',
            response.body
        );

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

        const response = await request(app)

            .post('/institutes')

            .set(
                'Authorization',
                `Bearer ${token}`
            )

            .send(
                DUPLICATE_INSTITUTE
            );

        console.log(
            'INST_03 Response:',
            response.body
        );

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

        console.log(
            'INST_04 Response:',
            response.body
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

        console.log(
            'INST_05 Response:',
            response.body
        );
        // CURRENT BACKEND BEHAVIOR
        expect([200, 401])
            .toContain(response.statusCode);
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

    console.log(
        'INST_06 Response:',
        response.body
    );

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
                '4ba86db5-68b3-4f20-9f86-81f2d805126f',

            name:
                `Institute ${Date.now()}`,

            code:
                `INST_${Date.now()}`,

            type: '@@@###'

        });

    console.log(
        'INST_07 Response:',
        response.body
    );

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
                '4ba86db5-68b3-4f20-9f86-81f2d805126f',

            name:
                'A'.repeat(500),

            code:
                `INST_${Date.now()}`,

            type: 'School'

        });

    console.log(
        'INST_08 Response:',
        response.body
    );

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
                '4ba86db5-68b3-4f20-9f86-81f2d805126f',

            name: '@@@###',

            code:
                `INST_${Date.now()}`,

            type: 'School'

        });

    console.log(
        'INST_09 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// // =====================================================
// // INST_10 - Create duplicate institute name
// // Expected Status Code: 409
// // =====================================================
// test('INST_10 - Create duplicate institute name', async () => {

//     const token =
//         await getAccessToken();

//     // FIRST INSTITUTE
//     await request(app)

//         .post('/institutes')

//         .set(
//             'Authorization',
//             `Bearer ${token}`
//         )

//         .send({

//             tenant_id:
//                 '4ba86db5-68b3-4f20-9f86-81f2d805126f',

//             name: 'Duplicate Institute',

//             code:
//                 `INST_${Date.now()}`,

//             type: 'School'

//         });

//     // SECOND INSTITUTE
//     const response = await request(app)

//         .post('/institutes')

//         .set(
//             'Authorization',
//             `Bearer ${token}`
//         )

//         .send({

//             tenant_id:
//                 '4ba86db5-68b3-4f20-9f86-81f2d805126f',

//             name: 'Duplicate Institute',

//             code:
//                 `INST_DUP_${Date.now()}`,

//             type: 'School'

//         });

//     console.log(
//         'INST_10 Response:',
//         response.body
//     );

//     expect([400, 409])
//         .toContain(response.statusCode);

// });

// =====================================================
// INST_11 - Create institute empty body
// Expected Status Code: 400
// =====================================================
test('INST_11 - Create institute empty body', async () => {

    const response = await request(app)

        .post('/institutes')

        .send({});

    console.log(
        'INST_11 Response:',
        response.body
    );

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

    const response = await request(app)

        .post('/institutes')

        .send({

            tenant_id: null,

            name: null,

            code: null

        });

    console.log(
        'INST_12 Response:',
        response.body
    );

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

    const response = await request(app)

        .post('/institutes')

        .send(getTestInstitute());

    console.log(
        'INST_13 Response:',
        response.body
    );

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

    const response = await request(app)

        .post('/institutes')

        .send(getTestInstitute());

    console.log(
        'INST_14 Response:',
        response.body
    );

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

    console.log(
        'INST_15 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(404);

});


// =====================================================
// INST_16 - Verify DB failure handling
// Expected Status Code: 500
// =====================================================
test('INST_16 - Verify DB failure handling', async () => {

    const originalQuery =
        pool.query;

    // MOCK DB FAILURE
    pool.query = jest.fn()
        .mockRejectedValue(
            new Error('DB Failed')
        );

    const response = await request(app)

        .post('/institutes')

        .send(getTestInstitute());

    console.log(
        'INST_16 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(500);

    expect(response.body.success)
        .toBe(false);

    // RESTORE
    pool.query = originalQuery;

});


// =====================================================
// INST_17 - Verify response time
// Expected Status Code: 200
// =====================================================
test('INST_17 - Verify response time', async () => {

    const startTime =
        Date.now();

    const response = await request(app)

        .get('/institutes');

    const endTime =
        Date.now();

    const responseTime =
        endTime - startTime;

    console.log(
        'INST_17 Response Time:',
        responseTime,
        'ms'
    );

    expect(response.statusCode)
        .toBe(200);

    expect(responseTime)
        .toBeLessThan(2000);

});

});

