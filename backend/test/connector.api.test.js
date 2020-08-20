const app = require('../server/app');
const request = require('supertest');
const session = require('supertest-session');
const assert = require('assert').strict;

let connectParam = {
    host: '192.168.0.68',
    port: 15432,
    database: 'covid19',
    graph: 'corona_spread',
    user: 'consulting',
    password: 'bitnine123!',
};

describe('Test Connector Api', () => {

    let mappingUrl = '/api/v1/db';

    it('Execute Connect', (done) => {
        request(app)
            .post(`${mappingUrl}/connect`)
            .send(connectParam)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                assert.deepStrictEqual(res.body, connectParam);
                return done();
            });
    });

    it('Execute Wrong Connect', (done) => {
        let wrongParam = {
            host: '192.168.0.1',
            port: 15432,
            database: 'covid19',
            graph: 'corona_spread',
            user: 'consulting',
            password: 'bitnine123!',
        };
        request(app)
            .post(`${mappingUrl}/connect`)
            .send(wrongParam)
            .expect(500)
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });

    describe('Test Disconnect', () => {
        const sessionRequest = session(app);
        before(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    done();
                });
        });
        it('Test disconnected (Expected 200)', (done) => {
            sessionRequest
                .get(`${mappingUrl}/disconnect`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });

        it('Excute disconnected (Expected 500)', (done) => {
            request(app)
                .get(`${mappingUrl}/disconnect`)
                .expect('Content-Type', /json/)
                .expect(500)
                .end((err, res) => {
                    done();
                });
        });
    });

    describe('Test Status', () => {
        const sessionRequest = session(app);
        beforeEach(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.body, connectParam);
                    done();
                });
        });
        it('Execute status API', (done) => {
            sessionRequest
                .get(`${mappingUrl}/`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert.deepStrictEqual(res.body, connectParam);
                    done();
                });
        });
    });

    describe('Meta Api Test !', () => {
        const sessionRequest = session(app);
        before(function (done) {
            sessionRequest
                .post(`${mappingUrl}/connect`)
                .send(connectParam)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.body, connectParam);
                    return done();
                });
        });
        it('Get Meta', (done) => {
            sessionRequest
                .get(`${mappingUrl}/meta`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    assert(!!res.body);
                    done();
                });
        });
    });

    it('Test Get Metadata NotConnected', (done) => {
        request(app)
            .get(`${mappingUrl}/meta`)
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });

});
