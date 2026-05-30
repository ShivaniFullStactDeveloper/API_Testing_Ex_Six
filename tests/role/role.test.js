const request = require('supertest');
const app = require('../../app');
const { pool } = require('../../src/config/db');

const {
    getAccessToken
} = require('../helpers/token.helper');

const {
    getTestRole
} = require('../utils/constants');


describe('ROLE API TESTING', () => {

    // =====================================================
    // ROLE_01 - Create valid role
    // =====================================================
    test('ROLE_01 - Create valid role', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send(getTestRole());

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // ROLE_02 - Create role missing fields
    // =====================================================
    test('ROLE_02 - Create role missing fields', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_03 - Create duplicate role code
    // =====================================================
    test('ROLE_03 - Create duplicate role code', async () => {

        const token = await getAccessToken();

        await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Role One',
                code: 'DUP_ROLE',
                icon: 'user'
            });

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Role Two',
                code: 'DUP_ROLE',
                icon: 'user'
            });

        expect(response.statusCode)
            .toBe(409);

    });


    // =====================================================
    // ROLE_04 - Get roles list
    // =====================================================
    test('ROLE_04 - Get roles list', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .get('/roles')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode)
            .toBe(200);

    });


    // =====================================================
    // ROLE_05 - Get roles without token
    // =====================================================
    test('ROLE_05 - Get roles without token', async () => {

        const response = await request(app)
            .get('/roles');

        expect(response.statusCode)
            .toBe(401);

    });


    // =====================================================
    // ROLE_06 - Create role invalid code
    // =====================================================
    test('ROLE_06 - Create role invalid code', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Invalid Role',
                code: '@@@###',
                icon: 'user'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_07 - Create role invalid icon
    // =====================================================
    test('ROLE_07 - Create role invalid icon', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Role Icon',
                code: `ROLE_${Date.now()}`,
                icon: '@@@###'
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_09 - Create role empty body
    // =====================================================
    test('ROLE_09 - Create role empty body', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_10 - Create role null values
    // =====================================================
    test('ROLE_10 - Create role null values', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: null,
                code: null,
                icon: null
            });

        expect(response.statusCode)
            .toBe(400);

    });


    // =====================================================
    // ROLE_11 - Verify response structure
    // =====================================================
    test('ROLE_11 - Verify response structure', async () => {

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send(getTestRole());

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

        const token = await getAccessToken();

        const response = await request(app)
            .post('/roles')
            .set('Authorization', `Bearer ${token}`)
            .send(getTestRole());

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

        expect(response.statusCode)
            .toBe(404);

    });


    // =====================================================
    // ROLE_14 - Verify DB failure handling
    // =====================================================
    test('ROLE_14 - Verify DB failure handling', async () => {

        const token = await getAccessToken();
        const originalQuery = pool.query;

        pool.query = jest.fn()
            .mockRejectedValue(
                new Error('DB Failed')
            );

        let response;
        try {
            response = await request(app)
                .post('/roles')
                .set('Authorization', `Bearer ${token}`)
                .send(getTestRole());
        } finally {
            pool.query = originalQuery;
        }

        expect(response.statusCode)
            .toBe(500);

    });


    // =====================================================
    // ROLE_15 - Verify response time
    // =====================================================
    test('ROLE_15 - Verify response time', async () => {

        const token = await getAccessToken();

        const start = Date.now();

        const response = await request(app)
            .get('/roles')
            .set('Authorization', `Bearer ${token}`);

        const end = Date.now();

        const responseTime = end - start;

        expect(response.statusCode)
            .toBe(200);

        expect(responseTime)
            .toBeLessThan(2000);

    });

});
