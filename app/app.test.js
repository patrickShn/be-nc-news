const app = require('./app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')




beforeEach(() => seed({articleData, commentData, topicData, userData}));
afterAll(() => db.end());

describe('GET',() => {
    describe('/api/topics', () => {
        test('return with an array of topic objects, which have a "slug" and "description" property ', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                // console.log(response)
               response.body.topics.forEach((topic) => {
                //testing for a truthy value to see if these properties exist
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string")
               })
            })
        });
  })
})

describe('GET',() => {
    describe('/api', () => {
        test('return with an object describing all endpoints available ', async () => {
            const response = await request(app).get('/api')
            expect(200)
            expect(response.body).toEqual(endpoints)
        });
  
        //  struggling on how to implement error handling  
  
  })
})


