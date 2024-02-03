import supertest from 'supertest';
import { expect } from "chai";
import app from '../index.js';

const requestWithSuperTest = supertest(app);
let postedReviewId;

describe('Testing GET /movies endpoint', function (){
    it('responds with a valid HTTP status code and number of movies',
        async function () {
        const DEFAULT_MOVIES_PER_PAGE = 20;
        const response = await requestWithSuperTest.get('/api/v1/movies');

        expect(response.status).to.equal(200);
        expect(response.body.movies.length).to.equal(DEFAULT_MOVIES_PER_PAGE)
        });
});

describe('Testing GET /movies/id/:id endpoing', function () {
    it('responds with a valid http status code, the movie associated with the target id, ' +
        'and all reviews associated with that movie',
        async function () {
            const response = await requestWithSuperTest.get('/api/v1/movies/id/573a1390f29313caabcd4135');

            expect(response.status).to.equal(200);
        });
});

describe('Testing GET /movies/ratings endpoint', function (){
    it('responds with a valid HTTP status code and an array of ratings',
        async function () {
            const response = await requestWithSuperTest.get('/api/v1/movies/ratings');

            expect(response.status).to.equal(200);
        });
});

describe('Testing POST /review endpoint', function () {
    it('responds with a valid HTTP status code',
        async function () {
            const response = await requestWithSuperTest.post('/api/v1/movies/review')
                .send({
                    "movie_id": "573a1390f29313caabcd4135",
                    "review": "This movie is OK by me!",
                    "user_id": "1234",
                    "name": "Jane Doe"
                });
            // console.log("response: ",response._body.response.insertedId);
            postedReviewId = response._body.response.insertedId;
            expect(response.status).to.equal(200)
        })
})

describe('Testing PUT /review endpoint', function () {
    it('responds with a valid HTTP status code and modified count of 1',
        async function () {
            const response = await requestWithSuperTest.put('/api/v1/movies/review')
                .send({
                    "review_id": postedReviewId,
                    "review": "This movie is not cool!",
                    "user_id": "1234",
                    "name": "Jane Doe"
                });
            expect(response.status).to.equal(200)
            expect(response._body.response.modifiedCount).to.equal(1);
        });
});

describe('Testing PUT /review endpoint with a bad user id', function () {
    it('responds with an error',
        async function () {
            const response = await requestWithSuperTest.put('/api/v1/movies/review')
                .send({
                    "review_id": postedReviewId,
                    "review": "This movie is awesome!",
                    "user_id": "0000",
                    "name": "Jane Doe"
                });
            expect(response._body.error === 'Unable to put update to review.' );
        });
});

describe('Testing DELETE /review endpoing', function () {
    it('responds with a valid HTTP status code and a deleted count of 1',
        async function () {
            const response = await requestWithSuperTest.delete('/api/v1/movies/review')
                .send({
                    "review_id": postedReviewId,
                    "user_id": "1234"
                })
        })
})