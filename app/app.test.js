const app = require('./app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index.js')




beforeEach(() => seed({articleData, commentData, topicData, userData}));
afterAll(() => db.end());

describe('GET',() => {
    describe('/api/topics', () => {
        test('return with an array of topic objects, which have a "slug" and "description" property ', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
               response.body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string")
               })
            })
        });
  
        // test.only('handle errors', () => {
        //     return request(app)
        //     .get('/api/topic')
        //     .expect(404)
        //     .then((error) => {
        //         console.log(error.code)
        //         expect(error.msg).toEqual("Bad Request")
        //     })
 
     });
  
  });
