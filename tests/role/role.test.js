
const request = require('supertest');
const app = require('../../../app');
const { pool } = require('../../config/db');

const {
    getTestRole,
    DUPLICATE_ROLE
} = require('../utils/constants');


describe('ROLE API TESTING', () => {

    // =====================================================
    // ROLE_01 - Create valid role
    // =====================================================
    test('ROLE_01 - Create valid role', async () => {

        const response = await request(app)

            .post('/roles')

            .send(getTestRole());

        console.log(
            'ROLE_01 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // ROLE_02 - Create role missing fields
    // =====================================================
    test('ROLE_02 - Create role missing fields', async () => {

        const response = await request(app)

            .post('/roles')

            .send({});

        console.log(
            'ROLE_02 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_03 - Create duplicate role code
    // =====================================================
    test('ROLE_03 - Create duplicate role code', async () => {

        await request(app)

            .post('/roles')

            .send({

                name: 'Role One',

                code: 'DUP_ROLE',

                icon: 'user'

            });

        const response = await request(app)

            .post('/roles')

            .send({

                name: 'Role Two',

                code: 'DUP_ROLE',

                icon: 'user'

            });

        console.log(
            'ROLE_03 Response:',
            response.body
        );

        expect([400, 409])
            .toContain(response.statusCode);

    });


    // =====================================================
    // ROLE_04 - Get roles list
    // =====================================================
    test('ROLE_04 - Get roles list', async () => {

        const response = await request(app)

            .get('/roles');

        console.log(
            'ROLE_04 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(200);

    });


    // =====================================================
    // ROLE_05 - Get roles without token
    // =====================================================
    test('ROLE_05 - Get roles without token', async () => {

        const response = await request(app)

            .get('/roles');

        console.log(
            'ROLE_05 Response:',
            response.body
        );

        expect([200, 401])
            .toContain(response.statusCode);

    });


    // =====================================================
    // ROLE_06 - Create role invalid code
    // =====================================================
    test('ROLE_06 - Create role invalid code', async () => {

        const response = await request(app)

            .post('/roles')

            .send({

                name: 'Invalid Role',

                code: '@@@###',

                icon: 'user'

            });

        console.log(
            'ROLE_06 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_07 - Create role invalid icon
    // =====================================================
    test('ROLE_07 - Create role invalid icon', async () => {

        const response = await request(app)

            .post('/roles')

            .send({

                name: 'Role Icon',

                code:
                    `ROLE_${Date.now()}`,

                icon: '@@@###'

            });

        console.log(
            'ROLE_07 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

    });


    // // =====================================================
    // // ROLE_08 - Create duplicate role name
    // // =====================================================
    // test('ROLE_08 - Create duplicate role name', async () => {

    //     await request(app)

    //         .post('/roles')

    //         .send({

    //             name: 'Duplicate Role',

    //             code:
    //                 `ROLE1_${Date.now()}`,

    //             icon: 'user'

    //         });

    //     const response = await request(app)

    //         .post('/roles')

    //         .send({

    //             name: 'Duplicate Role',

    //             code:
    //                 `ROLE2_${Date.now()}`,

    //             icon: 'user'

    //         });

    //     console.log(
    //         'ROLE_08 Response:',
    //         response.body
    //     );

    //     expect([400, 409])
    //         .toContain(response.statusCode);

    // });


    // =====================================================
    // ROLE_09 - Create role empty body
    // =====================================================
    test('ROLE_09 - Create role empty body', async () => {

        const response = await request(app)

            .post('/roles')

            .send({});

        console.log(
            'ROLE_09 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_10 - Create role null values
    // =====================================================
    test('ROLE_10 - Create role null values', async () => {

        const response = await request(app)

            .post('/roles')

            .send({

                name: null,

                code: null,

                icon: null

            });

        console.log(
            'ROLE_10 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_11 - Verify response structure
    // =====================================================
    test('ROLE_11 - Verify response structure', async () => {

        const response = await request(app)

            .post('/roles')

            .send(getTestRole());

        console.log(
            'ROLE_11 Response:',
            response.body
        );

        expect(response.body)
            .toHaveProperty('success');

        expect(response.body)
            .toHaveProperty('message');

        expect(response.body)
            .toHaveProperty('data');

    });


    // =====================================================
    // ROLE_12 - Verify 201 status code
    // =====================================================
    test('ROLE_12 - Verify 201 status code', async () => {

        const response = await request(app)

            .post('/roles')

            .send(getTestRole());

        console.log(
            'ROLE_12 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(201);

    });


    // =====================================================
    // ROLE_13 - Verify unsupported PUT method
    // =====================================================
    test('ROLE_13 - Verify unsupported PUT method', async () => {

        const response = await request(app)

            .put('/roles')

            .send({});

        console.log(
            'ROLE_13 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(404);

    });


    // =====================================================
    // ROLE_14 - Verify DB failure handling
    // =====================================================
    test('ROLE_14 - Verify DB failure handling', async () => {

        const originalQuery =
            pool.query;

        pool.query = jest.fn()

            .mockRejectedValue(
                new Error('DB Failed')
            );

        const response = await request(app)

            .post('/roles')

            .send(getTestRole());

        console.log(
            'ROLE_14 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(500);

        pool.query =
            originalQuery;

    });


    // =====================================================
    // ROLE_15 - Verify response time
    // =====================================================
    test('ROLE_15 - Verify response time', async () => {

        const start =
            Date.now();

        const response = await request(app)

            .get('/roles');

        const end =
            Date.now();

        const responseTime =
            end - start;

        console.log(
            'ROLE_15 Response Time:',
            responseTime,
            'ms'
        );

        expect(response.statusCode)
            .toBe(200);

        expect(responseTime)
            .toBeLessThan(2000);

    });

});

